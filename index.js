const express = require('express');
const helper = require('./api/hashHelpers');
const bcrypt = require('bcryptjs');
const restricted = require('./api/restricted-middleware');

const server = express();

server.use(express.json());

const port = 5000;

//Some bcrypt voodoo inside





//an api called users. When we query it, it returns all the users in the db we created


server.get('/', (req, res) => {
    res.status(200).send('<img src="https://media.giphy.com/media/d3Kq5w84bzlBLVDO/giphy.gif" alt="it\'s alive"/>')
});

server.get('/api/users', restricted, (req, res) => {
    helper.getAllData()
        .then(data => {
        res.send(data)
    });
});

//register to server
server.post('/api/register', (req, res) => {
const credentials = req.body;
const hash = bcrypt.hashSync(credentials.password, 14);
credentials.password = hash;
    helper.add(credentials)
    .then(data => {
            return res.status(401).json({message:  `New details: ${data.username}`})
        });

});

//sign in to server

server.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    helper.findByUsername(username)
    .then(user => {
    if(!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({error: `Incorrect Creds`})
    } else {
        return res.status(200).json({message: `Welcome, ${user.username}!`})
    }
    })
})


server.listen(port, () => console.log(`Listening on ${port}!`));