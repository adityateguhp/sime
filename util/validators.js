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
        errors.email = 'E-mail address must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'E-mail must be a valid e-mail address';
        }
    }

    if (password === '') {
        errors.password = 'Password must not be empty';
    }else if (password.length < 8) {
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
        errors.email = 'E-mail address must not be empty';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = 'E-mail must be a valid e-mail address';
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