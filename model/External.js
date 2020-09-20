const { model, Schema } = require('mongoose');

const externalSchema = new Schema({	
    name: String,
    external_type: {
        type: Schema.Types.ObjectId,
        ref: 'externalTypes'
    }, 	
    event_id:{
        type: Schema.Types.ObjectId,
        ref: 'events'
    }, 	
    email: String,
    phone_number: String,
    details: String,
    picture: String,
    createdAt: String
});

module.exports = model('External', externalSchema);