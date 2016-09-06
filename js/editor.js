// editor.js

'use strict';

function Editor() {

  var msgText = document.querySelector('.editor .message');
  var msgPreview = document.querySelector('.editor .message-preview');
  var msgHTML = document.querySelector('.message-html');

  var toolbar = new Toolbar();
  var previewBuilder = new MessagePreviewBuilder();
  var currentIndex = -1;

  this.current = null;

  document.body.addEventListener('keydown', function (e) {
    if (currentIndex != -1) {
      var modifiers = (e.ctrlKey || e.metaKey) && e.altKey;
      if (e.code == 'ArrowDown' && modifiers && currentIndex < msgTable.length - 2) {
        e.preventDefault();
        editor.editMessage(currentIndex + 1);
      } else if (e.code == 'ArrowUp' && modifiers && currentIndex > 0) {
        e.preventDefault();
        editor.editMessage(currentIndex - 1);
      }
    }
  });

  toolbar.addEventListener('id', function (e) {
    // TODO: find message with id and edit
  });

  toolbar.addEventListener('type', function (e) {
    setType(e.type);
  });

  toolbar.addEventListener('position', function (e) {

  });

  msgText.addEventListener('input', (e) => {
    var message = e.target.value;
    var previewBoxes = previewBuilder.renderPreview(message);
    while (msgPreview.firstChild) {
      msgPreview.removeChild(msgPreview.firstChild);
    }
    for (let i = 0; i < previewBoxes.length; i++) {
      msgPreview.appendChild(previewBoxes[i]);
    }
    this.current.message = message;
    msgTableView.rebuildSnippet(this.current);
  });

  var setType = (type) => {
    this.current.type = type;
    msgPreview.classList.remove('black-box');
    msgPreview.classList.remove('wood-box');
    msgPreview.classList.remove('blue-box');
    msgPreview.classList.remove('ocarina-box');
    msgPreview.classList.remove('no-box');
    msgPreview.classList.remove('black-text');
    switch (type) {
      case 0x00: msgPreview.classList.add('black-box'); break;
      case 0x01: msgPreview.classList.add('wood-box'); break;
      case 0x02: msgPreview.classList.add('blue-box'); break;
      case 0x03: msgPreview.classList.add('ocarina-box'); break;
      case 0x04: msgPreview.classList.add('no-box'); break;
      case 0x05: msgPreview.classList.add('no-box', 'black-text'); break;
    }
  }

  this.editMessage = function (entryIndex) {
    var previous = this.current;
    this.current = msgTable.getEntry(entryIndex);
    currentIndex = entryIndex;

    msgText.value = this.current.message;
    var previewBoxes = previewBuilder.renderPreview(this.current.message);
    while (msgPreview.firstChild) {
      msgPreview.removeChild(msgPreview.firstChild);
    }
    for (let i = 0; i < previewBoxes.length; i++) {
      msgPreview.appendChild(previewBoxes[i]);
    }
    setType(this.current.type);

    if (previous)
      previous.listItem.classList.remove('selected');
    this.current.listItem.classList.add('selected');

    msgTableView.showMsgTableItem(this.current.listItem);
    toolbar.update();
  }

  this.load = function (tableFile, messagesFile) {
    var loadingCount = 2;
    var tableData = null;
    var messagesData = null;

    function readError(error) {
      console.error('An error occured while reading: ' + error);
    }

    function onSuccess() {
      if (--loadingCount == 0) {
        msgTable.load(tableData, messagesData);
        editor.editMessage(0);
      }
    }

    readData(tableFile).then(function (result) {
      tableData = result;
      onSuccess();
    }, readError);
    readData(messagesFile).then(function (result) {
      messagesData = result;
      onSuccess();
    }, readError);
  }
}
