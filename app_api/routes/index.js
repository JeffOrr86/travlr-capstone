const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Controllers
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Middleware to authenticate JWT tokens on protected admin routes
function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Malformed authorization token' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.auth = verified;
        next();
    });
}

// Authentication endpoints
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

// Public GET routes for trips
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(authenticateJWT, tripsController.tripsAddTrip); // Protected POST

router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT, tripsController.tripsUpdateTrip)   // Protected PUT
    .delete(authenticateJWT, tripsController.tripsDeleteTrip); // Protected DELETE

module.exports = router;
