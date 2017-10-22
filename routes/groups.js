const DocumentDBClient = require('documentdb').DocumentClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

class Groups {
    constructor(userDao, groupDao) {
        this.userDao = userDao;
        this.groupDao = groupDao;
        this.googleMapsClient = require('@google/maps').createClient({
            key: 'AIzaSyBorVD5k9TuDwBBxXft-2CgLSgHQ4XFLiY',
            Promise: Promise
        });
    }

    createGroup(req, res) {
        const self = this;

        self.userDao.getUser(req.body.email, async function (err, user) {
            if (err) throw err;

            self.googleMapsClient.directions({
                origin: user.homeAddress,
                destination: user.officeAddress,
                mode: 'driving',
            }).asPromise().then(response => response.json)
                .then(function (json) {
                    if (json.routes.length > 0) {
                        const route = json.routes[0];
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
                            departure_time: Date.now() + (60*1000*req.body.delta_time)
                        };
                        self.groupDao.addItem(group, function (err, groupDoc) {
                            if (err) throw err;

                            const {id, start_location, end_location, polyline, driver, passengers, departure_time} = groupDoc;
                            res.send({id, start_location, end_location, polyline, driver, passengers, departure_time});
                        })
                    } else {
                        throw new Error("Could not find a path")
                    }
                });
        });
    }

    async signUp(req, res) {
        const self = this;

        self.userDao.getUser(req.body.email, async function (err, user) {
            if (err) throw (err);

            if (user) {
                res.status(406).json({message: "Email already exists"})
            } else {
                let user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 10),
                    homeAddress: req.body.homeAddress,
                    officeAddress: req.body.officeAddress
                };

                self.userDao.addItem(user, function (err) {
                    if (err) throw (err);

                    // create a token
                    const token = jwt.sign({id: user.id}, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(201).send({auth: true, token: token});
                });
            }
        });
    }

    async login(req, res) {
        const self = this;

        self.userDao.getUser(req.body.email, async function (err, user) {
            if (err) return res.status(500).send('Error on the server.');

            if (!user) return res.status(404).send('No user found.');

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(401).send({auth: false, token: null});

            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).send({auth: true, token: token});
        });
    }
}

module.exports = Groups;
