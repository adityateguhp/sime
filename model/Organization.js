const { model, Schema } = require('mongoose');

const organizationSchema = new Schema({
    name: String,
    email: String,
    description: String,
    picture: String,
    address: String,
    phone_number: String,
    createdAt: String
})

module.exports = model('Organization', organizationSchema);