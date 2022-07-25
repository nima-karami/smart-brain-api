const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        port : 5432,
        user : 'postgres',
        password : 'test',
        database : 'smart_brain'
    }
});


const app = express();

app.use(express.json());

app.use(cors());

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
    res.send(database.users);
});

app.post('/signin', (req, res) => {
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
    
});

app.post('/register', (req, res) => {

    const hash = bcrypt.hashSync(req.body.password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: req.body.email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            trx('users')
            .returning('*')
            .insert({
            name: req.body.name,
            email: loginEmail[0].email,
            joined: new Date()
            })
            .then(user => {
            res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    
     .catch(err => res.status(400).json('unable to register'))
    
});


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    
    db.select('*').from('users').where({id: id})
        .then(user => {
            if (user.length) {
                res.json(user[0])
            } else {
                res.status(400).json('Not found')
            }
        })
    .catch(err => res.status(400).json('error getting user'))


    // if (!found) {
    //     res.status(404).json('not found');
    // }
});


app.put('/image', (req, res) => {
    const { id } = req.body;

    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            console.log(entries[0].entries);
            res.json(entries[0].entries);
        })
        .catch(err => res.status(400).json('unable to get entries'))
    // database.users.forEach(user => {
    //     if (user.id === id) {
    //         found = true;
    //         user.entries++
    //         res.json(user.entries);
    //     }
});




app.listen(3000, () => {
    console.log('app is running on port 3000');
});