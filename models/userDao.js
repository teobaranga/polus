const Dao = require('./dao');

class UserDao extends Dao {

    async add(user) {
        user.date = Date.now();
        return super.add(user);
    }

    async getUser(email) {
        const self = this;

        return await self.collection.findDocumentAsync({
            email: email
        });
    }
}

module.exports = UserDao;