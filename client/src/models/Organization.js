class Organization {
    constructor(_id, organization_name, description, email, password, picture) {
        this._id = _id;
        this.organization_name = organization_name;
        this.description = description;
        this.email = email;
        this.password = password;
        this.picture = picture;
    }
}

export default Organization;