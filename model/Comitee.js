const { model, Schema } = require('mongoose');

const comiteeSchema = new Schema({
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
    createdAt: String
});

module.exports = model('Comitee', comiteeSchema);