const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateComiteeInput } = require('../../util/validators');
const Comitee = require('../../model/Comitee');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getComitees(_, { projectId }, context) {
            try {
                const comitees = await Comitee.find({ project_id: projectId }).sort({ createdAt: -1 });
                if (comitees) {
                    return comitees;
                } else {
                    throw new Error('Comitees not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getComitee(_, { comiteeId }) {
            try {
                const comitee = await Comitee.findById(comiteeId);
                if (comitee) {
                    return comitee;
                } else {
                    throw new Error('Comitee not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getHeadProject(_, { projectId, positionId }) {
            try {
                const comitee = await Comitee.findOne({project_id: projectId, position_id: positionId});
                return comitee;
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async addComitee(_, { staffId, positionId, divisionId, projectId }, context) {
            const user = checkAuth(context);
            const { valid, errors } = validateComiteeInput(staffId, divisionId, positionId);
            if (!valid) {
                throw new UserInputError('Error', { errors });
            }
            const newComitee = new Comitee({
                staff_id: staffId,
                position_id: positionId,
                division_id: divisionId,
                project_id: projectId,
                createdAt: new Date().toISOString()
            });

            const division = await newComitee.save();

            return division;
        },
        async updateComitee(_, { comiteeId, staffId, divisionId, positionId }, context) {
            try {
                const { valid, errors } = validateComiteeInput(staffId, divisionId, positionId);
                if (!valid) {
                    throw new UserInputError('Error', { errors });
                }
                const updatedComitee = await Comitee.findByIdAndUpdate({ _id: comiteeId }, { staff_id: staffId, division_id: divisionId, position_id: positionId }, { new: true });

                return updatedComitee;
            } catch (err) {
                throw new Error(err);
            }
        },
        async deleteComitee(_, { comiteeId }, context) {
            try {
                const comitee = await Comitee.findById(comiteeId);
                await comitee.delete();
                return 'Comitee deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
    }
};