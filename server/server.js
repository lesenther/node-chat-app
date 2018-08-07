const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  var userId = 'user' + Math.floor(Math.random() * 1000000000);

  console.log('new user connected: ' + userId);
  
  socket.emit('newMessage', generateMessage('Admin', 'Welcome ' + userId + ' to the chat'));
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'User ' + userId + ' has joined the chat'));

  socket.on('disconnect', _ => {
    io.emit('newMessage', generateMessage('Admin', userId + ' has left the chat'));
  });

  socket.on('createMessage', (data, callback) => {
    io.emit('newMessage', generateMessage(userId, data.text));
    callback({userId});
  });

  socket.on('createLocationMessage', (data) => {
    io.emit('newMessage', generateMessage('Admin', userId + ' just shared their <a target="_blank" href="https://www.google.com/maps?q=' + data.latitude + ',' + data.longitude + '">location</a>'));
  });
});

server.listen(port, _ => {
  console.log(`Server running on port ${port}`);
});
