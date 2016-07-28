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

// ArrayBuffer.transfer polyfill
if (typeof ArrayBuffer.transfer == 'undefined') {
  ArrayBuffer.transfer = function (oldBuffer, newByteLength) {
    if (arguments.length == 1)
      newByteLength = oldBuffer.byteLength;
    var newBuffer = new ArrayBuffer(newByteLength);
    var obView = new Uint8Array(oldBuffer);
    var nbView = new Uint8Array(newBuffer);
    for (var i = 0; i < obView.length; i++) {
      nbView[i] = obView[i];
    }
    return newBuffer;
  }
}

function DynamicBuffer(reserve) {

  var buffer = null;
  var tArray = null;
  this.offset = 0;

  Object.defineProperty(this, 'buffer', { get: function () { return buffer; }});

  this.realloc = function(size) {
    buffer = buffer != null ?
      ArrayBuffer.transfer(buffer, size) :
      new ArrayBuffer(size);
    tArray = new Uint8Array(buffer);
    this.tArray = tArray;
  }

  this.write = function(byte) {
    if (this.offset == buffer.byteLength)
      this.realloc(Math.ceil(buffer.byteLength * 1.2));
    tArray[this.offset++] = byte;
  }

  this.realloc(reserve);
}