const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//mock user database
const users = [
    {
        id: 1,
        username: 'poopScoop',
        password: bcrypt.hashSync('password123', 10)
    }
];

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find((user) => user.username === username);

    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign({ userId: user.id }, 'secretkey', { expiresIn: '1h' });

    res.json({ success: true, token });
});

app.get('/dashboard', (req, res) => {
    res.send('Welcome to the dashboard!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});