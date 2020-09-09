const { model, Schema } = require('mongoose');

const positionSchema = new Schema({	
    name: String,
    core: Boolean,
    createdAt: String
});

module.exports = model('Position', positionSchema);