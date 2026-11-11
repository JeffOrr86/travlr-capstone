const express = require('express');
const router = express.Router();

// Controllers
const tripsController = require('../controllers/trips');
const authController = require('../controllers/authentication');

// Role-Based Access Control (RBAC) Middleware
const { authorizeRole } = require('../config/middleware');

// Authentication endpoints
router
    .route('/register')
    .post(authController.register);

router
    .route('/login')
    .post(authController.login);

// Public GET routes & RBAC Protected POST route
router
    .route('/trips')
    .get(tripsController.tripsList)
    .post(authorizeRole('superadmin'), tripsController.tripsAddTrip); // Only superadmin can add trips

// Public GET single trip & RBAC Protected PUT/DELETE routes
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode)
    .put(authorizeRole('staff'), tripsController.tripsUpdateTrip)       // Staff and superadmin can edit
    .delete(authorizeRole('superadmin'), tripsController.tripsDeleteTrip); // Only superadmin can delete

module.exports = router;
