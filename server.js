const express = require('express');

const app = express();

app.use(express.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        }, 
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'coopies',
            entries: 0,
            joined: new Date()
        } 
    ]
};

app.get('/', (req, res) => {
    res.send('this is working');
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json('singing in...');
    } else {
        res.status(400).json('error logging in');
    }
    
});

app.post('/register', (req, res) => {
    database.users.push({
            id: '125',
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            entries: 0,
            joined: new Date()
    });

    res.send(database.users);
});


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            res.json(user);
        }
            
        })

    if (!found) {
        res.status(404).json('no such user');
    }
});

app.listen(3000, () => {
    console.log('app is running on port 3000');
});