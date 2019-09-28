const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const userServices = require('./DBservices/UserService');
const orderService = require('./DBservices/OrderService');

//------------------MIDDLEWARE SETUP------------------//

router.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use(function (req, res, next) {
    next();
 });

//------------------USER-RELATED REQUESTS------------------//

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

//------------------ORDER-RELATED REQUESTS------------------//

router.post('/saveOrder', (req, res) => {
    name = req.body.clientName;
    dni = req.body.clientDNI;
    email = req.body.clientEmail;
    type = req.body.productType;
    brand = req.body.productBrand;
    model = req.body.productModel;
    problem = req.body.problem;
    orderService.saveOrder(name, dni, email, type, brand, model, problem, (result) =>{
        console.log(result);
        res.status(200).send({})
    })
})

module.exports = router;