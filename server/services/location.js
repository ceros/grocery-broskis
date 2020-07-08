import axios from 'axios';

module.exports = class LocationService {

    async isNearAStore(zipcode) {
        const nearbyStores = await this.findNearbyStores(zipcode);
        return nearbyStores && nearbyStores.length > 0;
    }

    async findNearbyStores(zipcode){
        const nearbyGroceryStoresUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?key=${process.env.GOOGLE_API_KEY}&inputtype=textquery&input=grocery%20${zipcode}&fields=name,types`;

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
                console.log("API Status: " + response.data.status);
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
            console.error(error);
            return [];
        }
    }
}
