const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const randomColor = require('randomcolor');

const {generateMessage, generateUserLink} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', socket => {
  var userId = Math.floor(Math.random() * 1000000000); 
  var user = {
    id: userId,
    name: 'Guest' + userId,
    color: randomColor()
  };
  user.html = generateUserLink(user);
  console.log('User connected: ' + user.name);
  socket.emit('setUser', {user});
  
  socket.emit('newMessage', generateMessage('Admin', 'Welcome ' + generateUserLink(user) + ' to the chat'));
  socket.broadcast.emit('newMessage', generateMessage('Admin',  generateUserLink(user) + ' has joined the chat'));

  socket.on('disconnect', _ => {
    io.emit('newMessage', generateMessage('Admin', generateUserLink(user) + ' has left the chat'));
  });

  socket.on('createMessage', (data, callback) => {
    io.emit('newMessage', generateMessage(generateUserLink(user), data.text));
    callback(true);
  });

  socket.on('createLocationMessage', (data) => {
    io.emit('newMessage', generateMessage('Admin', generateUserLink(user) + ' just shared their <a target="_blank" href="https://www.google.com/maps?q=' + data.latitude + ',' + data.longitude + '">location</a>'));
  });
});

server.listen(port, _ => {
  console.log(`Server running on port ${port}`);
});
