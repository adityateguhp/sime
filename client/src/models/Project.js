class Project {
    constructor(_id, project_name, project_description, cancel, project_start_date, project_end_date, organization_id, picture) {
        this._id = _id;
        this.project_name = project_name;
        this.project_description = project_description;
        this.cancel = cancel;
        this.project_start_date = project_start_date;
        this.project_end_date = project_end_date;
        this.organization_id = organization_id;
        this.picture = picture;
    }
}

export default Project;