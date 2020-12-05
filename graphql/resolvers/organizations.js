const { UserInputError } = require('apollo-server');
const { validateOrganizationInput } = require('../../util/validators');
const Organization = require('../../model/Organization');

module.exports = {
  Query: {
    async getOrganization(_, { organizationId }, context) {
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
    async addOrganization(_, { name, email, description, picture, address, phone_number }, context, info) {

      const { valid, errors } = validateOrganizationInput(name, email);

      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newOrganization = new Organization({
        name,
        email,
        description,
        picture,
        address,
        phone_number,
        createdAt: new Date().toISOString()
      });

      const res = await newOrganization.save();

      return res;
    },
    async updateOrganization(_, {
      organizationId,
      name,
      email,
      description,
      picture,
      address,
      phone_number
    }, context) {

      const { valid, errors } = validateOrganizationInput(name, email);

      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const updatedOrganization = await Organization.findByIdAndUpdate(
        { _id: organizationId },
        {
          name: name,
          email: email,
          description: description,
          picture: picture,
          address: address,
          phone_number: phone_number
        },
        { new: true });

      return updatedOrganization;

    },
  }
}