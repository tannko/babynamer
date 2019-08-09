const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Babyname = require('./babyname');
const Shortlist = require('./ShortlistSchema');
const bcrypt = require('bcrypt');
const {User, validate} = require('./UserSchema');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const socketIO = require('socket.io');
const http = require('http');

const API_PORT = 3003;

const app = express();
app.use(cors());
const router = express.Router();

// this is our MongoDB database
const dbRoute =
  'mongodb+srv://admin:t9gj8OiFkA75zy2p@clusterfornames-sbtoo.mongodb.net/names?retryWrites=true&w=majority';


mongoose.connect(dbRoute, {useNewUrlParser: true});

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

//session
app.use(session({ secret: "mysecret" }));

//passport init
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(username, password, done) {
    console.log("authentication");
    User.findOne({ email: username }, function(err, user) {
      if (err) {
        console.log('mongodb error: ' + error);
        return done(err);
      }

      if (!user) {
        console.log('User does not exist');
        return done(null, false, { message: 'User does not exist' });
      }

      bcrypt.compare(password, user.password, function(err, res) {
        if (err) {
          console.log('bcrypt err: ' + err);
          return done(err);
        }
        if (!res) {
          console.log('Invalid password');
          return done(null, false, { message: 'Invalid password' });
        }
        console.log('User logged in');
        return done(null, user);
      });
    });
  }
));

router.get('/test/gender/:gender', (req, res) => {
  Babyname.find({ gender : req.params.gender },(err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("received data: " + data.length);
      res.json(data);
    }
  })
});

// create new user and login
router.post('/signup', async (req, res, next) => {
  console.log('server signup');
  const {error} = validate(req.body);
  if (error) {
    console.log('error from server: ' + error.details[0].message);
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: req.body.email });
  if (user) {
    console.log("user already exists");
    return res.status(400).send("User already exists");
  }

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  user.password = await bcrypt.hash(user.password, 10);
  console.log("lets save user");
  await user.save();
  console.log("user saved");
  next();
}, passport.authenticate('local'),
  (req, res) => {
  console.log("authentication successful, user: " + req.user);
  res.json(req.user);
  }
);

// login existed user
router.post('/signin',
            passport.authenticate('local'),
            (req, res) => {
              console.log("authentication successful, user: " + req.user);
              res.send(req.user);
            }
);

// save new shortlist
router.post('/saveList', (req, res) => {
  const user = req.body.user;
  const shortlist = req.body.shortlist;
  const nameRatingList = req.body.nameRatingList;
  console.log('start list saving');
  User.findOne({ email: user.email }, (err, user) => {
    if (err) {
      console.log('error finding user');
      res.status(400).send('error finding user');
    }

    if (!user) {
      console.log('user does not exist');
      res.status(400).send('user does not exist');
    }

    const owner = {
      id: user._id,
      name: user.name,
      list: nameRatingList,
      isUpdated: false
    };

    let shortlist = new Shortlist({
      name: shortlist.name,
      status: shortlist.status,
      owner: owner,
      partner: shortlist.partner
    });

    shortlist.save( err => {
      if (err) {
        console.log('error saving shortlist');
        res.status(400).send('error saving shortlist');
      }
      console.log('shortlist saved!');
      res.status(200).send('shortlist successfully saved');
    });

  });
});

router.post('/updateList', (req, res) => {
  const shortlist = req.body.shortlist;
  Shortlist.updateOne({ _id: shortlist._id }, shortlist, (err, updres) => {
    if (err) {
      console.log('update list error: ' + err);
      res.status(400).send('update list error');
    }
    console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
    res.status(200).send('list updated');
  });
});

router.post('/rename', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  Shortlist.updateOne({ _id: id }, { name: name }, (err, updres) => {
    if (err) {
      console.log('rename list error: ' + err);
      res.status(400).send('rename list error');
    }
    console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
    res.status(200).send('updated');
  });
});

router.post('/remove', (req, res) => {
  const id = req.body.id;
  Shortlist.deleteOne({ _id: id }, (err, res) => {
    if (err) {
      console.log('remove list error:' + err);
      res.status(400).send('remove list error');
    }
    console.log('removed: ' + res.deletedCount);
    res.status(200).send('removed');
  });
});

router.post('/share', (req, res) => {
  const email = req.body.email;
  const id = req.body.id;
  User.findOne({ email: email }, ( err, user ) => {
    if (err) {
      console.log('error looking for user with email ' + email);
      res.status(400).send('error looking for user with email ' + email);
    }

    if (!user) {
      console.log('user with email ' + email + ' is not found');
      res.status(400).send('user with email ' + email + ' is not found');
    }

    const sharedWith = {
      user: user._id,
      status: 0
    };
    Shortlist.updateOne({ _id: id }, { sharedWith: sharedWith }, (err, updres) => {
      if (err) {
        console.log('share list error: ' + err);
        res.status(400).send('share list error');
      }
      console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
      res.status(200).send('shared');
    });
  });
});

router.post('/unshare', (req, res) => {
  const id = req.body.id;
  Shortlist.updateOne({ _id: id }, { sharedWith: null }, (err, updres) => {
    if (err) {
      console.log('unshare list error: ' + err);
      res.status(400).send('unshare list error');
    }
    console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
    res.status(200).send('unshared');
  });
});

router.post('/accept', (req, res) => {
  const listId = req.body.id;
  console.log('user' + req.body.user + ' accepts list ' + listId);
  Shortlist.updateOne({ _id: listId }, { 'sharedWith.status': 1 }, (err, updres) => {
    if (err) {
      console.log('accept list error: ' + err);
      res.status(400).send('accept list error');
    }
    console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
    res.status(200).send('accepted');
  })
});

router.get('/lists/:id', (req, res) => {
  const userId = req.params.id;
  console.log('userId: ' + userId);
  Shortlist.find({ 'owner.user': userId }, (err, data) => {
    if (err) {
      console.log('list searching error');
      res.status(400).send('lists searching error');
    }
    console.log('some lists found: ' + data.length);
    res.send(data);
  });
});

router.get('/shared/:id', (req, res) => {
  const userId = req.params.id;
  console.log('shared with ' + userId);
  Shortlist.find({ 'sharedWith.user': userId }, (err, data) => {
    if (err) {
      console.log('shared lists searching error');
      res.status(400).send('shared lists searching error');
    }
    console.log('shared lists found: ' + data.length);
    res.send(data);
  });
});

router.get('/user/:id', (req, res) => {
  const id = req.params.id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      console.log('error finding user');
      res.status(400).send('error finding user');
    }
    console.log('user found');
    res.send(user);
  });
});

// append /api for our http requests
app.use('/api', router);

// launch our backend into a port
//app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

const server = http.createServer(app);
const io = socketIO(server);
io.on('connection', socket => {
  socket.on("saveDataFromShared", shortlist => {
    Shortlist.updateOne({ _id: shortlist._id }, shortlist, (err, updres) => {
      if (err) {
        console.log('update list error: ' + err);
        //emit error event?
      }
      console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
      io.sockets.emit("listIsUpdated", shortlist._id);
    });
  });
});
server.listen(API_PORT);
