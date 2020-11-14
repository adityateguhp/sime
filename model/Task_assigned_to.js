const { model, Schema } = require('mongoose');

const task_assigned_to_Schema = new Schema({	
    task_id:{
        type: Schema.Types.ObjectId,
        ref: 'tasks'
    }, 	
    committee_id:{
        type: Schema.Types.ObjectId,
        ref: 'committees'
    },
    createdAt: String 	
});

module.exports = model('Task_assigned_to', task_assigned_to_Schema);