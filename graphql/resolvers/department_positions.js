const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateDepartmentPositionInput } = require('../../util/validators');
const Department_position = require('../../model/Department_position');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getDepartmentPositions(_, {organizationId}, context) {
      try {
        const positions = await Department_position.find({organization_id: organizationId}).sort({order: 1});
        if (positions) {
          return positions;
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getDepartmentPosition(_, { departmentPositionId }) {
      try {
        const position = await Department_position.findById(departmentPositionId);
        if (position) {
          return position;
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addDepartmentPosition(_, { name, organizationId }, context) {
      const { valid, errors } = validateDepartmentPositionInput(name);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }
      const newPosition = new Department_position({
        name,
        organization_id: organizationId,
        createdAt: new Date().toISOString()
      });

      const position = await newPosition.save();

      return position;
    },
    async updateDepartmentPosition(_, { departmentPositionId, name }, context) {
      try {
        const { valid, errors } = validateDepartmentPositionInput(name);
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }
        const updatedPosition = await Department_position.findByIdAndUpdate({ _id: departmentPositionId }, { name: name }, { new: true });

        return updatedPosition;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteDepartmentPosition(_, { departmentPositionId }, context) {
      try {
        const position = await Department_position.findById(departmentPositionId);
        await position.delete();
        return 'Position deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};