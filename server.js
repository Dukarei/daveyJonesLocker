const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

app.use(express.json())

const users = [{name:"poop"}]

app.get('/users', (req,res) => {
    res.json(users)
})

app.post('/users', async (req,res) => {
    try{
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = { name: req.body.name, password: hashedPassword}
        users.push(user)
        res.status(201).send() //blank send 
    }  catch
    {
        req.status(500).send() //if something goes wrong 
    }  
})

app.post('/users/login', async (req,res) => {
    const user = users.find(user => user.name === req.body.name)
    if (user == null){
        return res.status(400).send('User not found')
    }
    try{
        if(await bcrypt.compare(req.body.password, user.password)){
            res.send('Success')
        }else {
          res.send('Incorrect password')  
        }
    }catch{
        res.status(500).send()
    }
})

app.listen(3000)
