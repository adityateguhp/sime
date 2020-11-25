const { AuthenticationError, UserInputError } = require('apollo-server');

const Task_assigned_to = require('../../model/Task_assigned_to');

module.exports = {
    Query: {
        async getAssignedTasks(_, { roadmapId }, context) {
            try {
                const assignedTasks = await Task_assigned_to.find({ roadmap_id: roadmapId }).sort({ createdAt: -1 });
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
        async getAssignedTasksByPersonInCharge(_, { personInChargeId }) {
            try {
                const assignedTask = await Task_assigned_to.find({ person_in_charge_id: personInChargeId });
                if (assignedTask) {
                    return assignedTask;
                } else {
                    throw new Error('Not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getAssignedTasksByStaff(_, { staffId }) {
            try {
                const assignedTask = await Task_assigned_to.find({ staff_id: staffId });
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
        async assignedTask(_, { taskId, staffId, personInChargeId, projectId, eventId, roadmapId }, context) {

            const newAssign = new Task_assigned_to({
                task_id: taskId,
                staff_id: staffId,
                person_in_charge_id: personInChargeId,
                project_id: projectId,
                event_id: eventId,
                roadmap_id: roadmapId,
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
        async deleteAssignedTaskByPersonInCharge(_, { personInChargeId }, context) {
            try {
                const assign = await Task_assigned_to.find({ person_in_charge_id: personInChargeId });
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