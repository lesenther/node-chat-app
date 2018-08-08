// Socket.io
var socket = io();

// TODO get username 
var user = {};
var sendLocationElement = document.getElementById('sendLocation');
var sendMessageElement = document.getElementById('sendMessage');
var welcomeElement = document.getElementById('status');
var textElement = document.getElementById('newMessageText');
var chatElement = document.getElementById('chat');

socket.on('connect', function(u){
  console.log('connected to server');
});

socket.on('setUser', function(data){
  user = data.user;
  welcomeElement.innerHTML = 'Welcome to the chat app ' + user.html;
  textElement.focus();
});

socket.on('disconnect', function(){
  console.log('disconnected from server');
});

socket.on('newMessage', function(data){
  var newMessage = document.createElement('div');
  newMessage.innerHTML =    
    '<strong>' + data.from + '</strong>: ' + 
    '<span class="messageBody">' + data.text + '</span>' + 
    '<span class="timestamp">' + moment(data.createdAt).format('h:mm a') + '</span>' +
    '';

  chatElement.appendChild(newMessage);
  chatElement.scrollTop = chatElement.scrollHeight;
  textElement.focus();
});

// -----------------------------------------------------------------------------------------

//
// [ Send Message ]
//
sendMessageElement.addEventListener('click', function(){
  var text = textElement.value;

  socket.emit('createMessage', { text }, function(ok){
    textElement.value = '';
  });
});

//
// [ Send Location ]
//
sendLocationElement.addEventListener('click', function(){
  console.log('Trying to get location...');

  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(function(position){
    console.log('Coordinates found');
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    socket.emit('createLocationMessage', { latitude, longitude });
  }, function(){
    alert('Unable to fetch location');
  })
});

