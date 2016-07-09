// utils.js

'use strict';

function hexString(num, padding) {
  padding = padding || 0;
  var string = num.toString(16);
  while (string.length < padding) {
    string = '0' + string;
  }
  return string;
}

function readData(file) {
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.addEventListener('loadend', function () {
      if (reader.readyState == FileReader.DONE) {
        resolve(new Uint8Array(reader.result));
      } else {
        reject(reader.error);
      }
    });
    reader.readAsArrayBuffer(file);
  });
}

function EventDispatcher() {
  this._listeners = {};
}

EventDispatcher.prototype = {
  addEventListener: function (event, callback) {
    if (!Array.isArray(this._listeners[event])) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(callback);
  },
  dispatchEvent: function (event, data) {
    if (!Array.isArray(this._listeners[event]))
      return;
    for (let i = 0; i < this._listeners[event].length; i++) {
      this._listeners[event][i].call(this, data);
    }
  }
};
