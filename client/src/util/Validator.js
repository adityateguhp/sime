export const departmentNameValidator = (name) => {
  if (!name || name.length <= 0) return 'Department name must not be empty';
  return '';
};

export const staffNameValidator = (name) => {
  if (!name || name.length <= 0) return 'Staff name must not be empty';
  return '';
}

export const projectNameValidator = (name) => {
  if (!name || name.length <= 0) return 'Project name must not be empty';
  return '';
}

export const eventNameValidator = (name) => {
  if (!name || name.length <= 0) return 'Event name must not be empty';
  return '';
}

export const divisionNameValidator = (name) => {
  if (!name || name.length <= 0) return 'Division name must not be empty';
  return '';
}

export const dateValidator = (start_date, end_date) => {
  if ((!start_date || start_date.length <= 0) && (!end_date || end_date.length <= 0)){
    return 'Date must not be empty';
  } else if (!start_date || start_date.length <= 0 ) {
    return 'Start date must not be empty';
  } else if (!end_date || end_date.length <= 0 ) {
    return 'End date must not be empty';
  }
  return '';
}

export const positionNameValidator = (position_name) => {
  if (!position_name || position_name.length <= 0) return 'Position name must not be empty';
  return '';
}

export const emailValidator = (email) => {
  if (!email || email.length <= 0){
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
  if (!phone_number || phone_number.length <= 0) return 'Phone number must not be empty';
  return '';
}

export const passwordValidator = (password, confirmPassword) => {
  if (!password || password.length <= 0) {
    return 'Password must not be empty';
  } else if (password.length < 8) {
    return 'Use 8 characters or more for your password';
  }
  else if (password !== confirmPassword) {
    return 'Passwords must match';
  }
  return '';
}




