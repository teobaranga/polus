const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

class Users {
    constructor(userDao) {
        this.userDao = userDao;
    }

    async signUp(req, res) {
        const self = this;

        const user = await self.userDao.getUser(req.body.email);

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

            await self.userDao.add(user);

            // create a token
            const token = jwt.sign({id: user.id}, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(201).send({auth: true, token: token});
        }
    }

    async login(req, res) {
        const self = this;

        const user = await self.userDao.getUser(req.body.email);

        if (!user) return res.status(404).send('No user found.');

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({auth: false, token: null});

        const token = jwt.sign({id: user.id}, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });

        const {firstName, lastName, homeAddress, officeAddress} = user;

        res.status(200).send({auth: true, token: token, user: {firstName, lastName, homeAddress, officeAddress}});
    }
}

module.exports = Users;
