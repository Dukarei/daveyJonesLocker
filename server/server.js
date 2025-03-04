import dotenv from 'dotenv' //dotENV for env variables
if(process.env.NODE_ENV !== 'production'){
    dotenv.config()    
}
//importing database functions - some not presently used but may be eventually
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
import {initializePassport} from './passport-config.js'


//set up local vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express()

//various features for the app to use, enabling things like sessions and serving non-html files
app.use(express.json())
app.use(express.static('./'));
const options = {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
};
app.use(express.static(path.join(__dirname, 'public'), options));//allows serving of css
app.use(express.urlencoded({ extended: false}))//allows access to page html elemts
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


//rendering our different webpages based on input URL
app.get('/',  checkNotAuthenicated,(req, res) => {
    const filePath = path.join(__dirname, '../public', 'home.html');
    res.sendFile(filePath);
})
app.get('/registration',  checkNotAuthenicated,(req, res) => {
    const filePath = path.join(__dirname, '../public', 'index.html');
    res.sendFile(filePath);
    })
app.get('/userhome', checkAuthenticated, (req, res) => {
    const filePath = path.join(__dirname, '../public', 'landing.html');
    res.sendFile(filePath);
})
//micro-access functions, probably to be deleted.
app.get('/in_id', checkAuthenticated, (req,res) => {
    console.log(getIn_ID())
    res.json(getIn_ID())
})
app.get('/re_id', checkAuthenticated, (req,res) => {
    console.log(getRe_ID())
    res.json(getRe_ID())
})


//functions for the login/register page
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
app.post('/register', checkNotAuthenicated, async (req, res) => {
    try {
	const { email, password } = req.body;
	const salt = await bcrypt.genSalt(12); // Increase salt rounds for better security
	const hashedPassword = await bcrypt.hash(password, salt);
	const userId = Date.now().toString();
	const success = await insertUser(email, hashedPassword, userId);
	if (success) {
	  res.status(201).json({ message: 'User registered successfully', success: true });
	} else {
	  res.status(500).json({ message: 'User already registered', success: false });
	}
      } catch (error) {
	console.error('Error registering user:', error);
	res.status(500).json({ message: 'Error registering user', success: false });
      }
    })

app.post('/login', checkNotAuthenicated, passport.authenticate('local', {
    successRedirect: '/userhome', 
    failureFlash: true
}))

app.delete('/logout', (req,res) => { //FINISH THIS OR YOULL LOOK SUPER DUMB
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.json({ success: true });
    });
    console.log('logOut() run')
})


//Tracking ID retrieval functions
//need to error test these two, made for individual updates to user's re/in tables
app.post('/update_re', checkAuthenticated, async (req,res) => {
console.log('request body: ', req.body.re_id)
try{
    const re_id = req.body.re_id //pulling from form contents in front-end
    const success = await insertReceived(req.user.email, req.body.re_id, success);//move to db
    if(success){
    res.body = {success:true}
    console.log('received ID: ', re_id) //log new id and send to response
    res.status(201).json({ message: 're_id added' })
        }else{
             res.body = {success:false}
            res.status(500).json({ message: 'id already in table' })
            } 
} catch (error) {
    console.error('Error inserting received IDs:', error)
    res.status(500).json({ message: 'Error inserting received IDs' })
  } })

app.post('/update_in', checkAuthenticated, async (req,res) => {
    const in_id = req.body.in_id
    console.log('request body: ', req.body.in_id)
    try{
        const success = await insertIncoming(req.user.email, req.body.in_id);
        if(success){
            console.log("success")
            res.body = {success:true}   
            console.log('incoming ID: ', in_id)
            res.status(201).json({ message: 'in_id added' })
        }else{
             res.body = {success:false}
            res.status(500).json({ message: 'id already in table' })
            } 
    }catch (error) {
        console.error('Error inserting incoming IDs:', error)
        res.status(500).json({ message: 'Error inserting incoming IDs' })
      } })

//get methods for full tables, respective to a certain user
app.get('/getUpdates', checkAuthenticated, async (req, res) => {
    //retrieves new elements from db at startup/periodically
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
    //code for incoming lists from db
    try{
    const incoming = await getIncoming(req.user.email);
    console.log('incoming IDs: ', incoming)
} catch (error) {
    console.error('Error getting incoming IDs:', error)
  }  })






app.listen(8080)
