const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateExternalTypeInput } = require('../../util/validators');
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
  Mutation: {
    async addExternalType(_, {
      name,
    }, context) {
      const { valid, errors } =
        validateExternalTypeInput(
          name
        );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newExternalType = new ExternalType({
        name,
        createdAt: new Date().toISOString()
      });

      const res = await newExternalType.save();

      return res;
    },
    async updateExternalType(_, {
      externalTypeId,
      name,
    }, context) {
      try {
        const { valid, errors } =
          validateExternalTypeInput(
            name
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const updatedExternalType = await ExternalType.findByIdAndUpdate(
          { _id: externalTypeId },
          {
            name
          },
          { new: true });

        return updatedExternalType;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteExternalType(_, { externalTypeId }, context) {
      try {
        const externalType = await ExternalType.findById(externalTypeId);
        await externalType.delete();
        return 'External type deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};