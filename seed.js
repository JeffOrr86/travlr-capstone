const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Connect to the local MongoDB database
const dbURI = 'mongodb://127.0.0.1:27017/travlr';
mongoose.connect(dbURI);

// Require the Trip model
const Trip = require('./app_api/models/travlr');

// Read JSON data
const trips = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'trips.json'), 'utf-8'));

const seedDB = async () => {
    try {
        // Clear existing records so we avoid duplicates
        await Trip.deleteMany({});
        console.log('Cleared existing trips collection.');

        // Insert fresh records
        await Trip.insertMany(trips);
        console.log(`Successfully seeded ${trips.length} trips into MongoDB!`);
    } catch (err) {
        console.error('Error seeding database:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
};

seedDB();
