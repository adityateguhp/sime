class Staff {
    constructor(_id, staff_name, position_name, department_id, email, phone_number, password, picture) {
        this._id = _id;
        this.staff_name = staff_name;
        this.position_name = position_name;
        this.department_id = department_id;
        this.email = email;
        this.phone_number = phone_number;
        this.password = password;
        this.picture = picture;
    }
}

export default Staff;