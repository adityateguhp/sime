const { model, Schema } = require('mongoose');

const task_assigned_to_Schema = new Schema({	
    task_id:{
        type: Schema.Types.ObjectId,
        ref: 'tasks'
    }, 	
    personInCharge_id:{
        type: Schema.Types.ObjectId,
        ref: 'person_in_charges'
    },
    createdAt: String 	
});

module.exports = model('Task_assigned_to', task_assigned_to_Schema);