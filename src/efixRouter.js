const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const userServices = require('./DBservices/UserService');
const orderService = require('./DBservices/OrderService');
const router = express.Router();

//------------------MIDDLEWARE SETUP------------------//

const host = 'http://localhost:3000' //When accessing locally
//const host = 'http://10.15.77.95:3000' // When accessing from another network (public IP) or from another pc (local IP)

router.use((_req, res, next) => {
    res.header("Access-Control-Allow-Origin", host);
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });

router.use(cors({
    origin:['http://localhost:8080'],
    methods:['GET','POST'],
    credentials: true
}));

router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.use((_req, _res, next) => {
    next();
 });

//------------------USER-RELATED REQUESTS------------------//

router.post('/auth', (req, res) => {
    user = req.body.user;
    pass = req.body.pass;
    userServices.authUser(user, pass, (result) => {
        if(result !== undefined){ 
			req.session.loggedin = true;
			req.session.username = user;
            res.status(200).send({});
        } else {
            res.status(401).send({});
        }
    });
});

router.get('/isAuthored', (req, res) => {
    req.session.loggedin ? res.status(200).send({}) : res.status(401).send({})
})

router.get('/endSession', (req, res) => {
    req.session.destroy((err) =>{
        if(err) console.log(err)
        res.status(200).send({})
    })
})

//------------------ORDER-RELATED REQUESTS------------------//

router.post('/saveOrder', (req, res) => {
    if(req.session.loggedin){
        name = req.body.clientName;
        dni = req.body.clientDNI;
        email = req.body.clientEmail;
        type = req.body.productType;
        brand = req.body.productBrand;
        model = req.body.productModel;
        problem = req.body.problem;
        orderService.saveOrder(name, dni, email, type, brand, model, problem, (result) =>{
            res.status(200).send({})
        })
    } else {
        res.status(401).send({})
    }
})

router.get('/getAllOrders', (req, res) => {
    if(req.session.loggedin) {
        console.log(req.session.cookie)
        orderService.getAllOrders((result) =>{
            res.status(200).send({result})
        })
    } else {
        res.status(401).send({})
    }
})

router.post('/updateState/:id/:state', (req, res) => {
    if(req.session.loggedin) {
        orderService.updateState(req.params.id, req.params.state, (result) => {
            res.status(200).send({})
        })
    } else {
        res.status(401).send({})
    }
})
    
router.get('/search/:string', (req, res) =>{
    if(req.session.loggedin) {
        orderService.searchOrderByEmail(req.params.string, (result) => {
            res.status(200).send({result})
        })
    } else {
        res.status(401).send({})
    }
})
     
//------------------AUXILIAR METHODS------------------//

module.exports = router;