const { UserInputError } = require('apollo-server');

const { validateProjectInput } = require('../../util/validators');
const Project = require('../../model/Project');
const checkAuth = require('../../util/check-auth');


module.exports = {
  Query: {
    async getProjects(_, {organizationId}, context) {
      try {
        const projects = await Project.find({ organization_id: organizationId }).sort({ createdAt: -1 });
        if (projects) {
          return projects;
        } else {
          throw new Error('Projects not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getProject(_, { projectId }) {
      try {
        const project = await Project.findById(projectId);
        if (project) {
          return project;
        } else {
          throw new Error('Project not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addProject(_, {
      name,
      description,
      start_date,
      end_date,
      picture,
      organizationId
    }, context) {
      const { valid, errors } =
        validateProjectInput(
          name,
          start_date,
          end_date
        );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const newProject = new Project({
        name,
        description,

        start_date,
        end_date,
        organization_id: organizationId,
        picture,
        createdAt: new Date().toISOString()
      });

      const res = await newProject.save();

      return res;
    },
    async updateProject(_, {
      projectId,
      name,
      description,
      start_date,
      end_date,
      picture
    }, context) {
      try {
        const { valid, errors } =
          validateProjectInput(
            name,
            start_date,
            end_date
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const updatedProject = await Project.findByIdAndUpdate(
          { _id: projectId },
          {
            name,
            description,
    
            start_date,
            end_date,
            picture,
          },
          { new: true });

        return updatedProject;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteProject(_, { projectId }, context) {
      try {
        const project = await Project.findById(projectId);
        await project.delete();
        return 'Project deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};