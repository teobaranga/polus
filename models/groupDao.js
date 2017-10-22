const Dao = require('./dao');

class GroupDao extends Dao {

    async add(group) {
        group.date = Date.now();
        return super.add(group);
    }
}

module.exports = GroupDao;