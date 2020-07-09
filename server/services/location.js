const axios = require('axios');

module.exports = class LocationService {
    constructor() {
        this.storeTypes = [
            "supermarket",
            "grocery_or_supermarket",
            "convenience_store"
        ];
    }

    async isNearAStore(location) {
        const nearbyStores = await this.findNearbyStores(location);
        return nearbyStores && nearbyStores.length > 0;
    }

    async findNearbyStores(coordinates) {
        const nearbyGroceryStoresUrls = this.storeTypes.map(
          type => `https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=${process.env.GOOGLE_API_KEY}&location=${encodeURIComponent(coordinates)}&type=${type}&rankby=distance`
        );

        try {
            const stores = await Promise.all(nearbyGroceryStoresUrls.map(async url => axios.post(url)));
            const flattenedStores = stores.flat().map(result => result.data && result.data.results).flat();
            const storesByPlaceId = {};
            for (const store of flattenedStores) {
                storesByPlaceId[store.place_id] = store;
            }

            return Object.values(storesByPlaceId);
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
}
