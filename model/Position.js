const { model, Schema } = require('mongoose');

const positionSchema = new Schema({	
    name: String,
    core: Boolean,
    organization_id: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    },
    createdAt: String,
    order: String
});

module.exports = model('Position', positionSchema);