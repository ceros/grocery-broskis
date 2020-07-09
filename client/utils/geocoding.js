export const getCoordinatesForAddress = async function(address) {
    const geocoder = new google.maps.Geocoder();
    return new Promise(function(resolve, reject) {
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === 'OK') {
                resolve({lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()});
            } else {
                reject(new Error('Couldnt\'t find the location ' + address));
            }
        });
    });
}