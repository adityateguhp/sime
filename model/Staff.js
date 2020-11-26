const { model, Schema } = require('mongoose');

const staffSchema = new Schema({	
    name: String,
    department_position_id: {
        type: Schema.Types.ObjectId,
        ref: 'department_positions'
    },
    organization_id:{
        type: Schema.Types.ObjectId,
        ref: 'organizations'
    }, 	
    department_id:{
        type: Schema.Types.ObjectId,
        ref: 'departments'
    }, 	
    email: String,
    phone_number: String,
    password: String,
    picture: String,
    isAdmin: Boolean,
    createdAt: String
});

module.exports = model('Staff', staffSchema);