if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}


const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session') //using session allows req.user.name always = present user in sessions
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')
initializePassport(passport, 
    email => users.find(user => user.email === email), 
    id => users.find(user => user.id === id)
)

const app = express()

app.use(express.json())
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false}))//allows access to page html
const users = [{name:"poop"}] //replace w/ db

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/',  checkNotAuthenicated,(req, res) => {
    res.sendFile(__dirname + '/home.html')
})
app.get('/login',  checkNotAuthenicated,(req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/register',  checkNotAuthenicated,(req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/userhome', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/landing.html')
})
app.get('/update_re', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/landing.html')
})
app.get('/update_in', checkAuthenticated, (req, res) => {
    res.sendFile(__dirname + '/landing.html')
})
app.get('/users', (req,res) => {
    res.json(users)
})
app.post('/userhome', checkAuthenticated, (req,res) => {

})

app.post('/update_re', checkAuthenticated, (req,res) => {
//code for received lists from db
console.log('request body: ', req.body)


})

app.post('/update_in', checkAuthenticated, (req,res) => {
//code for updating incoming lists from db
console.log('request body: ', req.body)

})
app.post('/register', checkNotAuthenicated, async (req, res) => {
    try {
        
        console.log('Request body:', req.body);
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { 
            name: req.body.username, 
            password: hashedPassword, 
            email: req.body.email, 
            id: Date.now().toString()
        }
        users.push(user)
        console.log('User registered successfully:', user)
        res.status(201).send('User registered successfully')
    } catch (error) {
        console.error('Error registering user:', error)
        res.status(500).send('Error registering user')
    }
})

app.delete('/logout', (req,res) => { //FINISH THIS OR YOULL LOOK SUPER DUMB
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true });
    });
    console.log('logOut() run')
})

/*
app.post('/login', async (req,res) => { //login
    const user = users.find(user => user.name === req.body.username)
    if (user == null){
        return res.status(400).send('User not found')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            //res.send('Success')
            console.log("successful login")
            res.redirect('landing.html') //not working properly atm
        }else {
          res.send('Incorrect password')  
        }
    }catch(error){
        console.error('Error logging in user: ', error)
        res.status(500).send('Error signing user in(likely wrong password)')
    }
})
*/
app.post('/login', checkNotAuthenicated, passport.authenticate('local', {
    successRedirect: '/userhome', 
    failureRedirect: '/',
    failureFlash: true
}))

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }else{
        res.redirect('/')
    }
}

function checkNotAuthenicated(req,res,next){
    if(req.isAuthenticated()){
        return res.redirect('/userhome')
    }
    else{
        next()
    }
}

app.listen(3000)
