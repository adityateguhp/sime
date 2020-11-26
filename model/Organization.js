const { model, Schema } = require('mongoose');

const organizationSchema = new Schema({
    name: String,
    description: String,
    picture: String,
    createdAt: String
})

module.exports = model('Organization', organizationSchema);