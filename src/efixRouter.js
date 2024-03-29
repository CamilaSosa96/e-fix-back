const express = require('express')
const session = require('express-session')
const cors = require('cors')
const bodyParser = require('body-parser')
const userService = require('./DBservices/UserService')
const orderService = require('./DBservices/OrderService')
const settingsService = require('./DBservices/SettingsService')
const emailService = require('./EmailService/NofiticationMailDeliver')
const mailGenerator = require('./EmailService/MailGenerator')
const authService = require('./EmailService/getOAuthToken')
const router = express.Router()

//------------------MIDDLEWARE SETUP------------------//

let host = ''
const ip = 'http://localhost:3000' 
//Replace 'local host' with the IP where the client will access to the budget approval screen. 
//Configure a port forwarding in your router, to redirect the traffic to your private IP.

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

//------------------SETTINGS-RELATED REQUESTS------------------//

router.post('/saveSettings', (req, res) => {
    if(req.session.loggedin && (req.session.username === 'Admin')){
        settingsService.saveSettings(req.body.settings, () => {
            res.status(200).send()
        })
    }
    else res.status(403).send()
})

router.get('/getSettings', (req, res) => {
    if(req.session.loggedin && (req.session.username === 'Admin')){
        settingsService.getSettings((result) => {
            res.status(200).send(result)
        }) 
    }
    else res.status(403).send()
})


//------------------EMAIL-RELATED REQUESTS------------------//

router.get('/emailOAuth', (req, res) => {
    if(req.session.loggedin && (req.session.username === 'Admin')) {
        authService.getOAuthLink((err, OAuthLink) => {
            if(err) res.status(404).send()
            else res.status(200).send({link: OAuthLink})
        })
    } else { res.status(403).send() }
})

router.post('/OAuthCode', (req, res) => {
    if(req.session.loggedin && (req.session.username === 'Admin')) {
        authService.sendOAuthCode(req.body.code, (err) => {
            if(err) res.status(404).send()
            else res.status(200).send()
        })
    } else res.status(403).send() 
})

router.get('/isEmailAuthored', (_req, res) => {
    authService.isAuthored((result) => {
        res.status(200).send({auth: result})
    })
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

router.post('/updatePassword', (req, res) => {
    doIfAuthored(req, res, () => {
        if(req.session.username === req.body.user || req.session.username === 'Admin'){
            userService.changePassword(req.body.user, req.body.newPass, (result) => {
                res.status(201).send({userExists: result.changedRows})
            })
        }
        else res.status(403).send()
    })
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
            mailGenerator.firstEmail(email, name, type, brand, model, (mail) => {
                emailService.sendMail(mail, (err) => {
                    if(err) res.status(404).send()
                    else res.status(200).send()
                })
            })
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
    const id = req.params.id
    const state = req.params.state
    doIfAuthored(req, res, () => {   
        doIfOwner(id, req.session.username, res, () => {
            orderService.updateState(id, state, (_result) => {
                mailGenerator.stateUpdateMail(id, (mail) => {
                    emailService.sendMail(mail, (err) => {
                        if(err) res.status(404).send()
                        else res.status(200).send()
                    })
                })
            })
        })
    })    
})

router.post('/loadBudget', (req, res) => {
    const  id = req.body.id
    doIfAuthored(req, res, () => {
        doIfOwner(id, req.session.username, res, () => {
            orderService.loadBudget(req.body.id, req.body.diagnosis, req.body.budget, (_result) => {
                mailGenerator.sendBudgetMail(id, ip, (mail) => {
                    emailService.sendMail(mail, (err) => {
                        if(err) res.status(404).send()
                        else res.status(200).send()
                    })
                })
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
    const id = req.params.id
    const state = req.body.choice ? 'REPARACION' : 'RETIRAR_SINARREGLO'
    orderService.updateState(id, state, (_result) => {
        mailGenerator.stateUpdateMail(id, (mail) => {
            emailService.sendMail(mail, (err) => {
                if(err) res.status(404).send()
                else res.status(200).send()
            })
        })
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