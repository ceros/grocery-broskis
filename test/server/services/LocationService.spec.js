import { expect } from 'chai';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const LocationService = require('../../../server/services/location.js');
let axiosMock;

beforeEach(function(){
    axiosMock = new MockAdapter(axios);
});

describe('LocationService', function() {

    const locationService = new LocationService();

    describe('findNearbyStores', function(){
        let successfulResponse;
        
        beforeEach(() => {
            successfulResponse = {
                results: [{
                    place_id: 'ABC_123'
                }, {
                    place_id: 'ZYX_987'
                }],
                "status": "OK"
            };
        });

        it('returns valid results on a successful response', async function(){
            const findPlaceUri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
            const findPlaceUrl = new RegExp(`${findPlaceUri}\?.+`);
            axiosMock.onPost(findPlaceUrl).reply(200, successfulResponse);

            const validResults = await locationService.findNearbyStores("54,40");
            expect(validResults).to.eql([{
                place_id: 'ABC_123'
            }, {
                place_id: 'ZYX_987'
            }]);
        });

        it('returns an empty array on a non-200 response', async function(){
            const findPlaceUri = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";
            const findPlaceUrl = new RegExp(`${findPlaceUri}\?.+`);
            axiosMock.onPost(findPlaceUrl).reply(400, "Bad Request");

            const results = await locationService.findNearbyStores("54,40");
            expect(results.length).to.equal(0);
        });

    })

});
