// message_table.js

'use strict';

function MessageTable() {

  var entries = null;

  Object.defineProperty(this, 'length', {
    get: function () { return entries.length; }
  });

  this.getEntry = function (index) {
    return entries[index];
  }

  this.load = function (tableData, msgData) {
    if (tableData == null || msgData == null)
      return;

    function readMsgTableEntry(index) {
      return {
              id: tableData[index + 0] << 8 |
                  tableData[index + 1],
            type: tableData[index + 2] >> 4,
        position: tableData[index + 2] & 0x0f,
            bank: tableData[index + 4],
          offset: tableData[index + 5] << 16 |
                  tableData[index + 6] << 8 |
                  tableData[index + 7]
      };
    }

    // Let's first find the english messages
    var index = 0;
    while (tableData[index + 4] != 0x07) index += 0x08;

    console.log('English entries at 0x' + index.toString(16));

    // Next, we'll store all the entries in an array
    entries = [];
    do {
      var msgTableEntry = readMsgTableEntry(index);
      entries.push(msgTableEntry);
      index += 0x08;
    } while (index < tableData.length && msgTableEntry.id != 0xfffd);

    msgTableView.empty();

    // Now, going through each table entry, we can use the offsets to fetch the actual messages from the message data
    // (The last one (id 0xfffd) just holds the end offset of the last actual message, so we don't read that one)
    var reader = new MessageReader(msgData);
    for (let i = 0; i < entries.length - 1; i++) {
    // for (let i = 0; i < 10; i++) {
      let entry = entries[i];
      let length = entries[i + 1].offset - entry.offset;
      let message = reader.readMessage(entry.offset, length);

      entry.message = message.full;

      let li = msgTableView.addEntry(entry);
      li.dataset.msgIndex = i;
      li.addEventListener('click', function (e) {
        editor.editMessage(Number(e.target.dataset.msgIndex));
      });
    }
  }
}
