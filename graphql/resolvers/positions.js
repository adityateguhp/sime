const { UserInputError } = require('apollo-server');

const { validatePositionInput } = require('../../util/validators');
const Position = require('../../model/Position');

module.exports = {
  Query: {
    async getPositions(_, {organizationId}, context) {
      try {
        const positions = await Position.find({organization_id: organizationId}).sort({order: 1});
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
    async addPosition(_, { name, core, organizationId, order }, context) {
      const { valid, errors } = validatePositionInput(name);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }
      const newPosition = new Position({
        name,
        core,
        organization_id: organizationId,
        order,
        createdAt: new Date().toISOString()
      });

      const position = await newPosition.save();

      return position;
    },
    async updatePosition(_, { positionId, name, core }, context) {
      try {
        const { valid, errors } = validatePositionInput(name);
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const position = await Position.findById(positionId);
        if(position.order<'9' && core === false){
          throw new UserInputError("Core value can't be changed for this position", {
            errors: {
              position: "Core value can't be changed for this position"
            }
          })
        }
        
        const updatedPosition = await Position.findByIdAndUpdate({ _id: positionId }, { name: name, core: core }, { new: true });

        return updatedPosition;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deletePosition(_, { positionId }, context) {
      try {
        const position = await Position.findById(positionId);
        if(position.order<'9'){
            throw new UserInputError("This position can't be deleted", {
              errors: {
                position: "This position can't be deleted"
              }
            })
        }
        await position.delete();
        return 'Position deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};