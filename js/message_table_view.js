// message_table_view.js

'use strict';

function MessageTableView() {
  var msgTableList = document.querySelector('.message-list');
  var snippet;

  var snippetParser = new MessageParser(
    renderSnippetChar,
    renderSnippetCommand
  );

  function renderSnippetChar(char) {
    if (char == '\n') char = ' ';
    if (char == ' ' && snippet[snippet.length - 1] == ' ')
      return;
    snippet += char;
    if (snippet.length > 25)
      endLongSnippet();
  }

  function renderSnippetCommand(command, value) {
    switch (command) {
      case 'name': snippet += 'Link'; break;
      case 'break':
      case 'delay':
        renderSnippetChar(' ');
        break;
      case 'A': snippet += 'A'; break;
      case 'B': snippet += 'B'; break;
      case 'C': snippet += 'C'; break;
      case 'L': snippet += 'L'; break;
      case 'R': snippet += 'R'; break;
      case 'Z': snippet += 'Z'; break;
      case 'Cu': snippet += '▲'; break;
      case 'Cd': snippet += '▼'; break;
      case 'Cl': snippet += '◀'; break;
      case 'Cr': snippet += '▶'; break;
      case 'Tri': snippet += '▼'; break;
      case 'Stick': snippet += '⫪'; break;
    }
    if (snippet.length > 25)
      endLongSnippet();
  }

  function renderSnippet(message) {
    snippet = '';
    snippetParser.parse(message);
    return snippet;
  }

  function endLongSnippet() {
    snippetParser.stop();
    snippet = snippet.substr(0, 22) + '...';
  }

  this.rebuildSnippet = function (entry) {
    entry.listItem.innerText =
      '0x' + hexString(entry.id, 4) + ' - ' + renderSnippet(entry.message);
  }

  this.showMsgTableItem = function (listItem) {
    var offsetTop = (listItem.offsetTop - msgTableList.scrollTop) - msgTableList.offsetTop;
    var offsetBottom = offsetTop + listItem.offsetHeight - msgTableList.offsetHeight;
    if (offsetTop < 0)
      msgTableList.scrollTop += offsetTop;
    else if (offsetBottom > 0)
      msgTableList.scrollTop += offsetBottom;
  }

  this.empty = function () {
    while (msgTableList.firstChild) {
      msgTableList.removeChild(msgTableList.firstChild);
    }
  }

  this.addEntry = function (entry) {
    var li = document.createElement('li');
    li.classList.add('message-list-item');
    entry.listItem = li;
    this.rebuildSnippet(entry);

    msgTableList.appendChild(li);

    return li;
  }
}
