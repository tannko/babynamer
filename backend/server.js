const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Babyname = require('./babyname');
const Shortlist = require('./ShortlistSchema');
const bcrypt = require('bcrypt');
const { User, validate } = require('./UserSchema');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const socketIO = require('socket.io');
const http = require('http');

const API_PORT = 3003;

const app = express();
app.use(cors());
app.use(bodyParser.json());
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
  const list = new Map([...req.body.list]);
  //console.log('nameRatingList: ' + JSON.stringify(req.body.list));

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
      list: list,
      isUpdated: false
    };

    let newlist = new Shortlist({
      name: shortlist.name,
      status: shortlist.status,
      owner: owner,
      partner: shortlist.partner
    });

    newlist.save( err => {
      if (err) {
        console.log('error saving shortlist');
        res.status(400).send('error saving shortlist: ' + err);
      } else {
        console.log('shortlist saved!');
        res.status(200).send('shortlist successfully saved');
      }
    });

  });
});

router.post('/updateList', (req, res) => {
  //const shortlist = req.body.shortlist;
  const id = req.body.id;
  const list = new Map(req.body.list);
  const field = req.body.editor + '.list';
  Shortlist.updateOne({ _id: id }, { [field]: list }, (err, updres) => {
    if (err) {
      console.log('update list error: ' + err);
      res.status(400).send('update list error');
    } else {
      console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
      res.status(200).send('list updated');
    }
  });
});

router.post('/rename', (req, res) => {
  const id = req.body.id;
  const name = req.body.name;
  Shortlist.updateOne({ _id: id }, { name: name }, (err, updres) => {
    if (err) {
      console.log('rename list error: ' + err);
      res.status(400).send('rename list error');
    } else {
      console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
      res.status(200).send('updated');
    }
  });
});

router.post('/remove', (req, res) => {
  const id = req.body.id;
  Shortlist.deleteOne({ _id: id }, (err, removeres) => {
    if (err) {
      console.log('remove list error:' + err);
      res.status(400).send('remove list error');
    } else {
      console.log('removed: ' + removeres.deletedCount);
      io.sockets.emit("listRemoved");
      res.status(200).send('removed');

    }
  });
});

/*router.post('/share', (req, res) => {
  const email = req.body.email;
  const id = req.body.id;
  const nameslist = req.body.list;
  User.findOne({ email: email }, ( err, user ) => {
    if (err) {
      console.log('error looking for user with email ' + email);
      res.status(400).send('error looking for user with email ' + email);
    }

    if (!user) {
      console.log('user with email ' + email + ' is not found');
      res.status(400).send('user with email ' + email + ' is not found');
    }

    const partner = {
      id: user._id,
      name: user.name,
      list: new Map([...nameslist]),
      isUpdated: false
    };
    Shortlist.updateOne({ _id: id }, { status: 1, partner: partner }, (err, updres) => {
      if (err) {
        console.log('share list error: ' + err);
        res.status(400).send('share list error');
      } else {
        console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
        res.status(200).send('shared');
        //io.sockets.emit("listShared", id);
      }
    });
  });
});
*/
router.post('/unshare', (req, res) => {
  const id = req.body.id;
  Shortlist.updateOne({ _id: id }, { partner: null, status: 0 }, (err, updres) => {
    if (err) {
      console.log('unshare list error: ' + err);
      res.status(400).send('unshare list error');
    } else {
      console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
      res.status(200).send('unshared');
    }
  });
});

router.post('/accept', (req, res) => {
  const listId = req.body.id;
  console.log('user' + req.body.user + ' accepts list ' + listId);
  Shortlist.updateOne({ _id: listId }, { status : 2 }, (err, updres) => {
    if (err) {
      console.log('accept list error: ' + err);
      res.status(400).send('accept list error');
    } else {
      console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
      res.status(200).send('accepted');
    }
  })
});

router.get('/lists/:userId', (req, res) => {
  const userId = req.params.userId;
  console.log('userId: ' + userId);
  Shortlist.find({ 'owner.id': userId }, '_id name', (err, data) => {
    if (err) {
      console.log('list searching error');
      res.status(400).send('lists searching error');
    }
    console.log('some lists found: ' + data.length);
    res.send(data);
  });
});

