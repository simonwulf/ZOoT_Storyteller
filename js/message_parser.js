// message_parser.js

'use strict';

function MessageParser(plainCallback, commandCallback) {

  const STATE_PLAIN = 0;
  const STATE_SC_NAME = 1;
  const STATE_SC_VALUE = 2;

  var state = STATE_PLAIN;
  var sc_name;
  var sc_value;
  var keep_going;

  this.stop = function () {
    keep_going = false;
  }

  this.parse = function (message) {
    var caret = 0;
    keep_going = true;
    while (keep_going && caret < message.length) {
      var char = message[caret];
      switch (state) {
        case STATE_PLAIN:
          if (char == '[') {
            sc_name = '';
            state = STATE_SC_NAME;
          } else {
            plainCallback(char);
          }
          break;
        case STATE_SC_NAME:
          if (char == ']') {
            commandCallback(sc_name);
            state = STATE_PLAIN;
          } else if (char == ':') {
            sc_value = '';
            state = STATE_SC_VALUE;
          } else {
            sc_name += char;
          }
          break;
        case STATE_SC_VALUE:
          if (char == ']') {
            commandCallback(sc_name, sc_value);
            state = STATE_PLAIN;
          } else {
            sc_value += char;
          }
          break;
      }
      caret++;
    }
  }
}
