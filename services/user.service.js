var config = require('config.json');
var lodash = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var connection = process.env.connectionStringV2 || config.connectionStringV2;
var database = process.env.databaseV2 || config.databaseV2;
const ObjectID = require('mongodb').ObjectID;
const mongo = require('mongodb').MongoClient;
mongo.connect(connection, { useUnifiedTopology: true })
    .then(conn => global.conn = conn.db(database))
    .catch(err => console.log(err));

var service = {};

service.authenticate = authenticate;
service.create = create;

module.exports = service;

function authenticate(username, password) {
    var deferred = Q.defer();
    var users = global.conn.collection("users");

    users.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve({token :jwt.sign({ sub: user._id }, config.secret), userId: user._id});
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}


function create(userParam) {
    var deferred = Q.defer();

    var users = global.conn.collection("users");

    users.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Usuário "' + userParam.username + '" já cadastrado');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = lodash.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        users.insertOne(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve(user);
            });
    }

    return deferred.promise;
}
