const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateCommitteeInput } = require('../../util/validators');
const Committee = require('../../model/Committee');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getCommittees(_, {organizationId}, context) {
      try {
        const committees = await Committee.find({ organization_id: organizationId }).sort({ core: -1, name: 1  });
        if (committees) {
          return committees;
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
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addCommittee(_, { name, core, organizationId }, context) {
      const { valid, errors } = validateCommitteeInput(name);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newCommittee = new Committee({
        name,
        core,
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

        const updatedCommittee = await Committee.findByIdAndUpdate({ _id: committeeId }, { name: name}, { new: true });

        return updatedCommittee;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteCommittee(_, { committeeId }, context) {
      try {
        const committee = await Committee.findById(committeeId);

        if (committee.core) {
          throw new UserInputError("This committee can't be deleted", {
            errors: {
              committee: "This committee can't be deleted"
            }
          })
        }
       
        await committee.delete();
        return 'Committee deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};