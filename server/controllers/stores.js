const LocationService = require('../services/location');

class ListController {
    constructor(database) {
        this.database = database;
        this.locationService = new LocationService();
    }

    async listNearbyStores(req, res, next) {
        if (!req.query.location) {
            res.status(400);
            res.send('Must provide a lat/long');
            return;
        }

        const stores = await this.locationService.findNearbyStores(req.query.location);
        res.send(JSON.stringify(stores));
    }
}

module.exports = ListController;
