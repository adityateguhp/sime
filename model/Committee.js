const { model, Schema } = require('mongoose');

const committeeSchema = new Schema({
    name: String,
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'projects'
    },
    createdAt: String
});

module.exports = model('Committee', committeeSchema);