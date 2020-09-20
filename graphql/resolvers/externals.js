const { UserInputError } = require('apollo-server');

const { validateExternalInput } = require('../../util/validators');
const External = require('../../model/External');
const checkAuth = require('../../util/check-auth');


module.exports = {
  Query: {
    async getExternals(_, {eventId}, context) {
      try {
        const externals = await External.find({ event_id: eventId }).sort({ createdAt: -1 });
        if (externals) {
          return externals;
        } else {
          throw new Error('Externals not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getExternal(_, { externalId }) {
      try {
        const external = await External.findById(externalId);
        if (external) {
          return external;
        } else {
          throw new Error('External not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getExternalByType(_, {eventId, externalType}, context) {
        try {
          const externals = await External.find({ event_id: eventId, external_type: externalType }).sort({ createdAt: -1 });
          if (externals) {
            return externals;
          } else {
            throw new Error('Externals not found');
          }
        } catch (err) {
          throw new Error(err);
        }
      },
  },
  Mutation: {
    async addExternal(_, {
      name,
      external_type,
      event_id,
      email,
      phone_number,
      details,
      picture,
    }, context) {
      const { valid, errors } =
        validateExternalInput(
          name,
          email,
          phone_number
        );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newExternal = new External({
        name,
        external_type,
        event_id,
        email,
        phone_number,
        details,
        picture,
        createdAt: new Date().toISOString()
      });

      const res = await newExternal.save();

      return res;
    },
    async updateExternal(_, {
      externalId,
      name,
      email,
      phone_number,
      details,
      picture,
    }, context) {
      try {
        const { valid, errors } =
          validateExternalInput(
            name,
            email,
            phone_number
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const updatedExternal = await External.findByIdAndUpdate(
          { _id: externalId },
          {
            name,
            email,
            phone_number,
            details,
            picture,
          },
          { new: true });

        return updatedExternal;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteExternal(_, { externalId }, context) {
      try {
        const external = await External.findById(externalId);
        await external.delete();
        return 'External deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};