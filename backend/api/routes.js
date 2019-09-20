const express = require('express');

const babynameController = require('../controllers/babynameController');
const authController = require('../controllers/authController');
const shortlistController = require('../controllers/shortlistController');

//const passportInit = require('./passport_init');

module.exports = function (passport) {
  const router = express.Router();
  //const passport = passportInit();

  // create new user and login
  router.post('/signup', authController.auth_signup_post,
    passport.authenticate('local'), (req, res) => {
      console.log("authentication successful, user: " + req.user);
      res.json(req.user);
    });

  // login existed user
  router.post('/signin',
              passport.authenticate('local'),
              authController.auth_signin_post);

  router.get('/gender/:gender', babynameController.babyname_list_get);

  router.post('/create', shortlistController.shortlist_create_post);
  router.post('/accept', shortlistController.shortlist_accept_post);
  router.get('/lists/:userId', shortlistController.shortlist_lists_get);
  router.get('/list/:listId', shortlistController.shortlist_get);
  router.get('/shared/:id', shortlistController.shortlist_shared_get);

  /*
  router.post('/shortlist/create', shortlistController.shortlist_create_post);
  router.post('/shortlist/accept', shortlistController.shortlist_accept_post);
  router.get('/shortlists/:userId', shortlistController.shortlist_list);
  router.get('/shortlist/:listId', shortlistController.shortlist_get);
  router.get('/shortlists/shared/:userId', shortlistController.shortlist_shared_get);
  */

  return router;
}
