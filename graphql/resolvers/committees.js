const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateCommitteeInput } = require('../../util/validators');
const Committee = require('../../model/Committee');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getCommittees(_, {organizationId}, context) {
      try {
        const committees = await Committee.find({ organization_id: organizationId }).sort({ name: 1 });
        if (committees) {
          return committees;
        } else {
          throw new Error('Committees not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getCommittee(_, { committeeId }) {
      try {
        const committee = await Committee.findById(committeeId);
        if (committee) {
          return committee;
        } else {
          throw new Error('Committee not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addCommittee(_, { name, organizationId }, context) {
      const { valid, errors } = validateCommitteeInput(name);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newCommittee = new Committee({
        name,
        organization_id: organizationId,
        createdAt: new Date().toISOString()
      });

      const committee = await newCommittee.save();

      return committee;
    },
    async updateCommittee(_, { committeeId, name }, context) {
      try {
        const { valid, errors } = validateCommitteeInput(name);
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        if (name.toLowerCase() === "core committee") {
          throw new UserInputError('Core Committee is already exist', {
            errors: {
              committee: 'Core Committee is already exist'
            }
          })
        }

        const updatedCommittee = await Committee.findByIdAndUpdate({ _id: committeeId }, { name: name }, { new: true });

        return updatedCommittee;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteCommittee(_, { committeeId }, context) {
      try {
        const committee = await Committee.findById(committeeId);
        await committee.delete();
        return 'Committee deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};