const { model, Schema } = require('mongoose');

const roadmapSchema = new Schema({	
    name: String,
    event_id:{
        type: Schema.Types.ObjectId,
        ref: 'events'
    }, 
    project_id:{
        type: Schema.Types.ObjectId,
        ref: 'projects'
    }, 	
    committee_id:{
        type: Schema.Types.ObjectId,
        ref: 'committees'
    }, 		
    start_date: String,
    end_date: String,
    createdAt: String
});

module.exports = model('Roadmap', roadmapSchema);