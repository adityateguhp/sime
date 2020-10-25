const { model, Schema } = require('mongoose');

const taskSchema = new Schema({	
    name: String,
    description: String,
    completed: Boolean,
    due_date: String,
    roadmap_id:{
        type: Schema.Types.ObjectId,
        ref: 'roadmaps'
    }, 	
    createdAt: String,
    createdBy:{
        type: Schema.Types.ObjectId,
        ref: 'committees'
    }, 	
});

module.exports = model('Task', taskSchema);