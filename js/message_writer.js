// message_writer.js

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

  function writeMsgTableEntry(entry) {
    if (tableOffset >= table.length)
        reallocTable(Math.ceil(table.length * 1.2));
    table[tableOffset++] = (entry.id & 0xff00) >> 8;
    table[tableOffset++] = (entry.id & 0x00ff);
    table[tableOffset++] = (entry.type << 4) | (entry.position);
    tableOffset++;
    table[tableOffset++] = (entry.bank);
    table[tableOffset++] = (newOffsets[i] & 0xff0000) >> 16;
    table[tableOffset++] = (newOffsets[i] & 0x00ff00) >> 8;
    table[tableOffset++] = (newOffsets[i] & 0x0000ff)
  }

  function writeTable() {
    tableOffset = 0;
    for (var i = 0; i < msgTable.length; i++) {
      writeMsgTableEntry(msgTable[i]);
    }
  }

  function writeMessages() {
    messagesOffset = 0;
    newOffsets = [];
    for (var i = 0; i < msgTable.length; i++) {
      newOffsets[0] = messagesOffset;
      writeMessage(msgTable[i].message);
    }
  }

  function writeMessage

  function saveAs(data, name) {
    var anchor = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(data, { type: 'application/octet-stream' }));
    a.download = name;
    a.click();
  }

  // var messageParser = {
  //   offset: 0,
  //   parseAndWrite: function (message) {
  //     this.offset = 0;
  //     // if (messagesOffset >= messages.length)
  //     //     reallocMessages(Mathf.ceil(messages.length * 1.2));
  //     var html = message.innerHTML;
  //     while (offset < html.length) {
  //       // TODO: It's actually easier if shortcodes are wrapped in spans
  //     }
  //   }
  // }
}