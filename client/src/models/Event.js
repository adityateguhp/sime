class Event {
    constructor(_id, event_name, event_description, event_location, cancel, event_start_date, event_end_date, project_id, picture) {
        this._id = _id;
        this.event_name = event_name;
        this.event_description = event_description;
        this.event_location = event_location;
        this.cancel = cancel;
        this.event_start_date = event_start_date;
        this.event_end_date = event_end_date;
        this.project_id = project_id;
        this.picture = picture;
    }
}

export default Event;