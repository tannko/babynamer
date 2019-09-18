const Babyname = require('../models/BabynameSchema');

exports.babyname_list_get = function(req, res) {
  Babyname.find({ gender: req.params.gender }).
    then( data => {
      console.log(data.length + " names found");
      res.json(data);
    }).
    catch( error => {
      console.log(error);
      res.status(400).send(error);
    });

  /*Babyname.find({ gender : req.params.gender },(err, data) => {
    if (err) {
      console.log(err);
    } else {
      console.log("received data: " + data.length);
      res.json(data);
    }
  })*/
};
