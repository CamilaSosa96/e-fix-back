const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userServices = require('./DBservices/UserService');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function (req, res, next) {
    next();
 });

router.post('/authUser', (req, res) => {
    user = req.body.user;
    pass = req.body.pass;
    userServices.authUser(user, pass, (result) => {
        if(result !== undefined){
            res.status(200).send({});
        } else {
            res.status(401).send({});
        }
    });
});

module.exports = router;