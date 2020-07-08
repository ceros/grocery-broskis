import axios from 'axios';

export const getCoordinatesForAddress = async function(address) {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.CLIENT_MAPS_API_KEY}&address=${address}`);
        
        // this is the status of the actual http response
        if (response.status !== 200){
            console.error("Status: " + response.status);
            return null;
        }

        // this is the google api's status field
        if (response.data.status !== "OK"){
            console.error("API Status: " + response.data.status);
            return null;
        }

        if (response.data.results && response.data.results.length < 1){
            console.error("No geocoding results for address " + address);
            return null;
        }

        return response.data.results[0].geometry.location;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}