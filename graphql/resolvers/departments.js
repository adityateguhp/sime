const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateDepartmentInput } = require('../../util/validators');
const Department = require('../../model/Department');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getDepartments(_, args, context) {
      const user = checkAuth(context);
      try {
        const departments = await Department.find({ organization_id: user.id }).collation({ locale: "en" }).sort({ name: 1 });
        if (departments) {
          return departments;
        } else {
          throw new Error('Departments not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getDepartment(_, { departmentId }) {
      try {
        const department = await Department.findById(departmentId);
        if (department) {
          return department;
        } else {
          throw new Error('Department not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addDepartment(_, { name }, context) {
      const user = checkAuth(context);
      const { valid, errors } = validateDepartmentInput(name);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }
      const newDepartment = new Department({
        name,
        organization_id: user.id,
        createdAt: new Date().toISOString()
      });

      const department = await newDepartment.save();

      return department;
    },
    async updateDepartment(_, { departmentId, name }, context) {
      try {
        const { valid, errors } = validateDepartmentInput(name);
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }
        const updatedDepartment = await Department.findByIdAndUpdate({ _id: departmentId }, { name: name }, { new: true });

        return updatedDepartment;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteDepartment(_, { departmentId }, context) {
      const user = checkAuth(context);
      try {
        const department = await Department.findById(departmentId);
        if (user.id.toString() === department.organization_id.toString()) {
          await department.delete();
          return 'Department deleted successfully';
        } else {
          throw new AuthenticationError('Action not allowed');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};