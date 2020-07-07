export const emailValidator = (email) => {
    const re = /\S+@\S+\.\S+/;
  
    if (!email || email.length <= 0) return 'Email cannot be empty.';
    if (!re.test(email)) return 'Ooops! We need a valid email address.';
  
    return '';
  };
  
  export const passwordValidator = (password) => {
    if (!password || password.length <= 0) return 'Password cannot be empty.';
  
    return '';
  };

  export const confirmPasswordValidator = (password, confirmPassword) => {
    if (password != confirmPassword ) {
      return 'Password not match.'
    }else if (!confirmPassword || confirmPassword.length <= 0){ 
      return 'Confirm password cannot be empty.'
    };
    return '';
  };
  
  export const nameValidator = (name) => {
    if (!name || name.length <= 0) return 'Name cannot be empty.';
  
    return '';
  };
  