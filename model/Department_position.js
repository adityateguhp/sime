const { model, Schema } = require('mongoose');

const departmentPositionSchema = new Schema({	
    name: String,
    organization_id: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    },
    createdAt: String
});

module.exports = model('Department_position', departmentPositionSchema);