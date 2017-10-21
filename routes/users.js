const DocumentDBClient = require('documentdb').DocumentClient;
const bcrypt = require('bcrypt');

class Users {
    constructor(userDao) {
        this.userDao = userDao;
    }

    async signUp(req, res) {
        const self = this;

        const queryEmail = {
            query: 'SELECT * FROM root r WHERE r.email = @email',
            parameters: [{
                name: '@email',
                value: req.body.email
            }]
        };

        self.userDao.find(queryEmail, async function (err, items) {
            if (err) throw (err);

            if (items.length > 0) {
                res.status(406).json({message: "Email already exists"})
            } else {
                let user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: await bcrypt.hash(req.body.password, 10)
                };

                self.userDao.addItem(user, function (err) {
                    if (err) throw (err);

                    res.status(201).json();
                });
            }
        });
    }
}

module.exports = Users;
