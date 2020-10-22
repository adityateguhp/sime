const { model, Schema } = require('mongoose');

const positionSchema = new Schema({	
    name: String,
    core: Boolean,
    order: String,
    createdAt: String
});

module.exports = model('Position', positionSchema);