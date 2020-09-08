class Organization {
    constructor(_id, name, description, email, password, picture) {
        this._id = _id;
        this.name = name;
        this.description = description;
        this.email = email;
        this.password = password;
        this.picture = picture;
    }
}

export default Organization;