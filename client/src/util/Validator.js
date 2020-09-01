export const departmentNameValidator = (department_name) => {
  if (!department_name || department_name.length <= 0) return 'Department name must not be empty';
  return '';
};

export const staffNameValidator = (staff_name) => {
  if (staff_name.trim() === '') return 'Staff name must not be empty';
  return '';
}

export const positionNameValidator = (position_name) => {
  if (position_name.trim() === '') return 'Position name must not be empty';
  return '';
}

export const emailValidator = (email) => {
  if (email.trim() === ''){
    return 'Email address must not be empty';
  }else {
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
    if (!email.match(regEx)) {
     return 'Ooops! We need a valid email address';
    }
  }
  return '';
}

export const phoneNumberValidator = (phone_number) => {
  if (phone_number.trim() === '') return 'Phone number must not be empty';
  return '';
}

export const passwordValidator = (password, confirmPassword) => {
  if (password === '') {
    return 'Password must not be empty';
  } else if (password.length < 8) {
    return 'Use 8 characters or more for your password';
  }
  else if (password !== confirmPassword) {
    return 'Passwords must match';
  }
  return '';
}




