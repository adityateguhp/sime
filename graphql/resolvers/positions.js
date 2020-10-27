const { AuthenticationError, UserInputError } = require('apollo-server');

const { validatePositionInput } = require('../../util/validators');
const Position = require('../../model/Position');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPositions(_, args, context) {
      try {
        const positions = await Position.find().sort({order: 1});
        if (positions) {
          return positions;
        } else {
          throw new Error('Positions not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPosition(_, { positionId }) {
      try {
        const position = await Position.findById(positionId);
        if (position) {
          return position;
        } else {
          throw new Error('Position not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addPosition(_, { name, core, order }, context) {
      const { valid, errors } = validatePositionInput(name, core);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }
      const newPosition = new Position({
        name,
        core,
        order,
        createdAt: new Date().toISOString()
      });

      const position = await newPosition.save();

      return position;
    },
    async updatePosition(_, { positionId, name, core, order }, context) {
      try {
        const { valid, errors } = validatePositionInput(name, core);
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }
        const updatedPosition = await Position.findByIdAndUpdate({ _id: positionId }, { name: name, core: core, order: order }, { new: true });

        return updatedPosition;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deletePosition(_, { positionId }, context) {
      try {
        const position = await Position.findById(positionId);
        await position.delete();
        return 'Department deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};