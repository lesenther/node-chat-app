var moment = require('moment');

var generateMessage = (from, text) => {
  return {
    text, 
    from, 
    createdAt: moment().valueOf()
  };
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from, 
    url: 'https://www.google.com/maps?q=' + latitude + ',' + longitude,
    createdAt: moment().valueOf()
  };
};

var generateUserLink = user => {
  return '<a href="#" target="_blank" style="color:' + user.color + '">' + user.name + '</a>'
};

module.exports = { generateMessage, generateLocationMessage, generateUserLink };