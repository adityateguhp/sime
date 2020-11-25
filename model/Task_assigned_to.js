const { model, Schema } = require('mongoose');

const task_assigned_to_Schema = new Schema({	
    task_id:{
        type: Schema.Types.ObjectId,
        ref: 'tasks'
    },
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'staffs'
    }, 	
    person_in_charge_id:{
        type: Schema.Types.ObjectId,
        ref: 'person_in_charges'
    },
    project_id:{
        type: Schema.Types.ObjectId,
        ref: 'projects'
    },
    event_id:{
        type: Schema.Types.ObjectId,
        ref: 'events'
    },
    roadmap_id:{
        type: Schema.Types.ObjectId,
        ref: 'roadmaps'
    },
    createdAt: String 	
});

module.exports = model('Task_assigned_to', task_assigned_to_Schema);