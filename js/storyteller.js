// storyteller.js

'use strict';

var msgTableInput = document.getElementById('message-table-input');
var msgDataInput = document.getElementById('message-data-input');
var msgList = document.querySelector('.message-list');
var loadBtn = document.querySelector('.load-btn');

function handleReadError(error) {
  console.error('An error occured while reading: ' + error)
}

loadBtn.addEventListener('click', function (e) {
  msgTableInput.click();
  msgDataInput.click();
});

msgTableInput.addEventListener('change', function (e) {
  if (e.target.files.length == 0) return;
  readData(e.target.files[0]).then(function (result) {
    msgTableData = result;
    updateMsgList();
  }, handleReadError);
});

msgDataInput.addEventListener('change', function (e) {
  if (e.target.files.length == 0) return;
  readData(e.target.files[0]).then(function (result) {
    msgData = result;
    updateMsgList();
  }, handleReadError);
});

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