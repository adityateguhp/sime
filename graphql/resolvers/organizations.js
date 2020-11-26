
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
    async addOrganization(_, { name, description, picture }, context, info) {

      const newOrganization = new Organization({
        name,
        description,
        picture,
        createdAt: new Date().toISOString()
      });

      const res = await newOrganization.save();

      return res;
    },
    async updateOrganization(_, {
      organizationId,
      name,
      description,
      picture
    }, context) {

      const updatedOrganization = await Organization.findByIdAndUpdate(
        { _id: organizationId },
        {
          name: name,
          description: description,
          picture: picture
        },
        { new: true });

      return updatedOrganization;

    },
  }
}