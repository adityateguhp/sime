const { model, Schema } = require('mongoose');

const committeeSchema = new Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'staffs'
    },
    position_id: {
        type: Schema.Types.ObjectId,
        ref: 'positions'
    },
    division_id: {
        type: Schema.Types.ObjectId,
        ref: 'divisions'
    },
    project_id: {
        type: Schema.Types.ObjectId,
        ref: 'projects'
    },
    organization_id: {
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    },
    order:{
        type: Schema.Types.String,
        ref: 'position'
    },
    createdAt: String
});

module.exports = model('Committee', committeeSchema);