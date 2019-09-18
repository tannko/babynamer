const { User } = require('../models/UserSchema');
const Shortlist = require('../models/ShortlistSchema');

exports.shortlist_create_post = function(req, res) {
  const user = req.body.user;
  const shortlist = req.body.shortlist;
  const list = new Map([...req.body.list]);

  console.log('start list saving');
  User.findOne({ email: user.email }).
    then(user => {
      if (!user) {
        console.log('user does not exist');
        reject(new Error('user does not exist'));
      }

      const owner = {
        id: user._id,
        name: user.name,
        list: list,
        isUpdated: false
      };

      const newlist = new Shortlist({
        name: shortlist.name,
        status: shortlist.status,
        owner: owner,
        partner: shortlist.partner
      });

      return newlist;
    }).
    then( newlist => {
      newlist.save();
    }).
    then( () => {
      console.log('shortlist saved!');
      res.status(200).send('shortlist successfully saved');
    }).
    catch( error => {
      console.log("save new list error: " + error.message);
      res.status(400).send('create new list error: ' + error.message);
    });

/*
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
  */
};

exports.shortlist_lists_get = function(req, res) {
  const userId = req.params.userId;
  console.log('userId: ' + userId);
  Shortlist.find({ 'owner.id': userId }, '_id name').
    then(data => {
      console.log(data.length + ' lists found');
      res.send(data);
    }).
    catch(error => {
      console.log('lists searching error: ' + error);
      res.status(400).send('lists searching error: ' + error);
    });

/*  Shortlist.find({ 'owner.id': userId }, '_id name', (err, data) => {
    if (err) {
      console.log('list searching error');
      res.status(400).send('lists searching error');
    }
    console.log('some lists found: ' + data.length);
    res.send(data);
  });*/
};

exports.shortlist_get = function(req, res) {
  Shortlist.findById(req.params.listId).
    then(shortlist => {
      res.send(shortlist);
    }).
    catch(error => {
      console.log('get shortlist error: ' +  error);
      res.status(400).send('get shortlist error: ' +  error);
    })

  /*Shortlist.findById(req.params.listId, (err, shortlist) => {
    if (err) {
      console.log('shortlist searching error');
      res.status(400).send('shortlist searching error');
    } else {
      //console.log('list found: ' + JSON.stringify(shortlist));
      res.send(shortlist);
    }
  });*/
};

exports.shortlist_shared_get = function(req, res) {
  const userId = req.params.id;
  console.log('shared with ' + userId);
  Shortlist.find({ 'partner.id': userId }, '_id name status owner.name').
    then(data => {
      console.log(data.length + " lists found");
      res.send(data);
    }).
    catch(error => {
      console.log("shorlist shared get error: " + error);
      res.status(400).send("shorlist shared get error: " + error);
    })

  /*Shortlist.find({ 'partner.id': userId }, '_id name status owner.name', (err, data) => {
    if (err) {
      console.log('shared lists searching error');
      res.status(400).send('shared lists searching error');
    } else {
      console.log('shared lists found: ' + data.length);
      res.send(data);
    }
  });*/
};

exports.shortlist_accept_post = function(req, res) {
  const listId = req.body.id;
  console.log('user' + req.body.user + ' accepts list ' + listId);
  Shortlist.updateOne({ _id: listId }, { status: 2 }).
    then(updateResult => {
      console.log('matched: ' + updateResult.n + "; modified: " + updateResult.nModified);
      res.status(200).send('accepted');
    }).
    catch(error => {
      console.log('accept list error: ' + err);
      res.status(400).send('accept list error');
    });


  /*Shortlist.updateOne({ _id: listId }, { status : 2 }, (err, updres) => {
    if (err) {
      console.log('accept list error: ' + err);
      res.status(400).send('accept list error');
    } else {
      console.log('matched: ' + updres.n + "; modified: " + updres.nModified);
      res.status(200).send('accepted');
    }
  })*/
};
