const { model, Schema } = require('mongoose');

const divisionSchema = new Schema({
    name: String,
    createdAt: String
});

module.exports = model('Division', divisionSchema);