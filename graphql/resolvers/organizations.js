const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')

const { validateRegisterOrganizationInput, validateLoginOrganizationInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config')
const Organization = require('../../model/Organization');

function generateToken(organization){
     return jwt.sign({
        id: organization.id,
        organization_name: organization.organization_name,
        email: organization.email
    }, SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
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
        async registerOrganization(_, { registerOrganizationInput: { organization_name, email, password, confirmPassword } }, context, info) {
            // validate user data
            const { valid, errors } = validateRegisterOrganizationInput(organization_name, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', { errors })
            }

            // Make sure email doesnt already exist
            const organization = await Organization.findOne({ email });
            if (organization) {
                throw new UserInputError('E-mail address is already exist', {
                    errors: {
                        email: 'This e-mail address already exist'
                    }
                })
            }
            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newOrganization = new Organization({
                organization_name,
                email,
                password,
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