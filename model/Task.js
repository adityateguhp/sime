const { model, Schema } = require('mongoose');

const taskSchema = new Schema({	
    name: String,
    description: String,
    completed: Boolean,
    due_date: String,
    completed_date: String,
    priority: String,
    roadmap_id:{
        type: Schema.Types.ObjectId,
        ref: 'roadmaps'
    }, 	
    createdAt: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'tasks'
    }, 		
});

module.exports = model('Task', taskSchema);