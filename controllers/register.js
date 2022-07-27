const knex = require('knex');
const bcrypt = require('bcrypt-nodejs');
const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: true,
    }
});

const handleRegister = (req, res) => {
    const {email, name, password} = req.body;   

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
    
     .catch(err => res.status(400).json('unable to register'))
    
};

module.exports = {
    handleRegister: handleRegister
}