var config = {};

config.host = process.env.HOST || "https://localhost:8081/";
config.authKey = process.env.AUTH_KEY || "C2y6yDjf5/R+ob0N8A7Cgv30VRDJIWEHLM+4QDU5DE2nQ9nDuVTqobD4b8mGGyPMbIZnqyMsEcaGQy67XIw/Jw==";
config.google_api = process.env.GOOGLE_API || "AIzaSyBorVD5k9TuDwBBxXft-2CgLSgHQ4XFLiY";
config.databaseId = "Polus";
config.collectionIdUsers = "Users";
config.collectionIdOffices = "Offices";
config.collectionIdGroups = "Groups";

config.secret = process.env.SECRET || "supersecret";

module.exports = config;