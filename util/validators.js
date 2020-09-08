module.exports.validateRegisterOrganizationInput = (
    name,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (name.trim() === '') {
        errors.name = 'Organization name must not be empty';
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

module.exports.validateDepartmentInput = (name) => {
    const errors = {};
    if (name.trim() === '') {
        errors.name = 'Department name must not be empty';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateStaffInput = (
    name,
    position_name,
    email,
    phone_number
) => {
    const errors = {};
    if (name.trim() === '') {
        errors.name = 'Staff name must not be empty';
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

module.exports.validateUpdatePasswordStaffInput = (
    password,
    confirmPassword
) => {
    const errors = {};

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

module.exports.validateProjectInput = (
    name,
    start_date,
    end_date
) => {
    const errors = {};
    if (name.trim() === '') {
        errors.name = 'Project name must not be empty';
    }

    if (start_date.trim() === '') {
        errors.start_date = 'Project start date must not be empty';
    }

    if (end_date.trim() === '') {
        errors.end_date = 'Project end date must not be empty';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};