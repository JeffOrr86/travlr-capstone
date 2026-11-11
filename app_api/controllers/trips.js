const mongoose = require('mongoose');
const Trip = mongoose.model('trips');

// GET: /api/trips - fetch all trips from MongoDB
const tripsList = async (req, res) => {
    try {
        const trips = await Trip.find({}).exec();
        if (!trips || trips.length === 0) {
            return res.status(404).json({ message: "No trips found in database" });
        }
        return res.status(200).json(trips);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// GET: /api/trips/:tripCode - find one trip by code
const tripsFindByCode = async (req, res) => {
    try {
        const trip = await Trip.find({ 'code': req.params.tripCode }).exec();
        if (!trip || trip.length === 0) {
            return res.status(404).json({ message: `No trip found with code ${req.params.tripCode}` });
        }
        return res.status(200).json(trip);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// POST: /api/trips - create a new trip record in MongoDB
const tripsAddTrip = async (req, res) => {
    try {
        const newTrip = new Trip({
            code: req.body.code,
            name: req.body.name,
            length: req.body.length,
            start: req.body.start,
            resort: req.body.resort,
            perPerson: req.body.perPerson,
            image: req.body.image,
            description: req.body.description
        });

        const savedTrip = await newTrip.save();
        return res.status(201).json(savedTrip);
    } catch (err) {
        return res.status(400).json(err);
    }
};

// PUT: /api/trips/:tripCode - update an existing trip by code
const tripsUpdateTrip = async (req, res) => {
    try {
        const updatedTrip = await Trip.findOneAndUpdate(
            { 'code': req.params.tripCode },
            {
                code: req.body.code,
                name: req.body.name,
                length: req.body.length,
                start: req.body.start,
                resort: req.body.resort,
                perPerson: req.body.perPerson,
                image: req.body.image,
                description: req.body.description
            },
            { new: true }
        ).exec();

        if (!updatedTrip) {
            return res.status(404).json({ message: `Trip not found with code ${req.params.tripCode}` });
        }

        return res.status(200).json(updatedTrip);
    } catch (err) {
        return res.status(500).json(err);
    }
};

// DELETE: /api/trips/:tripCode - delete a trip from MongoDB
const tripsDeleteTrip = async (req, res) => {
    try {
        const deletedTrip = await Trip.findOneAndDelete({ 'code': req.params.tripCode }).exec();
        if (!deletedTrip) {
            return res.status(404).json({ message: `Trip not found with code ${req.params.tripCode}` });
        }
        return res.status(204).json(null);
    } catch (err) {
        return res.status(500).json(err);
    }
};

module.exports = {
    tripsList,
    tripsFindByCode,
    tripsAddTrip,
    tripsUpdateTrip,
    tripsDeleteTrip
};
