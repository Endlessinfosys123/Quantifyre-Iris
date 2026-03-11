const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    clientEmail: { type: String, required: true },
    campaignName: { type: String, required: true },
    campaignType: { type: String },
    budget: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
    status: { type: String, default: 'Draft' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
