const { UserInputError } = require('apollo-server');

const { validateTaskInput } = require('../../util/validators');
const Task = require('../../model/Task');

module.exports = {
    Query: {
        async getTasks(_, { roadmapId }, context) {
            try {
                const tasks = await Task.find({ roadmap_id: roadmapId }).sort({ createdAt: -1, completed: 1 });
                if (tasks) {
                    return tasks;
                } else {
                    throw new Error('Tasks not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getTasksCreatedBy(_, { createdBy }, context) {
            try {
                const tasks = await Task.find({ createdBy: createdBy }).sort({ createdAt: -1, completed: 1 });
                if (tasks) {
                    return tasks;
                } else {
                    throw new Error('Tasks not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        },
        async getTask(_, { taskId }) {
            try {
                const task = await Task.findById(taskId);
                if (task) {
                    return task;
                } else {
                    throw new Error('Task not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async addTask(_, {
            name,
            description,
            completed,
            due_date,
            completed_date,
            priority,
            roadmapId,
            createdBy
        }, context) {
            const { valid, errors } =
                validateTaskInput(
                    name
                );
            if (!valid) {
                throw new UserInputError('Error', { errors });
            }

            const newTask = new Task({
                name,
                description,
                completed,
                due_date,
                completed_date,
                priority,
                roadmap_id: roadmapId,
                createdAt: new Date().toISOString(),
                createdBy
            });

            const res = await newTask.save();

            return res;
        },
        async updateTask(_, {
            taskId,
            name,
            description,
            completed,
            due_date,
            completed_date,
            priority
        }, context) {
            try {
                const { valid, errors } =
                    validateTaskInput(
                        name
                    );
                if (!valid) {
                    throw new UserInputError('Error', { errors });
                }

                const updatedTask = await Task.findByIdAndUpdate(
                    { _id: taskId },
                    {
                        name,
                        description,
                        completed,
                        due_date,
                        completed_date,
                        priority
                    },
                    { new: true });

                return updatedTask;
            } catch (err) {
                throw new Error(err);
            }
        },
        async deleteTask(_, { taskId }, context) {
            try {
                const task = await Task.findById(taskId);
                await task.delete();
                return 'Task deleted successfully';
            } catch (err) {
                throw new Error(err);
            }
        },
        async completedTask(_, {
            taskId,
            completed,
            completed_date,
          }, context) {
            try {
      
              const updatedTask = await Task.findByIdAndUpdate(
                { _id: taskId },
                {
                  completed,
                  completed_date,
                },
                { new: true });
      
              return updatedTask;
            } catch (err) {
              throw new Error(err);
            }
          },
      
    }
};