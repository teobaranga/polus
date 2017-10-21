var config = {};

config.host = process.env.HOST || "https://localhost:8081/";
config.authKey = process.env.AUTH_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
config.databaseId = "Polus";
config.collectionId = "Items";
config.collectionIdUsers = "Users";

module.exports = config;