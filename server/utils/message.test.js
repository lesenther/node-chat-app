var expect = require('expect');
var {generateMessage} = require('./message');

describe('generateMessage', _ => {
  it('should generate correct message object', done => {
    var text = 'this is a new message';
    var from = 'oscar';
    var message = generateMessage(from, text);

    expect(typeof message).toBe('object');
    expect(message.text).toBe(text);
    expect(message.from).toBe(from);
    expect(typeof message.createdAt).toBe('number');
    
    done();
  });
});