import sinon from 'sinon';
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
        let successfulResponse = {
            "candidates": [
               {
                  "name": "Heinen's Grocery Store",
                  "types": [
                     "supermarket",
                     "florist",
                     "grocery_or_supermarket",
                     "liquor_store",
                     "food",
                     "health",
                     "point_of_interest",
                     "store",
                     "establishment"
                  ]
               }
            ],
            "status": "OK"
        };

        it('returns valid results on a successful response', async function(){
            const findPlaceUri = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json";
            const findPlaceUrl = new RegExp(`${findPlaceUri}\?.+`);
            axiosMock.onPost(findPlaceUrl).reply(200, successfulResponse);

            const validResults = await locationService.findNearbyStores("fakeLat", "fakeLng");
            expect(validResults.length).to.equal(1);
            expect(validResults[0].name).to.equal(successfulResponse.candidates[0].name);
        });
    })

});