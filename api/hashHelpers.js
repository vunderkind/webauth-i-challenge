const db = require('../data/dbConfig');

module.exports = {
    getAllData,
    add,
    findByUsername,
}

function getAllData() {
    return db('login');
};

function add(data) {
    return db('login')
    .insert(data);
}

function findByUsername(username) {
    return db('login').where({username}).first();
}

//done 