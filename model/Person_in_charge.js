const { model, Schema } = require('mongoose');

const person_in_chargeSchema = new Schema({
    staff_id: {
        type: Schema.Types.ObjectId,
        ref: 'staffs'
    },
    position_id: {
        type: Schema.Types.ObjectId,
        ref: 'positions'
    },
    committee_id: {
        type: Schema.Types.ObjectId,
        ref: 'committees'
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
        ref: 'positions'
    },
    createdAt: String
});

module.exports = model('Person_in_charge', person_in_chargeSchema);