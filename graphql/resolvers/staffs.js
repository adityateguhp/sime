const {UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');

const { validateAddStaffInput, validateUpdateStaffInput } = require('../../util/validators');
const Staff = require('../../model/Staff');


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
    async addStaff(_, {
      staff_name,
      position_name,
      department_id,
      email,
      phone_number,
      password,
      picture
    }, context) {
      const { valid, errors } =
        validateAddStaffInput(
          staff_name,
          position_name,
          email,
          phone_number
        );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      password = await bcrypt.hash(password, 12);

      const newDepartment = new Staff({
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
    async updateStaff(_, {
      staffId,
      staff_name,
      position_name,
      email,
      phone_number,
      password,
      confirmPassword,
      picture
    }, context) {
      try {
        const { valid, errors } =
          validateUpdateStaffInput(
            staff_name,
            position_name,
            email,
            phone_number,
            password,
            confirmPassword
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        password = await bcrypt.hash(password, 12);

        const updatedStaff = await Staff.findByIdAndUpdate(
          { _id: staffId },
          { 
            staff_name: staff_name, 
            position_name: position_name,
            email: email,
            phone_number: phone_number,
            password: password,
            picture: picture
          },
          { new: true });

        return updatedStaff;
      } catch (err) {
        throw new Error(err);
      }
    },
    async deleteStaff(_, { staffId }, context) {
      try {
        const staff = await Staff.findById(staffId);
        await staff.delete();
        return 'Staff deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};