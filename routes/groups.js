const config = require('../config');

class Groups {
    constructor(userDao, groupDao) {
        this.userDao = userDao;
        this.groupDao = groupDao;
        this.googleMapsClient = require('@google/maps').createClient({
            key: config.google_api,
            Promise: Promise
        });
    }

    async createGroup(req, res) {
        const self = this;

        const user = await self.userDao.getUser(req.body.email);

        const response = await self.googleMapsClient.directions({
            origin: user.homeAddress,
            destination: user.officeAddress,
            mode: 'driving',
        }).asPromise();

        const responseJson = response.json;

        if (responseJson.routes.length > 0) {
            const route = responseJson.routes[0];
            const group = {
                start_location: {
                    type: "Point",
                    coordinates: [route.legs[0].start_location.lng, route.legs[0].start_location.lat]
                },
                end_location: {
                    type: "Point",
                    coordinates: [route.legs[0].end_location.lng, route.legs[0].end_location.lat]
                },
                polyline: route.overview_polyline.points,
                driver: user.email,
                passengers: [],
                departure_time: Date.now() + (60 * 1000 * req.body.delta_time)
            };

            const groupDoc = await self.groupDao.add(group);

            const {id, start_location, end_location, polyline, driver, passengers, departure_time} = groupDoc;
            res.send({id, start_location, end_location, polyline, driver, passengers, departure_time});
        } else {
            throw new Error("Could not find a path")
        }
    }
}

module.exports = Groups;
