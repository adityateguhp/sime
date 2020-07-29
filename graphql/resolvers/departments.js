const { AuthenticationError, UserInputError } = require('apollo-server');

const Department = require('../../model/Department');
const checkAuth = require('../../util/check-auth');

module.exports = {
    Query: {
        async getDepartments(_, args, context) {
          const organization = checkAuth(context);
            try {
              const department = await Department.find({organization_id: organization.id}).sort({createdAt: -1});
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
        async addDepartment(_, { department_name }, context){
            const organization = checkAuth(context);
            if(department_name.trim() === ''){
              throw new Error('Department name must not be empty')
            }
            const newDepartment = new Department({
                department_name,
                organization_id: organization.id,
                createdAt: new Date().toISOString()
            });

            const department = await newDepartment.save();

            return department;
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