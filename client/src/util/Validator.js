  export const departmentNameValidator = (department_name) => {
    if (!department_name || department_name.length <= 0) return 'Department name cannot be empty.';
  
    return '';
  };