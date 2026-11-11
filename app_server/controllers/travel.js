const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
    method: 'GET',
    headers: {
        'Accept': 'application/json'
    }
};

/* GET travel view by calling our own internal REST API */
const travel = async (req, res) => {
    try {
        const response = await fetch(tripsEndpoint, options);
        const trips = await response.json();
        
        let message = null;
        if (!(trips instanceof Array)) {
            message = 'API lookup error';
        } else if (!trips.length) {
            message = 'No trips exist in our database';
        }

        res.render('travel', {
            title: 'Travlr Getaways',
            trips: trips,
            message: message
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = {
    travel
};
