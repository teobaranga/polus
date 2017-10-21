const DocumentDBClient = require('documentdb').DocumentClient;
const async = require('async');
const bcrypt = require('bcrypt');

class Users {
    constructor(userDao) {
        this.userDao = userDao;
    }

    getAllUsers(req, res) {
        const self = this;

        const querySpec = {
            query: 'SELECT * FROM root r'
        };

        self.userDao.find(querySpec, function (err, items) {
            if (err) {
                throw (err);
            }

            res.json(items);
        });
    }

    signUp(req, res) {
        const self = this;

        bcrypt.hash(req.body.password, 10, function(err, hash) {
            if (err) throw err;

            let user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: hash
            };

            self.userDao.addItem(user, function (err) {
                if (err) throw (err);

                res.status(201).json();
            });
        });
    }
}

module.exports = Users;
