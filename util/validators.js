module.exports.validateRegisterOrganizationInput = (
    organization_name,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (organization_name.trim() === '') {
        errors.organization_name = 'Organization name must not be empty';
    }

    if (email.trim() === '') {
        errors.email = 'Email address must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Ooops! We need a valid email address';
        }
    }

    if (password === '') {
        errors.password = 'Password must not be empty';
    } else if (password.length < 8) {
        errors.confirmPassword = 'Use 8 characters or more for your password';
    }
    else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateLoginOrganizationInput = (email, password) => {
    const errors = {};
    if (email.trim() === '') {
        errors.email = 'Email address must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Ooops! We need a valid email address';
        }
    }

    if (password === '') {
        errors.password = 'Password must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateDepartmentInput = (department_name) => {
    const errors = {};
    if (department_name.trim() === '') {
        errors.department_name = 'Department name must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateAddStaffInput = (
    staff_name,
    position_name,
    email,
    phone_number
) => {
    const errors = {};
    if (staff_name.trim() === '') {
        errors.staff_name = 'Staff name must not be empty';
    }

    if (position_name.trim() === '') {
        errors.position_name = 'Position name must not be empty';
    }

    if (email.trim() === '') {
        errors.email = 'Email address must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Ooops! We need a valid email address';
        }
    }

    if (phone_number.trim() === '') {
        errors.phone_number = 'Phone number must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateUpdateStaffInput = (
    staff_name,
    position_name,
    email,
    phone_number,
    password,
    confirmPassword
) => {
    const errors = {};
    if (staff_name.trim() === '') {
        errors.staff_name = 'Staff name must not be empty';
    }

    if (position_name.trim() === '') {
        errors.position_name = 'Position name must not be empty';
    }

    if (email.trim() === '') {
        errors.email = 'Email address must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'Ooops! We need a valid email address';
        }
    }

    if (phone_number.trim() === '') {
        errors.phone_number = 'Phone number must not be empty';
    }

    if (password === '') {
        errors.password = 'Password must not be empty';
    } else if (password.length < 8) {
        errors.confirmPassword = 'Use 8 characters or more for your password';
    }
    else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords must match';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};