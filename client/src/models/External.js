class External {
    constructor(_id, name, external_type, email, phone_number, details, event_id, picture) {
        this._id = _id;
        this.name = name;
        this.external_type =external_type
        this.email = email;
        this.phone_number = phone_number;
        this.details = details;
        this.event_id = event_id;
        this.picture = picture;
    }
}

export default External;