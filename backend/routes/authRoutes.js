const express = require('express');
const router = express.Router();
const Agency = require('../models/Agency');
const { dbService } = require('../services/dbService');

// POST /api/auth/agency/login
router.post('/agency/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find agency in Primary (Supabase) via dbService
        const agency = await dbService.findOne('agencies', Agency, { email, password });
        if (!agency) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', agency });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/agency/signup
router.post('/agency/signup', async (req, res) => {
    const { agencyName, email, password } = req.body;
    try {
        const result = await dbService.create('agencies', Agency, { agencyName, email, password });
        res.status(201).json({ message: 'Agency created', agency: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
