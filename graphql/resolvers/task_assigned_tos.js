const { AuthenticationError, UserInputError } = require('apollo-server');

const Task_assigned_to = require('../../model/Task_assigned_to');

module.exports = {
    Query: {
        async getAssignedTasks(_, { taskId }, context) {
            try {
                const assignedTasks = await Task_assigned_to.find({ task_id: taskId }).sort({ createdAt: -1 });
                if (assignedTasks) {
                    return assignedTasks;
                } else {
                    throw new Error('Not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getAssignedTask(_, { assignedId }) {
            try {
                const assignedTask = await Task_assigned_to.findById(assignedId);
                if (assignedTask) {
                    return assignedTask;
                } else {
                    throw new Error('Not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getAssignedTasksByCommittee(_, { committeeId }) {
            try {
                const assignedTask = await Task_assigned_to.find({ committee_id: committeeId });
                if (assignedTask) {
                    return assignedTask;
                } else {
                    throw new Error('Not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
    },
    Mutation: {
        async assignedTask(_, { taskId, committeeId }, context) {

            const newAssign = new Task_assigned_to({
                task_id: taskId,
                committee_id: committeeId,
                createdAt: new Date().toISOString()
            });

            const assign = await newAssign.save();

            return assign;
        },
        async deleteAssignedTask(_, { assignedId }, context) {
            try {
                const assign = await Task_assigned_to.findById(assignedId);
                await assign.delete();
                return 'Deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
        async deleteAssignedTaskByCommittee(_, { committeeId }, context) {
            try {
                const assign = await Task_assigned_to.find({ committee_id: committeeId });
                assign.map((data) => {
                    data.deleteOne()
                })
                return 'Deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
        async deleteAssignedTaskByTask(_, { taskId }, context) {
            try {
                const assign = await Task_assigned_to.find({ task_id: taskId });
                assign.map((data) => {
                    data.deleteOne()
                })
                return 'Deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
    }
};