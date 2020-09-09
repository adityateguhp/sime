const { model, Schema } = require('mongoose');

const divisionSchema = new Schema({
    name: String,	
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'projects'
    },
    createdAt: String
});

module.exports = model('Division', divisionSchema);