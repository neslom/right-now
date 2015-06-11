const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const path = require('path');

const redis = require('redis');

const clientSubscriber = redis.createClient();

const clientPublisher = redis.createClient();

clientSubscriber.subscribe('community');

clientSubscriber.on('message', function (channel, message) {
  io.sockets.emit('message', {
    user: 'turingbot',
    text: message
  });

});

app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

io.on('connection', function (socket) {
  console.log('Someone has connected 👀');

  socket.on('message', function (channel, message) {
    console.log('MESSAGE FROM THE CLIENT -->', message);

    socket.broadcast.emit('message', {
      user: 'client',
      message: message
    });

    clientPublisher.publish('community', JSON.stringify({ user: 'user', msg: message }));

  });

});

http.listen(process.env.PORT || 3000, function(){
  console.log('Your server is up and running on Port 3000. Good job!');
});
