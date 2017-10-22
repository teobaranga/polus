const DB = require("documentdb-typescript");

class Dao {
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

    async add(item) {
        const self = this;

        item.date = Date.now();

        return await self.collection.storeDocumentAsync(item, DB.StoreMode.CreateOnly);
    }
}

module.exports = Dao;