// Esse é o mesmo controller do Mongo Stack! Apenas fiz a tradução das mensagens

var express = require('express');
var router = express.Router();
var userService = require('services/user.service');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);

module.exports = router;

function authenticateUser(req, res) {
    userService.authenticate(req.body.username, req.body.password)
        .then(function (response) {
            if (response) {
                // authentication successful
                res.send({ userId: response.userId, token: response.token });
            } else {
                // authentication failed
                res.status(401).send('Usuário e/ou senha inválidos');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

async function registerUser(req, res) {
    try {
        let user = await userService.create(req.body);
        res.status(200).send(user);

    } catch (error) {
        res.status(400).send(error);
    }
}