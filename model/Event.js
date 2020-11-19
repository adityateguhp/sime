const { model, Schema } = require('mongoose');

const eventSchema = new Schema({	
    name: String,
    description: String,
    location: String,
    start_date: String,
    end_date: String,
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'projects'
    },	
    picture: String,
    createdAt: String
});

module.exports = model('Event', eventSchema);