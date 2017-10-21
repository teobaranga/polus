const DocumentDBClient = require('documentdb').DocumentClient;
const jwt = require('jsonwebtoken');
const async = require("async");

class Offices {
    constructor(userDao) {
        this.officeDao = userDao;
    }

    /** Populate the database with a default list of offices */
    setup(req, res) {
        const self = this;

        const defaultOffices = [
            {
                company: "Microsoft",
                name: "Microsoft New England Research and Development Center",
                address: "1 Memorial Dr, Cambridge, MA 02142, USA",
                state: "MA"
            },
            {
                company: "Microsoft",
                name: "Microsoft Boston MTC",
                address: "5 Wayside Rd, Burlington, MA 01803, USA",
                state: "MA"
            }
        ];

        let calls = [];

        defaultOffices.forEach(function (office) {
            calls.push(function (callback) {
                    self.officeDao.addItem(office, function (err) {
                        if (err) return callback(err);

                        callback(null, office);
                    });
                }
            )
        });

        async.parallel(calls, function (err, result) {
            /* this code will run after all calls finished the job or
               when any of the calls passes an error */
            if (err) throw err;

            res.status(200).json();
        });
    }

    getOffices(req, res) {
        if (!req.query.company) {
            res.status(400).send({message: "Please provide the company name"})
        } else {
            const self = this;

            const queryOffices = {
                query: 'SELECT * FROM root r WHERE r.company = @company',
                parameters: [{
                    name: '@company',
                    value: req.query.company
                }]
            };

            self.officeDao.find(queryOffices, function (err, items) {
                if (err) throw (err);

                res.json(items);
            });
        }
    }
}

module.exports = Offices;
