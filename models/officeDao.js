const Dao = require('./dao');

class OfficeDao extends Dao {

    async add(office) {
        office.date = Date.now();
        return super.add(office);
    }

    async getByCompany(company) {
        const self = this;

        return await self.collection.queryDocuments({
            query: "SELECT * FROM root r WHERE r.company = @company",
            parameters: [
                {name: "@company", value: company}
            ]
        }).toArray();
    }
}

module.exports = OfficeDao;