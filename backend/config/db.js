const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Don't exit process, we have Supabase as primary (though MongoDB is secondary, we still want to know)
    }
};

module.exports = connectDB;
