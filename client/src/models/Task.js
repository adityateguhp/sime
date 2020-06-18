class Task {
    constructor(_id, task_name, task_description, completed, task_due_date, division_id, roadmap_id, assign_to) {
        this._id = _id;
        this.task_name = task_name;
        this.task_description = task_description;
        this.completed = completed;
        this.task_due_date = task_due_date;
        this.division_id = division_id;
        this.roadmap_id = roadmap_id;
        this.assign_to = assign_to;
    }
}

export default Task;