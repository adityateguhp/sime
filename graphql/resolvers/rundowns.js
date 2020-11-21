const { UserInputError } = require('apollo-server');

const { validateRundownInput } = require('../../util/validators');
const Rundown = require('../../model/Rundown');
const checkAuth = require('../../util/check-auth');


module.exports = {
    Query: {
        async getRundowns(_, { eventId }, context) {
            try {
                const rundowns = await Rundown.find({ event_id: eventId }).sort({ date: 1, start_time: 1 });
                if (rundowns) {
                    return rundowns;
                } else {
                    throw new Error('Rundowns not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getRundown(_, { rundownId }) {
            try {
                const rundown = await Rundown.findById(rundownId);
                if (rundown) {
                    return rundown;
                } else {
                    throw new Error('Rundown not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async addRundown(_, {
            agenda,
            event_id,
            project_id,
            date,
            start_time,
            end_time,
            details
        }, context) {
            const { valid, errors } =
                validateRundownInput(
                    agenda,
                    date,
                    start_time,
                    end_time,
                );
            if (!valid) {
                throw new UserInputError('Error', { errors });
            }

            const newRundown = new Rundown({
                agenda,
                event_id,
                project_id,
                date,
                start_time,
                end_time,
                details,
                createdAt: new Date().toISOString()
            });

            const res = await newRundown.save();

            return res;
        },
        async updateRundown(_, {
            rundownId,
            agenda,
            date,
            start_time,
            end_time,
            details,
        }, context) {
            try {
                const { valid, errors } =
                    validateRundownInput(
                        agenda,
                        date,
                        start_time,
                        end_time,
                    );
                if (!valid) {
                    throw new UserInputError('Error', { errors });
                }

                const updatedRundown = await Rundown.findByIdAndUpdate(
                    { _id: rundownId },
                    {
                        agenda,
                        date,
                        start_time,
                        end_time,
                        details,
                    },
                    { new: true });

                return updatedRundown;
            } catch (err) {
                throw new Error(err);
            }
        },
        async deleteRundown(_, { rundownId }, context) {
            try {
                const rundown = await Rundown.findById(rundownId);
                await rundown.delete();
                return 'Rundown deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
    }
};