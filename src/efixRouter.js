const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const userService = require('./DBservices/UserService')
const orderService = require('./DBservices/OrderService')
const router = express.Router()

//------------------MIDDLEWARE SETUP------------------//

let host = ''

router.use((req, res, next) => {
    host = req.headers.origin
    res.header('Access-Control-Allow-Origin', `${host}`)
    res.header('Access-Control-Allow-Headers', '*')
    res.header('Access-Control-Allow-Credentials', true)
    next()
})

router.use(cors({
    origin:[host],
    methods:['GET','POST'],
    credentials: false
}))

router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}))

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))

router.use((_req, _res, next) => {
    next()
 })

//------------------USER-RELATED REQUESTS------------------//

router.post('/auth', (req, res) => {
    user = req.body.user
    pass = req.body.pass
    userService.authUser(user, pass, (result) => {
        if(result !== undefined){ 
			req.session.loggedin = true
			req.session.username = user
            res.status(200).send()
        } 
        else res.status(401).send()
    })
})

router.get('/isAuthored', (req, res) => {
    req.session.loggedin ? res.status(200).send({user: req.session.username}) : res.status(401).send({})
})

router.get('/endSession', (req, res) => {
    req.session.destroy((err) => {
        if(err) console.log(err)
        res.status(200).send()
    })
})

router.post('/newUser', (req, res) => {
    if(req.session.loggedin && (req.session.username === 'Admin')){
        userService.createUser(req.body.user, req.body.pass, (err) => {
            err ? res.status(409).send() : res.status(201).send()
        })   
    }
    else res.status(403).send()
})

//------------------ORDER-RELATED REQUESTS------------------//

router.post('/saveOrder', (req, res) => {
    doIfAuthored(req, res, () => {
        user = req.session.username
        name = req.body.clientName
        dni = req.body.clientDNI
        email = req.body.clientEmail
        type = req.body.productType
        brand = req.body.productBrand
        model = req.body.productModel
        problem = req.body.problem
        orderService.saveOrder(user, name, dni, email, type, brand, model, problem, (_result) => {
            res.status(201).send()
        })
    })
})

router.get('/getAllOrders', (req, res) => {
    doIfAuthored(req, res, () => {
        orderService.getAllOrders((result) => {
            res.status(200).send(result)
        })
    })
})

router.post('/updateState/:id/:state', (req, res) => {
    doIfAuthored(req, res, () => {    
        doIfOwner(req.params.id, req.session.username, res, () => {
            orderService.updateState(req.params.id, req.params.state, (_result) => {
                res.status(200).send()
            })
        })
    })        
})

router.post('/loadBudget', (req, res) => {
    doIfAuthored(req, res, () => {
        doIfOwner(req.body.id, req.session.username, res, () => {
            orderService.loadBudget(req.body.id, req.body.diagnosis, req.body.budget, (_result) => {
                res.status(200).send()
            })
        })
    })
})
    
router.get('/search/:string', (req, res) => {
    doIfAuthored(req, res, () => {
        orderService.searchOrderByEmail(req.params.string, (result) => {
            res.status(200).send(result)
        })
    })
})

router.get('/budgetApproval/:dni/:id', (req, res) => {
    orderService.getOrderById(req.params.id, req.params.dni, (result) => {
        result[0] === undefined ? res.status(404).send() : res.status(200).send(result[0])
    })
})

router.post('/clientResponse/:id/:dni', (req, res) => {
    const state = req.body.choice ? 'REPARACION' : 'RETIRAR_SINARREGLO'
    orderService.updateState(req.params.id, state, (_result) => {
        res.status(200).send()
    })
})

router.get('*', (_req, res) => {
    res.status(404).send()
})

//------------------AUXILIAR METHODS------------------//

function doIfAuthored(req, res, callback){
    req.session.loggedin ? callback() : res.status(401).send({})
}

function doIfOwner(id, sessionName, res, callback){
    orderService.isOwner(id, sessionName, (result) => {
          result || sessionName === 'Admin' ? callback() : res.status(403).send({}) 
    })
}

module.exports = router