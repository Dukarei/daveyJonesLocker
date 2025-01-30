const express = require('express')
const bcrypt = require('bcrypt')

const app = express()


app.use(express.json())
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: false}))//allows access to page html

const users = [{name:"poop"}] //replace w/ db

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})
app.get('/userhome', (req, res) => {
    res.sendFile(__dirname + '/landing.html')
})

app.get('/users', (req,res) => {
    res.json(users)
})

app.post('/register', async (req, res) => {
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

app.post('/login', async (req,res) => { //login
    const user = users.find(user => user.name === req.body.username)
    if (user == null){
        return res.status(400).send('User not found')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
            console.log("successful login")
        }else {
          res.send('Incorrect password')  
        }
    }catch(error){
        console.error('Error logging in user: ', error)
        res.status(500).send('Error signing user in(likely wrong password)')
    }
})

app.listen(3000)
