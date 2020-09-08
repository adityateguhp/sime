const {UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');

const { validateStaffInput, validateUpdatePasswordStaffInput } = require('../../util/validators');
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
      name,
      position_name,
      department_id,
      email,
      phone_number,
      password,
      picture
    }, context) {
      const { valid, errors } =
        validateStaffInput(
          name,
          position_name,
          email,
          phone_number
        );
      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      // Make sure email doesnt already exist
      const staff = await Staff.findOne({ email });
      if (staff) {
          throw new UserInputError('Email address is already exist', {
              errors: {
                  email: 'This email address already exist'
              }
          })
      }

      password = await bcrypt.hash(password, 12);

      const newStaff = new Staff({
        name,
        position_name,
        department_id,
        email,
        phone_number,
        password,
        picture,
        createdAt: new Date().toISOString()
      });

      const res = await newStaff.save();

      return res;
    },
    async updateStaff(_, {
      staffId,
      name,
      position_name,
      email,
      phone_number,
      picture
    }, context) {
      try {
        const { valid, errors } =
          validateStaffInput(
            name,
            position_name,
            email,
            phone_number,
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
          { _id: staffId },
          { 
            name: name, 
            position_name: position_name,
            email: email,
            phone_number: phone_number,
            picture: picture
          },
          { new: true });

        return updatedStaff;
      } catch (err) {
        throw new Error(err);
      }
    },
    async updatePasswordStaff(_, {
      staffId,
      password,
      confirmPassword
    }, context) {
      try {
        const { valid, errors } =
          validateUpdatePasswordStaffInput(
            password,
            confirmPassword
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        password = await bcrypt.hash(password, 12);

        const updatedPasswordStaff = await Staff.findByIdAndUpdate(
          { _id: staffId },
          { 
            password: password
          },
          { new: true });

        return updatedPasswordStaff;
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