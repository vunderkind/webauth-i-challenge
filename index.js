const express = require('express');
const helper = require('./api/hashHelpers.js');
const bcrypt = require('bcryptjs');
const restricted = require('./middleware/restricted-middleware');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');
// const cookieprotection = require('./middleware/session');

const server = express();

server.use(express.json());
server.use(cors());
server.use(helmet());

const port = 5000;

//Adding session supportt
const sessionConfig = {
    name: "monkey",
    secret: "Fight me",
    cookie: {
        maxAge: 1000 * 60 * 60,
        secure: false,
        httpOnly: true,
    },
    resave: false,
    saveUnintialized: false,
}

// configure express-session middleware
server.use(session(sessionConfig));

function cookieprotected(req, res, next) {
    if (req.session && req.session.userID) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  }





//an api called users. When we query it, it returns all the users in the db we created


server.get('/', (req, res) => {
    res.status(200).send('<img src="https://media.giphy.com/media/d3Kq5w84bzlBLVDO/giphy.gif" alt="it\'s alive"/>')
});


//Get a restricted list of users
server.get('/api/restricted/users', cookieprotected, (req, res) => {
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
            return res.status(401).json({message:  `New details: ${credentials.username}`})
        });

});

//sign in to server

server.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    req.session.userID = 'mogwai';
    helper.findByUsername(username)
    .then(user => {
    if(!user || !bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        return res.status(401).json({error: `Incorrect Creds`})
    } else {
        return res.status(200).json({message: `Welcome, ${user.username}!`})
    }
    })
});

//implementing log out
server.get('/api/logout', (req, res) => {
    if (req.session) {
      req.session.destroy(err => {
        if (err) {
          res.send('error logging out');
        } else {
          res.send('good bye!');
        }
      });
    }
  });

server.listen(port, () => console.log(`Listening on ${port}!`));