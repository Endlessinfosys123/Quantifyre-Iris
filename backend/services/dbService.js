const { createClient } = require('@supabase/supabase-js');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Supabase Primary
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const dbService = {
    /**
     * Generic write method: Write to both Supabase and MongoDB
     * @param {string} table - Supabase table name
     * @param {mongoose.Model} Model - Mongoose model for MongoDB
     * @param {object} data - Data to insert
     */
    async create(table, Model, data) {
        let supabaseResult = null;
        let mongoResult = null;
        let error = null;

        // Try Supabase first
        try {
            const { data: sData, error: sError } = await supabase.from(table).insert([data]).select();
            if (sError) throw sError;
            supabaseResult = sData[0];
        } catch (err) {
            console.error(`Supabase write error (${table}):`, err.message);
            error = err;
        }

        // Always try to write to MongoDB for redundancy/failover prep
        try {
            const mongoDoc = new Model(data);
            mongoResult = await mongoDoc.save();
        } catch (err) {
            console.error(`MongoDB write error (${Model.modelName}):`, err.message);
            // If Supabase also failed, we are in trouble. If Supabase succeeded, we still want to log this.
            if (!supabaseResult) error = err;
        }

        if (!supabaseResult && !mongoResult) {
            throw new Error(`Critical: Failed to write to both databases. Last error: ${error.message}`);
        }

        return supabaseResult || mongoResult;
    },

    /**
     * Generic read method: Read from Supabase, failover to MongoDB
     * @param {string} table - Supabase table name
     * @param {mongoose.Model} Model - Mongoose model for MongoDB
     * @param {object} query - Query parameters (simplified)
     */
    async find(table, Model, query = {}) {
        // Try Supabase Primary
        try {
            let sQuery = supabase.from(table).select('*');
            // Basic filtering if query has keys
            Object.keys(query).forEach(key => {
                sQuery = sQuery.eq(key, query[key]);
            });
            const { data, error } = await sQuery;
            if (error) throw error;
            return data;
        } catch (err) {
            console.warn(`Supabase read error (${table}), falling back to MongoDB:`, err.message);
            // Failover to MongoDB
            try {
                const results = await Model.find(query);
                return results;
            } catch (mErr) {
                console.error(`MongoDB read error (${Model.modelName}):`, mErr.message);
                throw mErr;
            }
        }
    },

    /**
     * Generic findOne method
     */
    async findOne(table, Model, query = {}) {
        try {
            let sQuery = supabase.from(table).select('*').limit(1);
            Object.keys(query).forEach(key => {
                sQuery = sQuery.eq(key, query[key]);
            });
            const { data, error } = await sQuery.maybeSingle();
            if (error) throw error;
            if (data) return data;
            
            // If not found in Supabase (maybe it's a sync issue), try MongoDB? 
            // Or just return null. Let's try MongoDB only on error.
            return null;
        } catch (err) {
            console.warn(`Supabase findOne error (${table}), falling back to MongoDB:`, err.message);
            try {
                return await Model.findOne(query);
            } catch (mErr) {
                throw mErr;
            }
        }
    }
};

module.exports = { dbService, supabase };
