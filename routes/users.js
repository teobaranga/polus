const DocumentDBClient = require('documentdb').DocumentClient;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

class Users {
    constructor(userDao) {
        this.userDao = userDao;
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
                    address: req.body.address
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
            if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).send({ auth: true, token: token });
        });
    }
}

module.exports = Users;
