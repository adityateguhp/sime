const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateDivisionInput } = require('../../util/validators');
const Division = require('../../model/Division');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getDivisions(_, {projectId}, context) {
      try {
        const divisions = await Division.find({ project_id: projectId }).sort({ name: 1 });
        if (divisions) {
          return divisions;
        } else {
          throw new Error('Divisions not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getDivision(_, { divisionId }) {
      try {
        const division = await Division.findById(divisionId);
        if (division) {
          return division;
        } else {
          throw new Error('Division not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addDivision(_, { name, projectId }, context) {
      const { valid, errors } = validateDivisionInput(name);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      if (name.toLowerCase() === "core committee") {
        throw new UserInputError('Core Committee is already exist', {
          errors: {
            division: 'Core Committee is already exist'
          }
        })
      }

      const newDivision = new Division({
        name,
        project_id: projectId,
        createdAt: new Date().toISOString()
      });

      const division = await newDivision.save();

      return division;
    },
    async updateDivision(_, { divisionId, name }, context) {
      try {
        const { valid, errors } = validateDivisionInput(name);
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        if (name.toLowerCase() === "core committee") {
          throw new UserInputError('Core Committee is already exist', {
            errors: {
              division: 'Core Committee is already exist'
            }
          })
        }

        const updatedDivision = await Division.findByIdAndUpdate({ _id: divisionId }, { name: name }, { new: true });

        return updatedDivision;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteDivision(_, { divisionId }, context) {
      try {
        const division = await Division.findById(divisionId);
        await division.delete();
        return 'Division deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};