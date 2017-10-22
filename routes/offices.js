class Offices {
    constructor(officeDao) {
        this.officeDao = officeDao;
    }

    /** Populate the database with a default list of offices */
    async setup(req, res) {
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

        let calls = defaultOffices.map(office => self.officeDao.add(office));
        await Promise.all(calls);

        res.status(200).json();
    }

    async getOffices(req, res) {
        if (!req.query.company) {
            res.status(400).send({message: "Please provide the company name"})
        } else {
            const self = this;

            const offices = await self.officeDao.getByCompany(req.query.company);

            if (offices.length === 0) {
                res.status(204).json()
            } else {
                res.json(offices.map(({company, name, state, address}) => ({company, name, state, address})));
            }
        }
    }
}

module.exports = Offices;
