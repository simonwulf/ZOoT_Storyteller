// editor.js

'use strict';

function Editor() {

  var msgContainer = document.querySelector('.editor .message-container');
  var msgIdInput = document.getElementById('message-id-input');
  var msgTypeSelect = document.getElementById('message-type-select');
  var msgPositionSelect = document.getElementById('message-position-select');
  var msgTableList = document.querySelector('.message-list');

  var msgTableData = null;
  var msgData = null;
  
  var msgTable = null;
  var currentIndex = -1;

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

    while (msgTableList.firstChild) {
      msgTableList.removeChild(msgTableList.firstChild);
    }

    // Now, going through each table entry, we can use the offsets to fetch the actual messages from the message data
    // (The last one (id 0xfffd) just holds the end offset of the last actual message, so we don't read that one)
    var reader = new MessageReader(msgData);
    for (var i = 0; i < msgTable.length - 1; i++) {
    // for (var i = 0; i < 10; i++) {
      var length = msgTable[i + 1].offset - msgTable[i].offset;
      var message = reader.readMessage(msgTable[i].offset, length);

      var li = document.createElement('li');
      li.classList.add('message-list-item');
      li.dataset.msgIndex = i;
      li.addEventListener('click', function (e) {
        editMessage(Number(e.target.dataset.msgIndex));
      });
      li.innerText = '0x' + hexString(msgTable[i].id, 4) + ' - ' + message.snippet;

      msgTable[i].message = message.full;
      msgTable[i].listItem = li;

      msgTableList.appendChild(li);
    }

    editMessage(0);
  }

  function editMessage(msgTableIndex) {
    var msgTableEntry = msgTable[msgTableIndex];
    currentIndex = msgTableIndex;

    if (msgContainer.firstChild)
      msgContainer.removeChild(msgContainer.firstChild);
    msgContainer.appendChild(msgTableEntry.message);
    msgTableEntry.message.focus();

    msgIdInput.value = hexString(msgTableEntry.id, 4);
    msgTypeSelect.selectedIndex = msgTableEntry.type;
    msgPositionSelect.selectedIndex = msgTableEntry.position;

    var selected = document.querySelector('.message-list-item.selected');
    if (selected)
      selected.classList.remove('selected');
    msgTableEntry.listItem.classList.add('selected');

    showMsgTableItem(msgTableEntry.listItem);
  }

  function showMsgTableItem(listItem) {
    var offsetTop = (listItem.offsetTop - msgTableList.scrollTop) - msgTableList.offsetTop;
    var offsetBottom = offsetTop + listItem.offsetHeight - msgTableList.offsetHeight;
    if (offsetTop < 0)
      msgTableList.scrollTop += offsetTop;
    else if (offsetBottom > 0)
      msgTableList.scrollTop += offsetBottom;
  }

  document.body.addEventListener('keydown', function (e) {
    if (currentIndex != -1) {
      if (e.code == 'ArrowDown' && (e.ctrlKey || e.metaKey) && currentIndex < msgTable.length - 2) {
        e.preventDefault();
        editMessage(currentIndex + 1);
      } else if (e.code == 'ArrowUp' && (e.ctrlKey || e.metaKey) && currentIndex > 0) {
        e.preventDefault();
        editMessage(currentIndex - 1);
      }
    }
  });

  this.load = function (tableFile, messagesFile) {
    var loadingCount = 2;
    function readError(error) {
      console.error('An error occured while reading: ' + error);
    }
    readData(tableFile).then(function (result) {
      msgTableData = result;
      if (--loadingCount == 0) updateMsgList();
    }, readError);
    readData(messagesFile).then(function (result) {
      msgData = result;
      if (--loadingCount == 0) updateMsgList();
    }, readError);
  }
}