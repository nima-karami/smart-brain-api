const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});

const app = express();

app.use(cors({ origin: ['localhost:3000'] }));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});



app.use(express.json());

app.get('/' , (req, res) => {res.send('app is working')});

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => {const {email, name, password} = req.body;

if (!email || !name || !password) {
    return res.status(400).json('incorrect form submission')
}

const hash = bcrypt.hashSync(password);
console.log('step 1');
db.transaction(trx => {
    console.log('step 2');
    trx.insert({
        hash: hash,
        email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
        console.log('step 3');
        trx('users')
        .returning('*')
        .insert({
        name: name,
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

 .catch(err => res.status(400).json('unable to register'))});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});