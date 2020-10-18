const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server')

const { validateRegisterOrganizationInput, validateLoginInput } = require('../../util/validators');
const { SECRET_KEY } = require('../../config')
const Organization = require('../../model/Organization');
const Staff = require('../../model/Staff');
const checkAuth = require('../../util/check-auth');

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
        async getUser(_, args, context) {
            const user = checkAuth(context);
            try {
                const organization = await Organization.findById(user.id);
                if (organization) {
                    return organization;
                } else {
                    const staff = await Staff.findById(user.id);
                    if (staff) {
                        return staff;
                    } else {
                        throw new Error('User not found');
                    }
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async loginUser(_, { email, password }) {
            const { valid, errors } = validateLoginInput(email, password);

            if (!valid) {
                throw new UserInputError('Error', { errors });
            }

            const organization = await Organization.findOne({ email });
            const staff = await Staff.findOne({ email });

            if (organization) {
                const match = await bcrypt.compare(password, organization.password);
                if (!match) {
                    errors.general = 'Wrong credentials'
                    throw new UserInputError('Wrong credentials', { errors });
                } else {
                    const token = generateToken(organization);
                    return {
                        ...organization._doc,
                        id: organization._id,
                        token
                    }
                }
            } else if (staff) {
                const match = await bcrypt.compare(password, staff.password);
                if (!match) {
                    errors.general = 'Wrong credentials'
                    throw new UserInputError('Wrong credentials', { errors });
                } else {
                    const token = generateToken(staff);
                    return {
                        ...staff._doc,
                        id: staff._id,
                        token
                    }
                }
            } else {
                errors.general = 'User not found';
                throw new UserInputError('User not found', { errors });
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
        }
    }
}