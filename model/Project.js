const { model, Schema } = require('mongoose');

const projectSchema = new Schema({	
    name: String,
    description: String,
    cancel: Boolean,
    start_date: String,
    end_date: String,
    organization_id: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    },	
    picture: String,
    createdAt: String
});

module.exports = model('Project', projectSchema);