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