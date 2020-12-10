const { AuthenticationError, UserInputError } = require('apollo-server');

const { validatePersonInChargeInput } = require('../../util/validators');
const Person_in_charge = require('../../model/Person_in_charge');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getPersonInCharges(_, { projectId }, context) {
            try {
                const person_in_charges = await Person_in_charge.find({ project_id: projectId }).sort({ order: 1 });
                if (person_in_charges) {
                    return person_in_charges;
                } else {
                    throw new Error('Person in charge not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPersonInChargesByStaff(_, { staffId }, context) {
            try {
                const person_in_charges = await Person_in_charge.find({ staff_id: staffId });
                if (person_in_charges) {
                    return person_in_charges;
                } else {
                    throw new Error('Person in charge not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPersonInChargesByOrganization(_, { organizationId }, context) {
            try {
                const person_in_charges = await Person_in_charge.find({ organization_id: organizationId });
                if (person_in_charges) {
                    return person_in_charges;
                } else {
                    throw new Error('Person in charge not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPersonInChargesByStaffProject(_, { staffId, projectId }, context) {
            try {
                const person_in_charges = await Person_in_charge.findOne({ staff_id: staffId, project_id: projectId });
                if (person_in_charges) {
                    return person_in_charges;
                } else {
                    throw new Error('Person in charge not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPersonInCharge(_, { personInChargeId }) {
            try {
                const person_in_charge = await Person_in_charge.findById(personInChargeId);
                if (person_in_charge) {
                    return person_in_charge;
                } else {
                    throw new Error('Person in charge not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getHeadProject(_, { projectId, order }) {
            try {
                const person_in_charge = await Person_in_charge.findOne({project_id: projectId, order: order});
                return person_in_charge;
            } catch (err) {
                throw new Error(err);
            }
        },
        async getPersonInChargesInCommittee(_, { committeeId }, context) {
            try {
                const person_in_charges = await Person_in_charge.find({ committee_id: committeeId }).sort({ order: 1 });
                if (person_in_charges) {
                    return person_in_charges;
                } else {
                    throw new Error('Person in charge not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async addPersonInCharge(_, { staffId, positionId, committeeId, projectId, organizationId, order }, context) {
            const { valid, errors } = validatePersonInChargeInput(staffId, committeeId, positionId);
            if (!valid) {
                throw new UserInputError('Error', { errors });
            }
            const newPersonInCharge = new Person_in_charge({
                staff_id: staffId,
                position_id: positionId,
                committee_id: committeeId,
                project_id: projectId,
                organization_id: organizationId,
                order,
                createdAt: new Date().toISOString()
            });

            const person_in_charge = await newPersonInCharge.save();

            return person_in_charge;
        },
        async updatePersonInCharge(_, { personInChargeId, staffId, committeeId, positionId, order }, context) {
            try {
                const { valid, errors } = validatePersonInChargeInput(staffId, committeeId, positionId);
                if (!valid) {
                    throw new UserInputError('Error', { errors });
                }
                const updatedPersonInCharge = await Person_in_charge.findByIdAndUpdate({ _id: personInChargeId }, { staff_id: staffId, committee_id: committeeId, position_id: positionId, order: order }, { new: true });

                return updatedPersonInCharge;
            } catch (err) {
                throw new Error(err);
            }
        },
        async deletePersonInCharge(_, { personInChargeId }, context) {
            try {
                const person_in_charge = await Person_in_charge.findById(personInChargeId);
                await person_in_charge.delete();
                return 'Person in charge deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
        async deletePersonInChargeByProject(_, { projectId }, context) {
            try {
                const person_in_charge = await Person_in_charge.find({ project_id: projectId });
                person_in_charge.map((data) => {
                    data.deleteOne()
                })
                return 'Deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
    }
};