import dotenv from 'dotenv' //dotENV for env variables
if(process.env.NODE_ENV !== 'production'){
    dotenv.config()    
}
//importing database functions - some not presently used but may be eventually
import {
    getUserByEmail,
    getUserById,
    getIncoming,
    getReceived,
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

app.post('/move_id', checkAuthenticated, async (req, res) => {
try{
    console.log("beginning ID move: ", req.body.id);
    if(await inIncoming(req.body.id, req.user.email)){
	const id = req.body.id;
	let success = false;
	success = await deleteIncoming(req.user.email, id);
	if(success){
	    console.log("deleted ID", id);
	    if(!await inReceived(req.body.id, req.user.email)){
		const in_id = req.body.id;
		let success = false;
		success = await insertReceived(req.user.email, id);
		if(success){
		    console.log("moved ID", in_id);
		    res.status(201).json({message: "ID moved successfully", success:true});
		}
	    }
//	 res.status(201).json({message: "ID removed successfully", success:true});
	}
    }
    else{
	res.status(500).json({message: "Error moving ID/not in db", success:false});
    }
}catch(error){
    console.error("error deleting ID", error);
    res.status(500).json({message: "Error deleting ID"});
}
})

app.post('/delete_id', checkAuthenticated, async (req, res) => {
try{
    console.log("beginning ID delete", req.body.id);
    if(await inReceived(req.body.id, req.user.email)){
	const re_id = req.body.id;
	let success = false;
	success = await deleteReceived(req.user.email, re_id);
	if(success){
	    console.log("deleted ID", re_id);
	    res.status(201).json({message: "ID removed successfully", success:true});
	}
    }
    else if(await inIncoming(req.body.id, req.user.email)){
	const in_id = req.body.id;
	let success = false;
	success = await deleteIncoming(req.user.email, in_id);
	if(success){
	    console.log("deleted ID", in_id);
	    res.status(201).json({message: "ID removed successfully", success:true});
	}
    }
    else{
	res.status(500).json({message: "Error deleting/not in db", success:false});
    }
}catch(error){
    console.error("error deleting ID", error);
    res.status(500).json({message: "Error deleting ID"});
}
})

//Tracking ID retrieval functions
//need to error test these two, made for individual updates to user's re/in tables
app.post('/update_re', checkAuthenticated, async (req,res) => {
try{
    const re_id = req.body.re_id //pulling from form contents in front-end
    let success = false;
    success = await insertReceived(req.user.email, req.body.re_id);//move to db
    if(success){
	console.log('received ID: ', re_id) //log new id and send to response
	res.status(201).json({ message: 're_id added',success:true,re_id})
    }else{
	res.status(500).json({ message: 'id already in table',success:false })
	} 
} catch (error) {
    console.error('Error inserting received IDs:', error)
    res.status(500).json({ message: 'Error inserting received IDs' })
  } })

app.post('/update_in', checkAuthenticated, async (req,res) => {
try{
    const in_id = req.body.in_id
    let success = false;
    success = await insertIncoming(req.user.email, req.body.in_id);
    if(success){
	console.log('incoming ID: ', in_id)
	res.status(201).json({ message: 'in_id added', success:true, in_id})
    }else{
	res.status(500).json({ message: 'id already in table', success:false })
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
          res.json({received });
} catch (error) {
    console.error('Error getting received IDs:', error)
  }  })
    
  app.get('/incoming', checkAuthenticated, async (req,res) => {
    //code for incoming lists from db
    try{
    const incoming = await getIncoming(req.user.email);
    res.json({ incoming});
    console.log('incoming IDs: ', incoming)
} catch (error) {
    console.error('Error getting incoming IDs:', error)
  }  })
//box  info methods
//look into adding method to check the password's validity.
app.get('/boxInfo', async function(req, res) {
  try {
    const { email, pass } = req.body;
    console.log("email: ", email);
    console.log("password: ", pass);
    if (!email || !pass) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const hashword = user.pass;
    console.log("pass: ", pass);
    console.log("hash: ", hashword);
    if (await bcrypt.compare(pass, hashword)) {
      const incoming = await getIncoming(email);
      const received = await getReceived(email);
      return res.json({ incoming, received });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error getting updates' });
  }      
});
app.post('/boxUpdate', async function(req, res) {
    try {
	bcrypt.compare(req.body.password, user.password, function(err, res) {
	  if (err){
	  }
	  if (res) {
	  } else {
	    return response.json({success: false, message: 'passwords do not match'});
	  }
	});
	const incoming = await getIncoming(req.body.email);
	const received = await getReceived(req.body.email);
      res.json({ incoming, received });
    } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Error getting updates' });
    }
      });





app.listen(8080)
