const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateCommitteeInput } = require('../../util/validators');
const Committee = require('../../model/Committee');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getCommittees(_, { projectId }, context) {
            try {
                const committees = await Committee.find({ project_id: projectId }).sort({ order: 1 });
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
        async getCommitteesByOrganization(_, { organizationId }, context) {
            try {
                const committees = await Committee.find({ organization_id: organizationId });
                if (committees) {
                    return committees;
                } else {
                    throw new Error('Committees not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getCommitteesByStaffProject(_, { staffId, projectId }, context) {
            try {
                const committees = await Committee.findOne({ staff_id: staffId, project_id: projectId });
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
        async getHeadProject(_, { projectId, order }) {
            try {
                const committee = await Committee.findOne({project_id: projectId, order: order});
                return committee;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getCommitteesInDivision(_, { divisionId }, context) {
            try {
                const committees = await Committee.find({ division_id: divisionId }).sort({ order: 1 });
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
        async addCommittee(_, { staffId, positionId, divisionId, projectId, organizationId, order }, context) {
            const { valid, errors } = validateCommitteeInput(staffId, divisionId, positionId);
            if (!valid) {
                throw new UserInputError('Error', { errors });
            }
            const newCommittee = new Committee({
                staff_id: staffId,
                position_id: positionId,
                division_id: divisionId,
                project_id: projectId,
                organization_id: organizationId,
                order,
                createdAt: new Date().toISOString()
            });

            const committee = await newCommittee.save();

            return committee;
        },
        async updateCommittee(_, { committeeId, staffId, divisionId, positionId, order }, context) {
            try {
                const { valid, errors } = validateCommitteeInput(staffId, divisionId, positionId);
                if (!valid) {
                    throw new UserInputError('Error', { errors });
                }
                const updatedCommittee = await Committee.findByIdAndUpdate({ _id: committeeId }, { staff_id: staffId, division_id: divisionId, position_id: positionId, order: order }, { new: true });

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
        async deleteCommitteeByDivision(_, { divisionId }, context) {
            try {
                const committee = await Committee.find({ division_id: divisionId });
                committee.map((data) => {
                    data.deleteOne()
                })
                return 'Deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
        async deleteCommitteeByStaff(_, { staffId }, context) {
            try {
                const committee = await Committee.find({ staff_id: staffId });
                committee.map((data) => {
                    data.deleteOne()
                })
                return 'Deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
    }
};