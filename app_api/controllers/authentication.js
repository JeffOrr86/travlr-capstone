// Controller handling registration and login endpoints
const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('users');

// Register a new user and return a JWT
const register = async (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    const user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.role = req.body.role || 'staff'; // Assign role or default to staff
    user.setPassword(req.body.password);

    try {
        await user.save();
        const token = user.generateJwt();
        return res.status(200).json({ token });
    } catch (err) {
        return res.status(400).json(err);
    }
};

// Log in an existing user and return a JWT
const login = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ message: 'All fields required' });
    }

    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return res.status(404).json(err);
        }
        if (user) {
            const token = user.generateJwt();
            return res.status(200).json({ token });
        } else {
            return res.status(401).json(info);
        }
    })(req, res);
};

module.exports = {
    register,
    login
};
