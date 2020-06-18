class Rundown {
    constructor(_id, agenda, details, date, start_time, end_time, event_id) {
        this._id = _id;
        this.agenda = agenda;
        this.details = details;
        this.date = date;
        this.start_time = start_time;
        this.end_time = end_time;
        this.event_id = event_id;
    }
}

export default Rundown;