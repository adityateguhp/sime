const { AuthenticationError, UserInputError } = require('apollo-server');

const { validateAddDepartmentInput } = require('../../util/validators');
const Department = require('../../model/Department');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getDepartments(_, args, context) {
      const organization = checkAuth(context);
      try {
        const departments = await Department.find({ organization_id: organization.id }).sort({ createdAt: -1 });
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
    async addDepartment(_, { department_name }, context) {
      const organization = checkAuth(context);
      const { valid, errors } = validateAddDepartmentInput(department_name);
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }
      const newDepartment = new Department({
        department_name,
        organization_id: organization.id,
        createdAt: new Date().toISOString()
      });

      const department = await newDepartment.save();

      return department;
    },
    async updateDepartment(_, { departmentId, department_name }, context) {
      try {
        if (department_name.trim() === '') {
          throw new Error('Department name must not be empty')
        }
        const updateDepartment = await Department.findByIdAndUpdate({ _id: departmentId }, { department_name: department_name }, { new: true });

        return updateDepartment;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteDepartment(_, { departmentId }, context) {
      const organization = checkAuth(context);
      try {
        const department = await Department.findById(departmentId);
        if (organization.id.toString() === department.organization_id.toString()) {
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