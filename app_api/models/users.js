// User schema with password hashing, salt, and JWT token generation
const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['staff', 'superadmin'],
        default: 'staff',
        required: true
    },
    hash: String,
    salt: String
});

// Hash the password with a random salt before saving
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Check if the provided password matches the saved hash
userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

// Generate a signed JWT valid for 7 days
userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        name: this.name,
        role: this.role, //added role property to JWT payload
        exp: parseInt(expiry.getTime() / 1000, 10),
    }, process.env.JWT_SECRET);
};

module.exports = mongoose.model('users', userSchema);
