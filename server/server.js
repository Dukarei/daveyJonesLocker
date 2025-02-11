import dotenv from 'dotenv'
if(process.env.NODE_ENV !== 'production'){
    dotenv.config()    
}

//importing database functions
import {
    getIn_ID,
    getRe_ID,
    getUserByEmail,
    getUserById,
    getIncoming,
    getReceived,
    getUsers,
    insertIncoming,
    insertReceived,
    insertUser,
    deleteReceived,
    deleteIncoming,
    deleteUser,
    inReceived,
    inIncoming,
    inUsers} from '../db/db.js'

import express from 'express'
import bcrypt from 'bcrypt'
import passport from 'passport'
import flash from 'express-flash'
import session from 'express-session' //using session allows req.user.name always = present user in sessions
import methodOverride from 'method-override'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {initializePassport} from './passport-config.js'
/*
initializePassport(passport, 
    email => users.find(user => user.email === email), 
    id => users.find(user => user.id === id)
)*/
initializePassport(passport, 
    async (email) => {
      try {
        return await getUserByEmail(email);
      } catch (error) {
        console.error('Error getting user by email:', error);
      }
    },
    async (id) => {
        try {
            return await getUserById(id);
          } catch (error) {
            console.error('Error getting user by ID:', error);
          }
    }
  )

const app = express()

app.use(express.json())
app.use(express.static('./'));
const options = {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
};

app.use(express.static(path.join(__dirname, 'public'), options));
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
    const filePath = path.join(__dirname, '../public', 'home.html');
    res.sendFile(filePath);
})
/*
app.get('/login',  checkNotAuthenicated,(req, res) => {
    const filePath = path.join(__dirname, '../public', 'index.html');
    res.sendFile(filePath);
})
app.get('/register',  checkNotAuthenicated,(req, res) => {
    const filePath = path.join(__dirname, '../public', 'index.html');
    res.sendFile(filePath);
})
    */
app.get('/registration',  checkNotAuthenicated,(req, res) => {
  
    const filePath = path.join(__dirname, '../public', 'index.html');
    res.sendFile(filePath);
  
    })
app.get('/userhome', checkAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../public', 'landing.html');
    res.sendFile(filePath);
})
/*
app.get('/update_re', checkAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../public', 'landing.html');
    res.sendFile(filePath);
})
app.get('/update_in', checkAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../public', 'landing.html');
    res.sendFile(filePath);
})*/
app.get('/users', (req,res) => {
    res.json(getUsers())
})
app.post('/userhome', checkAuthenticated, async (req,res) => {

})

app.get('/in_id', (req,res) => {
    console.log(getIn_ID())
    res.json(getIn_ID())
})
app.get('/re_id', (req,res) => {
    console.log(getRe_ID())
    res.json(getRe_ID())
})


//need to error test
app.post('/update_re', checkAuthenticated, async (req,res) => {
//code for received lists from db
console.log('request body: ', req.body.re_id)
try{
    const re_id = req.body.re_id
    const received = await insertReceived(req.user.email, req.body.re_id);
    console.log('received ID: ', re_id)
    res.json({received, re_id})
} catch (error) {
    console.error('Error inserting received IDs:', error)
    res.status(500).json({ message: 'Error inserting received IDs' })
  } })

app.post('/update_in', checkAuthenticated, async (req,res) => {
    //code for received lists from db
    const in_id = req.body.in_id
    console.log('request body: ', req.body.in_id)
    try{
        const incoming = await insertIncoming(req.user.email, req.body.in_id);
        console.log('incoming ID: ', in_id)
        res.json({incoming, in_id})
    } catch (error) {
        console.error('Error inserting incoming IDs:', error)
        res.status(500).json({ message: 'Error inserting incoming IDs' })
      } })



app.get('/getUpdates', checkAuthenticated, async (req, res) => {
    try {
          const incoming = await getIncoming(req.user.email);
          const received = await getReceived(req.user.email);
          res.json({ incoming, received });
    } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error getting updates' });
    }
      });
app.get('/received', checkAuthenticated, async (req,res) => {
    //code for received lists from db
    try{
    const received = await getReceived(req.user.email);
    console.log('received IDs: ', received)
} catch (error) {
    console.error('Error getting received IDs:', error)
  }  })
    
  app.get('/incoming', checkAuthenticated, async (req,res) => {
    //code for received lists from db
    try{
    const incoming = await getIncoming(req.user.email);
    console.log('incoming IDs: ', incoming)
} catch (error) {
    console.error('Error getting incoming IDs:', error)
  }  })




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
        //old array method users.push(user)
        insertUser(req.body.email, hashedPassword)
        
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
        return res.redirect('/')
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



app.listen(8080)
