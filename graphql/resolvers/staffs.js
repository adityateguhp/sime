const { UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { validateStaffInput, validateUpdatePasswordInput, validateLoginInput, validateRegisterStaffInput } = require('../../util/validators');
const Staff = require('../../model/Staff');
const { SECRET_KEY } = require('../../config')
const checkAuth = require('../../util/check-auth');

function generateToken(user) {
  return jwt.sign({
    user_type: user.isAdmin ? "Organization" : "Staff",
    id: user.id,
    name: user.name,
    email: user.email,
    picture: user.picture
  }, SECRET_KEY, { expiresIn: '1h' })
}

module.exports = {
  Query: {
    async getStaffs(_, { organizationId }, context) {
      try {
        const staffs = await Staff.find({ organization_id: organizationId }).collation({ locale: "en" }).sort({ isAdmin: -1, name: 1 });
        if (staffs) {
          return staffs;
        } else {
          throw new Error('Staffs not found');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async getStaffsByDepartment(_, { departmentId }, context) {
      try {
        const staffs = await Staff.find({ department_id: departmentId }).collation({ locale: "en" }).sort({ isAdmin: -1, name: 1 });
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
    async loginStaff(_, { email, password }) {
      const { valid, errors } = validateLoginInput(email, password);

      if (!valid) {
        throw new UserInputError('Error', { errors });
      }

      const staff = await Staff.findOne({ email });

      if (!staff) {
        errors.general = 'The email and password you entered did not match our records. Please double-check and try again.';
        throw new UserInputError('The email and password you entered did not match our records. Please double-check and try again.', { errors });
      }

      const match = await bcrypt.compare(password, staff.password);
      if (!match) {
        errors.general = 'The email and password you entered did not match our records. Please double-check and try again.'
        throw new UserInputError('The email and password you entered did not match our records. Please double-check and try again.', { errors });
      }

      const token = generateToken(staff);

      return {
        ...staff._doc,
        id: staff._id,
        token
      }
    },
    async registerStaff(_, { name, email, password, confirmPassword }, context, info) {
      // validate user data
      const { valid, errors } = validateRegisterStaffInput(name, email, password, confirmPassword);
      if (!valid) {
        throw new UserInputError('Errors', { errors })
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
      // hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newStaff = new Staff({
        name,
        email,
        phone_number: '',
        password,
        picture: '',
        isAdmin: true,
        createdAt: new Date().toISOString()
      });

      const res = await newStaff.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token
      }
    },
    async addOrganizationStaff(_, {
      staffId,
      organizationId
    }, context) {

      const updatedStaff = await Staff.findByIdAndUpdate(
        { _id: staffId },
        {
          organization_id: organizationId
        },
        { new: true });

      return updatedStaff;

    },
    async addStaff(_, {
      name,
      department_position_id,
      department_id,
      email,
      phone_number,
      password,
      picture,
      organizationId,
      isAdmin
    }, context) {
      const { valid, errors } =
        validateStaffInput(
          name,
          department_id,
          department_position_id,
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
        department_position_id,
        organization_id: organizationId,
        department_id,
        email,
        phone_number,
        password,
        picture,
        isAdmin,
        createdAt: new Date().toISOString()
      });

      const res = await newStaff.save();

      return res;
    },
    async updateStaff(_, {
      staffId,
      name,
      department_position_id,
      department_id,
      email,
      phone_number,
      picture,
      isAdmin
    }, context) {
      try {
        const { valid, errors } =
          validateStaffInput(
            name,
            department_id,
            department_position_id,
            email,
            phone_number
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        const selectedStaff = await Staff.findById(staffId);

        if (email !== selectedStaff.email) {
          const staff = await Staff.findOne({ email });
          if (staff) {
            throw new UserInputError('Email address is already exist', {
              errors: {
                email: 'This email address already exist'
              }
            })
          }
        }

        const updatedStaff = await Staff.findByIdAndUpdate(
          { _id: staffId },
          {
            name: name,
            department_position_id: department_position_id,
            department_id: department_id,
            email: email,
            phone_number: phone_number,
            picture: picture,
            isAdmin: isAdmin
          },
          { new: true });

        return updatedStaff;
      } catch (err) {
        throw new Error(err);
      }
    },
    async updatePasswordStaff(_, {
      staffId,
      currentPassword,
      newPassword,
      confirmNewPassword
    }, context) {
      try {
        const staff = await Staff.findById(staffId);

        const match = await bcrypt.compare(currentPassword, staff.password);
        if (!match) {
          throw new UserInputError('Wrong credentials', {
            errors: {
              password: 'Wrong credentials'
            }
          })
        }

        const { valid, errors } =
          validateUpdatePasswordInput(
            newPassword,
            confirmNewPassword
          );
        if (!valid) {
          throw new UserInputError('Error', { errors });
        }

        newPassword = await bcrypt.hash(newPassword, 12);

        const updatedPasswordStaff = await Staff.findByIdAndUpdate(
          { _id: staffId },
          {
            password: newPassword
          },
          { new: true });

        return updatedPasswordStaff;
      } catch (err) {
        throw new Error(err);
      }
    },
    async resetPasswordStaff(_, {
      staffId
    }, context) {
      try {
        const newPassword = await bcrypt.hash("12345678", 12);

        const resetPasswordStaff = await Staff.findByIdAndUpdate(
          { _id: staffId },
          {
            password: newPassword
          },
          { new: true });

        return resetPasswordStaff;
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
    async deleteStaffByDepartment(_, { departmentId }, context) {
      try {
        const staff = await Staff.find({ department_id: departmentId });
        staff.map((data) => {
          data.deleteOne()
        })
        return 'Deleted successfully';
      } catch (err) {
        throw new Error(err);
      }
    },
  }
};