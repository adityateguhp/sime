const { model, Schema } = require('mongoose');

const rundownSchema = new Schema({	
    agenda: String,
    event_id:{
        type: Schema.Types.ObjectId,
        ref: 'events'
    }, 	
    date: String,
    start_time: String,
    end_time: String,
    details: String,
    createdAt: String
});

module.exports = model('Rundown', rundownSchema);