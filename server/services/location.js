import axios from 'axios';
import GOOGLE_API_KEY from '../config/development';

const SEARCH_RADIUS_IN_METERS = 500;

module.exports = class LocationService {
    constructor() {}

    async isNearAStore() {
        const userLocation = await this.getUserLocation();
        if (!userLocation){
            return false;
        }
        const nearbyStores = await this.findNearbyStores(userLocation.lat, userLocation.lng);
        return nearbyStores && nearbyStores.length > 0;
    }

    async getUserLocation() {
        try {
            const response = await axios.post('https://www.googleapis.com/geolocation/v1/geolocate?key=' + GOOGLE_API_KEY);
            return response;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }

    async findNearbyStores(latitude, longitude){
        const nearbyGroceryStoresUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${GOOGLE_API_KEY}&inputtype=textquery&input=grocery&fields=name,types&locationbias=circle:${SEARCH_RADIUS_IN_METERS}@${latitude},${longitude}`;

        try {
            let validResults = [];

            const response = await axios.post(nearbyGroceryStoresUrl);

            // this is the status of the actual http response
            if (response.status !== 200){
                console.log("Status: " + response.status);
                return validResults;
            }

            // this is the google api's status field
            if (response.data.status !== "OK"){
                console.log("Status: " + response.data.status);
                return validResults;
            }

            for (const candidate of response.data.candidates){
                const types = candidate.types;
                if (types.includes("supermarket") ||
                    types.includes("grocery_or_supermarket") ||
                    types.includes("convenience_store")){
                        validResults.push(candidate);
                    }
            }

            return validResults;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}