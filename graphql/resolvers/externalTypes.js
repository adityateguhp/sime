const { AuthenticationError, UserInputError } = require('apollo-server');

const ExternalType = require('../../model/ExternalType');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getExternalTypes(_, args, context) {
      try {
        const externalTypes = await ExternalType.find();
        if (externalTypes) {
          return externalTypes;
        } else {
          throw new Error('Externals not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getExternalType(_, { exTypeId }) {
      try {
        const ExternalType = await ExternalType.findById(exTypeId);
        if (ExternalType) {
          return ExternalType;
        } else {
          throw new Error('External not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
};