const socketIO = require('socket.io');
const Shortlist = require('../models/ShortlistSchema');
const { User } = require('../models/UserSchema');

module.exports = function (server) {
  const io = socketIO(server);
  io.on('connection', socket => {

    socket.on("remove", params => {
      Shortlist.deleteOne({ _id: params.id }, (err, removeres) => {
        if (err) {
          console.log('remove list error:' + err);
          io.sockets.emit('error', { id: params.id, error: err, modal: 'removeModal' });
        } else {
          console.log('removed: ' + removeres.deletedCount);
          io.sockets.emit('minorChange', { listId: params.id, userId: params.partnerId, modal: 'removeModal' });
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
}
