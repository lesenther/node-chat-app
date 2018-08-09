// Socket.io
var socket = io();

// TODO get username 
var user = {};
var sendLocationElement = document.getElementById('sendLocation');
var sendMessageElement = document.getElementById('sendMessage');
var welcomeElement = document.getElementById('status');
var textElement = document.getElementById('newMessageText');
var chatElement = document.getElementById('chat');
var usersElement = document.getElementById('users');

function addUser(u) {
  var userName = document.createElement('li');
  userName.innerHTML = u.html;
  userName.dataset.userId = u.id;
  usersElement.appendChild(userName);
}

socket.on('connect', function(u){
  console.log('connected to server');
});

socket.on('setUser', function(data){
  user = data.user;
  data.users.forEach(function(u){ addUser(u); });
  welcomeElement.innerHTML = 'Welcome to the chat app ' + user.html;
  textElement.focus();
});

socket.on('userJoin', function(data){
  addUser(data.user);
});

socket.on('userPart', function(data){
  usersElement.removeChild(usersElement.querySelector('li[data-user-id="'+data.user.id+'"]'));
});

socket.on('disconnect', function(){
  chatElement.innerHTML = '';
  usersElement.innerHTML = '';
  console.log('disconnected from server');
});

socket.on('newMessage', function(data){
  // var template = $('#message-template').html();
  // var html = Mustache.render(template, {
  //   text:data.text,
  //   from: data.from,
  //   createdAt: data.createdAt
  // });
  // $('#chat').append(html);

  var newMessage = document.createElement('div');
  newMessage.innerHTML =
    data.from + ' : ' + 
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
  
  if (text.trim().length === 0) {
    textElement.value = '';
    textElement.focus();
    return;
  }

  socket.emit('createMessage', { text }, function(ok){ textElement.value = ''; });
});

//
// [ Send Location ]
//
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

