const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateCommitteeInput } = require('../../util/validators');
const Committee = require('../../model/Committee');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getCommittees(_, { projectId }, context) {
            try {
                const committees = await Committee.find({ project_id: projectId }).sort({ createdAt: -1 });
                if (committees) {
                    return committees;
                } else {
                    throw new Error('Committees not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getCommitteesByStaff(_, { staffId }, context) {
            try {
                const committees = await Committee.find({ staff_id: staffId });
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
        },
        async getHeadProject(_, { projectId, positionId }) {
            try {
                const committee = await Committee.findOne({project_id: projectId, position_id: positionId});
                return committee;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getCommitteesInDivision(_, { divisionId }, context) {
            try {
                const committees = await Committee.find({ division_id: divisionId }).sort({ createdAt: -1 });
                if (committees) {
                    return committees;
                } else {
                    throw new Error('Committees not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async addCommittee(_, { staffId, positionId, divisionId, projectId }, context) {
            const { valid, errors } = validateCommitteeInput(staffId, divisionId, positionId);
            if (!valid) {
                throw new UserInputError('Error', { errors });
            }
            const newCommittee = new Committee({
                staff_id: staffId,
                position_id: positionId,
                division_id: divisionId,
                project_id: projectId,
                createdAt: new Date().toISOString()
            });

            const division = await newCommittee.save();

            return division;
        },
        async updateCommittee(_, { committeeId, staffId, divisionId, positionId }, context) {
            try {
                const { valid, errors } = validateCommitteeInput(staffId, divisionId, positionId);
                if (!valid) {
                    throw new UserInputError('Error', { errors });
                }
                const updatedCommittee = await Committee.findByIdAndUpdate({ _id: committeeId }, { staff_id: staffId, division_id: divisionId, position_id: positionId }, { new: true });

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