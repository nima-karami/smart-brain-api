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
        host : 'ec2-44-208-88-195.compute-1.amazonaws.com',
        port : 5432,
        user : 'xcbriqaqqsjrqv',
        password : '4b26e14f4c9b33530e4390c34b0968bccf1b49256e848f3cfb531099adb2b647',
        database : 'de0jir8mqav17p'
    }
});

// app.use(
//     cors();
//     header('Access-Control-Allow-Origin: *'); );

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

const app = express();

app.use(express.json());

app.get('/' , (req, res) => {res.send('app is working')});

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)});

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => {image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});