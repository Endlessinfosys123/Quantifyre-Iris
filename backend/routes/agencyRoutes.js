const express = require('express');
const router = express.Router();
const Agency = require('../models/Agency');
const Client = require('../models/Client');
const Campaign = require('../models/Campaign');
const { dbService } = require('../services/dbService');

// GET /api/agency/profile?email=...
router.get('/profile', async (req, res) => {
    const { email } = req.query;
    try {
        const agency = await dbService.findOne('agencies', Agency, { email });
        if (!agency) return res.status(404).json({ message: 'Agency not found' });
        res.json(agency);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/agency/clients?agencyEmail=...
router.get('/clients', async (req, res) => {
    const { agencyEmail } = req.query;
    try {
        const clients = await dbService.find('clients', Client, { agencyEmail });
        res.json(clients);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/agency/clients/add
router.post('/clients/add', async (req, res) => {
    try {
        const result = await dbService.create('clients', Client, req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/agency/campaigns?clientEmail=...
router.get('/campaigns', async (req, res) => {
    const { clientEmail } = req.query;
    try {
        const campaigns = await dbService.find('campaigns', Campaign, { clientEmail });
        res.json(campaigns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
