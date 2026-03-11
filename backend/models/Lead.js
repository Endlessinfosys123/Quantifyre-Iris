const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
    campaignId: { type: String, required: true },
    clientEmail: { type: String, required: true },
    leadName: { type: String, required: true },
    leadEmail: { type: String },
    leadPhone: { type: String },
    source: { type: String },
    status: { type: String, default: 'New' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lead', leadSchema);
