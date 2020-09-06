const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')

const { validateRegisterOrganizationInput, validateLoginOrganizationInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config')
const Organization = require('../../model/Organization');

function generateToken(organization){
     return jwt.sign({
        typename: 'organization',
        id: organization.id,
        name: organization.organization_name,
        email: organization.email,
        description: organization.description,
        picture: organization.picture
    }, SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
    Query: {
        async getOrganization(_, { organizationId }) {
          try {
            const organization = await Organization.findById(organizationId);
            if (organization) {
              return organization;
            } else {
              throw new Error('Organization not found');
            }
          } catch (err) {
            throw new Error(err);
          }
        }
      },
    Mutation: {
        async loginOrganization(_, {email, password}){
            const {valid, errors} = validateLoginOrganizationInput(email, password);

            if(!valid){
                throw new UserInputError('Error', { errors });
            }

            const organization = await Organization.findOne({email});

            if(!organization){
                errors.general = 'Organization not found';
                throw new UserInputError('Organization not found', {errors});
            }

            const match = await bcrypt.compare(password, organization.password);
            if(!match){
                errors.general = 'Wrong credentials'
                throw new UserInputError('Wrong credentials', { errors });
            }

            const token = generateToken(organization);

            return {
                ...organization._doc,
                id: organization._id,
                token
            }
        },
        async registerOrganization(_, { organization_name, email, password, confirmPassword, description, picture }, context, info) {
            // validate user data
            const { valid, errors } = validateRegisterOrganizationInput(organization_name, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // Make sure email doesnt already exist
            const organization = await Organization.findOne({ email });
            if (organization) {
                throw new UserInputError('Email address is already exist', {
                    errors: {
                        email: 'This email address already exist'
                    }
                })
            }
            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newOrganization = new Organization({
                organization_name,
                email,
                password,
                description,
                picture,
                createdAt: new Date().toISOString()
            });

            const res = await newOrganization.save();

            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            }
        }
    }
}