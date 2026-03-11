const express = require('express');
const router = express.Router();
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const agencyRoutes = require('./routes/agencyRoutes');
const clientRoutes = require('./routes/clientRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB (Secondary)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // For agency logos etc

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/agency', agencyRoutes);
app.use('/api/client', clientRoutes);

app.get('/', (req, res) => {
    res.send('HMS Backend with Failover is running...');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
