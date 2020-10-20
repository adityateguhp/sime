const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')

const { validateRegisterOrganizationInput, validateLoginInput, validateUpdateOrganizationInput, validateUpdatePasswordInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config')
const Organization = require('../../model/Organization');
const checkAuth = require('../../util/check-auth');
const staffsResolvers = require('./staffs');

function generateToken(user) {
    return jwt.sign({
        typename: user.__typename,
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture
    }, SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
    Query: {
        async getOrganization(_, {organizationId}, context) {
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
        async loginOrganization(_, { email, password }) {
            const { valid, errors } = validateLoginInput(email, password);

            if (!valid) {
                throw new UserInputError('Error', { errors });
            }

            const organization = await Organization.findOne({ email });

            if (!organization) {
                errors.general = 'The email and password you entered did not match our records. Please double-check and try again.';
                throw new UserInputError('The email and password you entered did not match our records. Please double-check and try again.', { errors });
            }

            const match = await bcrypt.compare(password, organization.password);
            if (!match) {
                errors.general = 'The email and password you entered did not match our records. Please double-check and try again.'
                throw new UserInputError('The email and password you entered did not match our records. Please double-check and try again.', { errors });
            }

            const token = generateToken(organization);

            return {
                ...organization._doc,
                id: organization._id,
                token
            }
        },
        async registerOrganization(_, { name, email, password, confirmPassword, description, picture }, context, info) {
            // validate user data
            const { valid, errors } = validateRegisterOrganizationInput(name, email, password, confirmPassword);
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
                name,
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
        },
        async updateOrganization(_, {
            organizationId,
            name,
            email,
            description,
            picture
          }, context) {
            try {
              const { valid, errors } =
                validateUpdateOrganizationInput(
                  name,
                  email,
                );
              if (!valid) {
                throw new UserInputError('Error', { errors });
              }
      
              const updatedOrganization = await Organization.findByIdAndUpdate(
                { _id: organizationId },
                { 
                  name: name, 
                  email: email,
                  description: description,
                  picture: picture
                },
                { new: true });
      
              return updatedOrganization;
            } catch (err) {
              throw new Error(err);
            }
          },
          async updatePasswordOrganization(_, {
            organizationId,
            currentPassword,
            newPassword,
            confirmNewPassword
          }, context) {
            try {
              const { valid, errors } =
                validateUpdatePasswordInput(
                  newPassword,
                  confirmNewPassword
                );
              if (!valid) {
                throw new UserInputError('Error', { errors });
              }

              const organization = await Organization.findById(organizationId);
      
              const match = await bcrypt.compare(currentPassword, organization.password);
              if (!match) {
                  throw new UserInputError('Wrong credentials', {
                    errors: {
                        password: 'Wrong credentials'
                    }
                })
              }   
        
              newPassword = await bcrypt.hash(newPassword, 12);
      
              const updatedPasswordOrganization = await Organization.findByIdAndUpdate(
                { _id: organizationId },
                { 
                  password: newPassword
                },
                { new: true });
      
              return updatedPasswordOrganization;
            } catch (err) {
              throw new Error(err);
            }
          },
    }
}