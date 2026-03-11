const express = require('express');
const router = express.Router();
const Client = require('../models/Client');
const { dbService } = require('../services/dbService');

// POST /api/client/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const client = await dbService.findOne('clients', Client, { clientEmail: email, password });
        if (!client) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', client });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