router.get('/list/:listId', (req, res) => {
  //console.log("list id: " + req.params.listId);
  Shortlist.findById(req.params.listId, (err, shortlist) => {
    if (err) {
      console.log('shortlist searching error');
      res.status(400).send('shortlist searching error');
    } else {
      //console.log('list found: ' + JSON.stringify(shortlist));
      res.send(shortlist);
    }
  });
});

router.get('/shared/:id', (req, res) => {
  const userId = req.params.id;
  console.log('shared with ' + userId);
  Shortlist.find({ 'partner.id': userId }, '_id name status owner.name', (err, data) => {
    if (err) {
      console.log('shared lists searching error');
      res.status(400).send('shared lists searching error');
    } else {
      console.log('shared lists found: ' + data.length);
      res.send(data);
    }
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

  socket.on("remove", id => {
    Shortlist.deleteOne({ _id: id }, (err, removeres) => {
      if (err) {
        console.log('remove list error:' + err);
        io.sockets.emit('error', { id: id, error: err, modal: 'removeModal' });
      } else {
        console.log('removed: ' + removeres.deletedCount);
        io.sockets.emit("listRemoved", id);
      }
    });
  });

  socket.on("rename", params => {
    const id = params.id;
    const name = params.name;
    Shortlist.updateOne({ _id: id }, { name: name }, (err, updres) => {
      if (err) {
        console.log('rename list error: ' + err);
        io.sockets.emit('error', { id: id, error: err, modal: 'renameModal' });
      } else {
        console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
        io.sockets.emit('minorChange', { listId: id, userId: params.partnerId, modal: 'renameModal' });
      }
    });
  });

  socket.on("share", params => {
    const email = params.email;
    const id = params.id;
    const nameslist = params.list;
    User.findOne({ email: email }, ( err, user ) => {
      if (err) {
        console.log('error looking for user with email ' + email);
        io.sockets.emit('error', { id: id, error: err, modal: 'shareModal' });
      }

      if (!user) {
        console.log('user with email ' + email + ' is not found');
        io.sockets.emit('error', { id: id,
          error: 'user with email ' + email + ' is not found',
          modal: 'shareModal' });
      }

      const partner = {
        id: user._id,
        name: user.name,
        list: new Map([...nameslist]),
        isUpdated: false
      };
      Shortlist.updateOne({ _id: id }, { status: 1, partner: partner }, (err, updres) => {
        if (err) {
          console.log('share list error: ' + err);
          io.sockets.emit('error', { id: id, error: err, modal: 'shareModal' });
        } else {
          console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
          const resultParams = {
            listId: id,
            userId: user._id,
            modal: 'shareModal'
          };
          //io.sockets.emit("listShared", resultParams);
          io.sockets.emit('minorChange', resultParams);
        }
      });
    });
  });

  socket.on("unshare", params => {
    const id = params.id;
    Shortlist.updateOne({ _id: id }, { partner: null, status: 0 }, (err, updres) => {
      if (err) {
        console.log('unshare list error: ' + err);
        io.sockets.emit('error', { id: id, error: err, modal: 'unshareModal' });
      } else {
        console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
        io.sockets.emit('minorChange', { listId: id, userId: params.partnerId, modal: "unshareModal" });
      }
    });
  })

  socket.on("update", params => {
    const id = params.id;
    const list = new Map(params.list);
    const field = params.editor + '.list';
    const flag = params.editor + '.isUpdated';
    Shortlist.updateOne({ _id: id }, { [field]: list, [flag]: true }, (err, updres) => {
      if (err) {
        console.log('update rating error: ' + err);
        io.sockets.emit('error', { id: id, error: err });
      } else {
        console.log('rating update: matched: ' + updres.n + "; modified: " + updres.nModified);
        io.sockets.emit('ratingUpdated', id);
      }
    });
  });

  socket.on("updateViewed", params => {
    const id = params.id;
    const flag = params.updateOwner + '.isUpdated';
    Shortlist.updateOne({ _id: id }, { [flag]: false }, (err, updres) => {
      if (err) {
        console.log('update flag error: ' + err);
        io.sockets.emit('error', { id: id, error: err });
      } else {
        console.log('flag update: matched: ' + updres.n + "; modified: " + updres.nModified);
        io.sockets.emit('flagUpdated', id);
      }
    });
  });

});
server.listen(API_PORT);
