const { model, Schema } = require('mongoose');

const externalTypeSchema = new Schema({	
    name: String
});

module.exports = model('ExternalType', externalTypeSchema);