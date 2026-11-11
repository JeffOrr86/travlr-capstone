const jwt = require('jsonwebtoken');

/**
 * Middleware: authorizeRole
 * Enforces Role-Based Access Control (RBAC) on API routes.
 * Allows access if the user's role matches requiredRole or is 'superadmin'.
 */
const authorizeRole = (requiredRole) => {
    return (req, res, next) => {
        // Extract Authorization header
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: 'Authentication required: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authentication required: Malformed authorization header' });
        }

        // Verify and decode JWT
        jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired token' });
            }

            // Check permissions
            if (decodedUser.role !== requiredRole && decodedUser.role !== 'superadmin') {
                return res.status(403).json({ 
                    message: `Access forbidden: Requires ${requiredRole} permissions` 
                });
            }

            // Attach decoded payload to request object for downstream controllers
            req.auth = decodedUser;
            next();
        });
    };
};

module.exports = {
    authorizeRole
};
