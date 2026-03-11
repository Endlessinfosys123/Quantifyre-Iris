const mongoose = require('mongoose');

const agencySchema = new mongoose.Schema({
    agencyName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    agencyLogo: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agency', agencySchema);
