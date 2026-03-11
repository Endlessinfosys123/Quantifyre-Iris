const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    agencyEmail: { type: String, required: true },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobileNumber: { type: String },
    location: { type: String },
    status: { type: String, default: 'Active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Client', clientSchema);
