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
  // (We don't really need to look at the last one w/ "offset" 0xffff though)
  for (var i = 0; i < msgTable.length - 1; i++) {
  //for (var i = 0; i < 5; i++) {
    var length = msgTable[i + 1].offset - msgTable[i].offset;
    msgTable[i].message = msg2html(msgTable[i].offset, length);
    msgList.appendChild(msgTable[i].message);
  }
}

function msg2html(offset, length) {

  var end = offset + length;
  var element = document.createElement('li');
  var text = '';

  element.classList.add('message');

  while (offset < end) {

    var standardChar = false;
    if (msgData[offset] >= 0x7f && msgData[offset] <= 0xab) {
      text += renderSpecial(msgData[offset]);
    } else {
      switch (msgData[offset]) {
        case 0x00:
        case 0x03:
          break;
        case 0x01:
          text += '<br>'; break;
        case 0x02:
        case 0x0a:
        case 0x0b:
        case 0x10:
        case 0x16:
        case 0x17:
        case 0x18:
        case 0x19:
        case 0x1a:
        case 0x1b:
        case 0x1c:
        case 0x1d:
        case 0x1f:
          text += renderMarker(msgData[offset]); break;
        case 0x04:
        case 0x0d:
          text += renderWait(msgData[offset]); break;
        case 0x05: text += renderColor(msgData[++offset]); break;
        case 0x06: text += renderSpaceStrip(msgData[++offset]); break;
        case 0x07: text += renderMsgLink(msgData[++offset] << 8 | msgData[++offset]); break;
        case 0x08: text += renderInstant(true); break;
        case 0x09: text += renderInstant(false); break;
        case 0x0c: text += renderDelay(msgData[++offset]); break;
        case 0x0e: text += renderFadeAndWait(0x0e, msgData[++offset]); break;
        case 0x0f: text += renderPlayerName(); break;
        case 0x11: text += renderFadeAndWait(0x11); break;
        case 0x12: text += renderAudioCue(msgData[++offset] << 8 | msgData[++offset]); break;
        case 0x13: text += renderItemIcon(msgData[++offset]); break;
        case 0x14: text += renderLetterDelay(msgData[++offset]); break;
        case 0x15: text += renderBGLoader(msgData[++offset], msgData[++offset], msgData[++offset]); break;
        case 0x1e: text += renderResult(msgData[++offset]); break;
        default:
          standardChar = true;
      }
    }

    if (standardChar)
      text += String.fromCharCode(msgData[offset]);

    offset++;
  }

  element.innerHTML = text;
  return element;
}

function renderSpan(classes, content) {
  content = content || '';
  return '<span class="' + classes + '">' + content + '</span>';
}

function renderWait(command) {
  switch (command) {
    case 0x04: return renderSpan('wait-keypress-break');
    case 0x0d: return renderSpan('wait-keypress-continue', ' ');
  }
}

function renderMarker(marker) {
  switch (marker) {
    case 0x02: return renderSpan('marker end');
    case 0x0a: return renderSpan('marker shop-keep-open');
    case 0x0b: return renderSpan('marker wait-external');
    case 0x10: return renderSpan('marker ocarina');
    case 0x16: return renderSpan('marker byte-result-marathon');
    case 0x17: return renderSpan('marker byte-result-horse-race');
    case 0x18: return renderSpan('marker byte-result-horseback-archery');
    case 0x19: return renderSpan('marker byte-result-skulltula-count');
    case 0x1a: return renderSpan('marker prevent-b-skip');
    case 0x1b: return renderSpan('marker option-two');
    case 0x1c: return renderSpan('marker option-three');
    case 0x1d: return renderSpan('marker byte-result-fish');
    case 0x1f: return renderSpan('marker current-time');
  }
}

function renderColor(color) {
  switch (color) {
    case 0x40: return renderSpan('color white');
    case 0x41: return renderSpan('color red');
    case 0x42: return renderSpan('color green');
    case 0x43: return renderSpan('color blue');
    case 0x44: return renderSpan('color light-blue');
    case 0x45: return renderSpan('color pink');
    case 0x46: return renderSpan('color yellow');
    case 0x47: return renderSpan('color black');
  }
}

function renderSpaceStrip(amount) {
  var spaces = '';
  for (var i = 0; i < amount; i++) {
    spaces += '-';
  }
  return renderSpan('space-strip', spaces);
}

function renderMsgLink(msgId) {
  return '<a href="#">' + msgId.toString(16) + '</span>';
}

function renderInstant(instant) {
  return renderSpan(instant ? 'instant-on' : 'instant-off');
}

function renderDelay(delay) {
  return '';
}

function renderFadeAndWait(command, delay) {
  return '';
}

function renderPlayerName() {
  return renderSpan('player-name', '[Link]');
}

function renderAudioCue(effect) {
  return renderSpan('audio-cue');
}

function renderItemIcon(item) {
  return renderSpan('item-icon');
}

function renderLetterDelay(delay) {
  return renderSpan('delay');
}

function renderBGLoader(background) {
  return renderSpan('bg-loader');
}

function renderResult(minigame) {
  return renderSpan('minigame-result');
}

function renderSpecial(char) {
  switch (char) {
    case 0x9f: return renderSpan('button-icon a-button');
    case 0xa0: return renderSpan('button-icon b-button');
    case 0xa1: return renderSpan('button-icon c-button');
    case 0xa2: return renderSpan('button-icon l-button');
    case 0xa3: return renderSpan('button-icon r-button');
    case 0xa4: return renderSpan('button-icon z-button');
    case 0xa5: return renderSpan('button-icon up-button');
    case 0xa6: return renderSpan('button-icon down-button');
    case 0xa7: return renderSpan('button-icon left-button');
    case 0xa8: return renderSpan('button-icon right-button');
    case 0xa9: return renderSpan('button-icon down-arrow');
    case 0xaa: return renderSpan('button-icon control-stick');
    case 0xab: return renderSpan('button-icon d-pad');
    default: return renderSpan('special-char', '?');
  }
}