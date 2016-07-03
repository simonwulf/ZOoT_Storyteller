// storyteller.js

'use strict';

var msgTableInput = document.getElementById('message-table-input');
var msgDataInput = document.getElementById('message-data-input');
var msgList = document.querySelector('.message-list');
var loadBtn = document.querySelector('.load-btn');

var msgTableData = null;
var msgData = null;

var msgTable;

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

function updateMsgList() {
  if (msgTableData == null || msgData == null)
    return;

  // Let's first find the english messages
  var index = 0;
  while (msgTableData[index + 4] != 0x07) index += 0x08;

  console.log('English entries at 0x' + index.toString(16));

  // Next, we'll store all the entries in an array
  msgTable = [];
  var msgTableEntry;
  do {
    msgTableEntry = readMsgTableEntry(index);
    msgTable.push(msgTableEntry);
    index += 0x08;
  } while (index < msgTableData.length && msgTableEntry.id != 0xfffd);

  while (msgList.firstChild) {
    msgList.removeChild(msgList.firstChild);
  }

  // Now, going through each table entry, we can use the offsets to fetch the actual messages from the message data
  // (The last one (id 0xfffd) just holds the end offset of the last actual message, so we don't read that one)
  var reader = new MessageReader(msgData);
  for (var i = 0; i < msgTable.length - 1; i++) {
  //for (var i = 0; i < 50; i++) {
    var length = msgTable[i + 1].offset - msgTable[i].offset;
    msgTable[i].message = reader.readMessage(msgTable[i].offset, length);

    var li = document.createElement('li');
    li.classList.add('message-list-item');
    li.dataset.msgIndex = i;
    li.addEventListener('click', function (e) {
      editMessage(msgTable[e.target.dataset.msgIndex]);
    });
    li.innerText = '0x' + hexString(msgTable[i].id, 4);

    msgList.appendChild(li);
  }
}