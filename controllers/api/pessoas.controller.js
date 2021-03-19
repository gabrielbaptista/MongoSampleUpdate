var express = require('express');
var router = express.Router();
var pessoaService = require('services/pessoa.service');

// routes
router.post('/', createPerson);
router.get('/', listPeople);
router.put('/', updatePerson);
router.get('/:_id', getCurrentPerson);
router.delete('/:_id', deletePerson);

module.exports = router;

function createPerson(req, res) {
    pessoaService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function listPeople(req, res) {

        pessoaService.listPeople()
            .then(function (people) {
                if (people) {
                    res.send(people);
                } else {
                    res.sendStatus(404);
                }
            })
            .catch(function (err) {
                res.status(400).send(err);
            });
}

function getCurrentPerson(req, res) {
    var personId = req.params._id;
    pessoaService.getById(personId)
        .then(function (person) {
            if (person) {
                res.send(person);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updatePerson(req, res) {
    pessoaService.update(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletePerson(req, res) {
    var personId = req.params._id;
    pessoaService.delete(personId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}