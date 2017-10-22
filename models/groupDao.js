const DocumentDBClient = require('documentdb').DocumentClient;
const docdbUtils = require('./docdbUtils');

function GroupDao(documentDBClient, databaseId, collectionId) {
    this.client = documentDBClient;
    this.databaseId = databaseId;
    this.collectionId = collectionId;

    this.database = null;
    this.collection = null;
}

module.exports = GroupDao;

GroupDao.prototype = {
    init: function (callback) {
        const self = this;

        docdbUtils.getOrCreateDatabase(self.client, self.databaseId, function (err, db) {
            if (err) {
                callback(err);
            } else {
                self.database = db;
                docdbUtils.getOrCreateCollection(self.client, self.database._self, self.collectionId, function (err, coll) {
                    if (err) {
                        callback(err);
                    } else {
                        self.collection = coll;
                    }
                });
            }
        });
    },

    find: function (querySpec, callback) {
        const self = this;

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results);
            }
        });
    },

    addItem: function (item, callback) {
        const self = this;

        item.date = Date.now();

        self.client.createDocument(self.collection._self, item, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                callback(null, doc);
            }
        });
    },

    updateItem: function (itemId, callback) {
        const self = this;

        self.getItem(itemId, function (err, doc) {
            if (err) {
                callback(err);
            } else {
                doc.completed = true;

                self.client.replaceDocument(doc._self, doc, function (err, replaced) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, replaced);
                    }
                });
            }
        });
    },

    getItem: function (itemId, callback) {
        const self = this;

        const querySpec = {
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: itemId
            }]
        };

        self.client.queryDocuments(self.collection._self, querySpec).toArray(function (err, results) {
            if (err) {
                callback(err);
            } else {
                callback(null, results[0]);
            }
        });
    }
};