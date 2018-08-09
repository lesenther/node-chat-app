var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    text, 
    from, 
    createdAt: new Date().getTime()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from, 
    url: 'https://www.google.com/maps?q=' + latitude + ',' + longitude,
    createdAt: new Date().getTime()
  };
};

var generateUserLink = user => {
  return '<a href="#" style="color:' + user.color + '">' + user.name + '</a>'
};

module.exports = { generateMessage, generateLocationMessage, generateUserLink };