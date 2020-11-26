const { model, Schema } = require('mongoose');

const committeeSchema = new Schema({
    name: String,
    core: Boolean,
    organization_id: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    },
    createdAt: String
});

module.exports = model('Committee', committeeSchema);