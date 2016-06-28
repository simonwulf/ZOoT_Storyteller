// storyteller.js

'use strict';

var msgTableInput = document.getElementById('message-table-input');
var msgDataInput = document.getElementById('message-data-input');
var msgList = document.getElementById('message-list');

var msgTableData = null;
var msgData = null;

var msgTable;

function handleReadError(error) {
  console.error('An error occured while reading: ' + error)
}

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

function readMsgTableEntry(index) {
  return {
          id: msgTableData[index + 0] << 8 |
              msgTableData[index + 1],
        type: msgTableData[index + 2] >> 4,
    position: msgTableData[index + 2] & 0x0f,
        bank: msgTableData[index + 4],
      offset: msgTableData[index + 5] << 16 |
              msgTableData[index + 6] << 8 |
              msgTableData[index + 7]
  };
}

function readMsg(offset) {

  var output = document.createElement('li');

  var msg = '';
  while (msgData[offset] != 0x00) {
    msg += String.fromCharCode(msgData[offset++]);
  }
  
  output.innerHTML = msg;
  msgList.appendChild(output);
}

function updateMsgList() {
  if (msgTableData == null || msgData == null)
    return;

  // Let's first find the english messages
  var index = 0;
  while (msgTableData[index + 4] != 0x07) index += 0x10;

  console.log('English entries at 0x' + index.toString(16));

  // Next, we'll store all the entries in an array
  msgTable = [];
  var msgTableEntry;
  do {
    msgTableEntry = readMsgTableEntry(index);
    msgTable.push(msgTableEntry);
    index += 0x10;
  } while (index < msgTableData.length && msgTableEntry.offset != 0xffff);

  // Now, going through each table entry, we can use the offsets to fetch the actual messages from the message data
  // (We don't really need to look at the last one w/ "offset" 0xffff though)
  // for (var i = 0; i < msgTable.length - 1; i++) {
  for (var i = 0; i < 1; i++) {
    readMsg(msgTable[i].offset);
  }
}