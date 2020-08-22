const { AuthenticationError, UserInputError } = require('apollo-server');

const Staff = require('../../model/Staff');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getStaffs(_, { departmentId }, context) {
      try {
        const staffs = await Staff.find({ department_id: departmentId }).sort({ createdAt: -1 });
        if (staffs) {
          return staffs;
        } else {
          throw new Error('Staffs not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getStaff(_, { staffId }) {
      try {
        const staff = await Staff.findById(staffId);
        if (staff) {
          return staff;
        } else {
          throw new Error('Staff not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async addStaff(_, { staff_name, position_name, department_id, email,	phone_number,	password,	picture }, context) {
      if (department_name.trim() === '') {
        throw new Error('Department name must not be empty')
      }
      const newDepartment = new Department({
        staff_name,
        position_name,
        department_id,
        email,
        phone_number,
        password,
        picture,
        createdAt: new Date().toISOString()
      });

      const department = await newDepartment.save();

      return department;
    },
    async updateDepartment(_, {departmentId, department_name}, context) {
      try {
        if (department_name.trim() === '') {
          throw new Error('Department name must not be empty')
        } 
        const updateDepartment = await Department.findByIdAndUpdate({_id: departmentId}, {department_name: department_name}, {new: true});

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