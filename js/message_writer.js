// message_writer.js

'use strict';

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

function MessageWriter() {

  // TODO: major cleanup

  var tableBuffer = null;
  var messagesBuffer = null;
  var tableOffset = 0;
  var messagesOffset = 0;
  var table = null;
  var messages = null;
  var newOffsets = null;

  function reallocTable(size) {
    tableBuffer = tableBuffer != null ?
      ArrayBuffer.transfer(tableBuffer, size) :
      new ArrayBuffer(size);
    table = new Uint8Array(tableBuffer);
  }

  function reallocMessages(size) {
    messagesBuffer = messagesBuffer != null ?
      ArrayBuffer.transfer(messagesBuffer, size) :
      new ArrayBuffer(size);
    messages = new Uint8Array(messagesBuffer);
  }

  function requireMessageSpace(size) {
    if (size > messages.length - messagesOffset) {
      var newSize = messages.length * 1.2;
      while (newSize < messagesOffset + size) {
        newSize *= 1.2;
      }
      reallocMessages(newSize);
    }
  }

  function requireTableSpace(size) {
    if (size > table.length - tableOffset) {
      var newSize = table.length * 1.2;
      while (newSize < tableOffset + size) {
        newSize *= 1.2;
      }
      reallocTable(newSize);
    }
  }

  function writeTable() {
    reallocTable(editor.msgTableData.length + 8);
    tableOffset = 0;
    for (var i = 0; i < editor.msgTable.length; i++) {
      var entry = editor.msgTable[i];
      requireTableSpace(8);
      table[tableOffset++] = (entry.id & 0xff00) >> 8;
      table[tableOffset++] = (entry.id & 0x00ff);
      table[tableOffset++] = (entry.type << 4) | (entry.position);
      table[tableOffset++] = 0x00; // Because it's initialized to ASCII '0' (0x30)
      table[tableOffset++] = (entry.bank);
      table[tableOffset++] = (newOffsets[i] & 0xff0000) >> 16;
      table[tableOffset++] = (newOffsets[i] & 0x00ff00) >> 8;
      table[tableOffset++] = (newOffsets[i] & 0x0000ff)
    }
    requireTableSpace(8);
    table[tableOffset++] = 0xFF;
    table[tableOffset++] = 0xFF;
    table[tableOffset++] = 0x00;
    table[tableOffset++] = 0x00;
    table[tableOffset++] = 0x00;
    table[tableOffset++] = 0x00;
    table[tableOffset++] = 0x00;
    table[tableOffset++] = 0x00;
    if (tableOffset < table.length)
      reallocTable(tableOffset); // Shrink buffer to actual used size
  }

  function writeMessages() {
    reallocMessages(editor.msgData.length);
    messagesOffset = 0;
    newOffsets = [];
    for (var i = 0; i < editor.msgTable.length - 1; i++) {
      newOffsets[i] = messagesOffset;
      writeNode(editor.msgTable[i].message);
      requireMessageSpace(4);
      messages[messagesOffset++] = 0x02; // End code
      while (messagesOffset & 3)
        messages[messagesOffset++] = 0x00; // Align messages to 4 byte boundary
    }
    if (messagesOffset < messages.length)
      reallocMessages(messagesOffset); // Shrink buffer to actual used size
  }

  function writeNode(node) {
    if (node.nodeType == Node.TEXT_NODE) {
      var text = node.nodeValue;
      requireMessageSpace(text.length);
      for (let i = 0; i < text.length; i++) {
        messages[messagesOffset++] = translateChar(text[i]);
      }
    } else if (node.classList.contains('shortcode') || node.classList.contains('wait-box-break')) {
      writeShortcode(node);
    } else if (typeof node.dataset.color != 'undefined') {
      requireMessageSpace(2);
      messages[messagesOffset++] = 0x05;
      messages[messagesOffset++] = node.dataset.color;
      for (let i = 0; i < node.childNodes.length; i++) {
        writeNode(node.childNodes[i]);
      }
      requireMessageSpace(2);
      messages[messagesOffset++] = 0x05;
      messages[messagesOffset++] = 0x40; // White
    } else if (node.tagName == 'BR') {
      messages[messagesOffset++] = 0x01;
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        writeNode(node.childNodes[i]);
      }
    }
  }

  function writeShortcode(shortcode) {
    var size;
    var command = Number(shortcode.dataset.command);
    var value = shortcode.querySelector('.shortcode-value');
    if (value)
      value = Number('0x' + value.innerText);

    switch (command) {
      case 0x0a: size = 1; break;
      case 0x0b: size = 1; break;
      case 0x0d: size = 1; break;
      case 0x0f: size = 1; break;
      case 0x08: size = 1; break;
      case 0x09: size = 1; break;
      case 0x10: size = 1; break;
      case 0x11: size = 1; break;
      case 0x16: size = 1; break;
      case 0x17: size = 1; break;
      case 0x18: size = 1; break;
      case 0x19: size = 1; break;
      case 0x1a: size = 1; break;
      case 0x1b: size = 1; break;
      case 0x1c: size = 1; break;
      case 0x1d: size = 1; break;
      case 0x1f: size = 1; break;
      case 0x05: size = 2; break;
      case 0x06: size = 2; break;
      case 0x0c: size = 2; break;
      case 0x0e: size = 2; break;
      case 0x13: size = 2; break;
      case 0x14: size = 2; break;
      case 0x1e: size = 2; break;
      case 0x07: size = 3; break;
      case 0x12: size = 3; break;
      case 0x15: size = 4; break;
    }

    requireMessageSpace(size);
    messages[messagesOffset++] = command;
    switch (size) {
      case 2:
        messages[messagesOffset++] = value;
        break;
      case 3:
        messages[messagesOffset++] = (value & 0xff00) >> 8;
        messages[messagesOffset++] = (value & 0x00ff);
        break;
      case 4:
        messages[messagesOffset++] = (value & 0xff0000) >> 16;
        messages[messagesOffset++] = (value & 0x00ff00) >> 8;
        messages[messagesOffset++] = (value & 0x0000ff);
        break;
    }
  }

  function translateChar(char) {
    switch (char) {
      case 'À': return 0x80;
      case 'Á': return 0x81;
      case 'Â': return 0x82;
      case 'Ä': return 0x83;
      case 'Ç': return 0x84;
      case 'È': return 0x85;
      case 'É': return 0x86;
      case 'Ê': return 0x87;
      case 'Ë': return 0x88;
      case 'Ï': return 0x89;
      case 'Ô': return 0x8a;
      case 'Ö': return 0x8b;
      case 'Ù': return 0x8c;
      case 'Û': return 0x8d;
      case 'Ü': return 0x8e;
      case 'ß': return 0x8f;
      case 'à': return 0x80;
      case 'á': return 0x91;
      case 'â': return 0x92;
      case 'ä': return 0x93;
      case 'ç': return 0x94;
      case 'è': return 0x95;
      case 'é': return 0x96;
      case 'ê': return 0x97;
      case 'ë': return 0x98;
      case 'ï': return 0x99;
      case 'ô': return 0x9a;
      case 'ö': return 0x9b;
      case 'ù': return 0x9c;
      case 'û': return 0x9d;
      case 'ü': return 0x9e;
      default: return char.charCodeAt(0);
    }
  }

  function saveAs(data, name) {
    var anchor = document.createElement('a');
    var url = URL.createObjectURL(new Blob(data, { type: 'application/octet-stream' }))
    anchor.href = url;
    anchor.download = name;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  this.writeAndSave = function () {
    writeMessages();
    writeTable();
    saveAs([table], 'message_table.bin');
    saveAs([messages], 'nes_message_data_static.bin');
  }
}
