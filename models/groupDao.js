const DB = require("documentdb-typescript");

class GroupDao {
    constructor(db, collectionId) {
        this.collectionId = collectionId;
        this.database = db;
        this.collection = null;
    }

    async init() {
        const self = this;

        self.collection = new DB.Collection(self.collectionId, self.database);
        await self.collection.openOrCreateDatabaseAsync();
    }

    async add(group) {
        const self = this;

        group.date = Date.now();

        return await self.collection.storeDocumentAsync(group, DB.StoreMode.CreateOnly);
    }
}

module.exports = GroupDao;