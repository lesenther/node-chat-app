// Socket.io
var socket = io();

// TODO get username 
var user = 'heyyyy';
var sendLocationElement = document.getElementById('sendLocation');
var sendMessageElement = document.getElementById('sendMessage');
var welcomeElement = document.getElementById('welcome');
var textElement = document.getElementById('newMessageText');

socket.on('connect', function(){
  console.log('connected to server');
  welcomeElement.innerHTML = 'Welcome to the chat app ' + user;
});

socket.on('disconnect', function(){
  console.log('disconnected from server');
});

socket.on('newMessage', function(data){
  var newMessage = document.createElement('div');
   newMessage.innerHTML =    
    '<span style="font-size:12px;float:right;color:#666;">' + data.createdAt + '</span>' +
    '<strong>' + data.from + '</strong>: ' + 
    '<span class="messageBody">' + data.text + '</span>' + 
    '';

  document.getElementById('chat').appendChild(newMessage);
});

// -----------------------------------

sendMessageElement.addEventListener('click', function(){
  var text = textElement.value;

  socket.emit('createMessage', { text }, function(){
    textElement.value = '';
  });
});


sendLocationElement.addEventListener('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition(function(position){
    var longitude = position.coords.longitude;
    var latitude = position.coords.latitude;
    socket.emit('createLocationMessage', { latitude, longitude });
  }, function(){
    alert('Unable to fetch location');
  })
});

