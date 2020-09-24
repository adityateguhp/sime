const { model, Schema } = require('mongoose');

const staffSchema = new Schema({	
    name: String,
    position_name: String,
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
    createdAt: String
});

module.exports = model('Staff', staffSchema);