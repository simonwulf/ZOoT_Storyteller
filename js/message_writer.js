// message_writer.js

'use strict';

function MessageWriter() {

  var parser = new MessageParser(writeChar, writeShortcode);
  var table = null;
  var messages = null;
  var newOffsets = null;

  function writeTable() {
    table = new DynamicBuffer(editor.msgTableData.length + 8);
    for (let i = 0; i < editor.msgTable.length; i++) {
      try {
      writeTableEntry(editor.msgTable[i], newOffsets[i]);
      } catch (e) {
        console.warn('failed on iteration ' + i);
        console.log(editor.msgTable[i]);
        break;
      }
    }
    writeTableEntry({
      id: 0xffff,
      type: 0x00,
      bank: 0x00
    }, 0x000000);
    table.realloc(table.offset);
  }

  function writeMessages() {
    newOffsets = [];
    messages = new DynamicBuffer(editor.msgData.length);
    for (let i = 0; i < editor.msgTable.length - 1; i++) {
      newOffsets[i] = messages.offset;
      parser.parse(editor.msgTable[i].message);
      messages.write(0x02);
      while (messages.offset & 3)
        messages.write(0x00); // Align to 4 byte boundary
    }
    messages.realloc(messages.offset);
  }

  function writeTableEntry(entry, offset) {
    table.write((entry.id & 0xff00) >> 8);
    table.write((entry.id & 0x00ff));
    table.write((entry.type << 4) | (entry.position));
    table.write(0x00);
    table.write((entry.bank));
    table.write((offset & 0xff0000) >> 16);
    table.write((offset & 0x00ff00) >> 8);
    table.write((offset & 0x0000ff))
  }

  function writeChar(char) {

    switch (char) {
      case '\n': char = 0x01; break;
      case 'À': char = 0x80; break;
      case 'Á': char = 0x81; break;
      case 'Â': char = 0x82; break;
      case 'Ä': char = 0x83; break;
      case 'Ç': char = 0x84; break;
      case 'È': char = 0x85; break;
      case 'É': char = 0x86; break;
      case 'Ê': char = 0x87; break;
      case 'Ë': char = 0x88; break;
      case 'Ï': char = 0x89; break;
      case 'Ô': char = 0x8a; break;
      case 'Ö': char = 0x8b; break;
      case 'Ù': char = 0x8c; break;
      case 'Û': char = 0x8d; break;
      case 'Ü': char = 0x8e; break;
      case 'ß': char = 0x8f; break;
      case 'à': char = 0x80; break;
      case 'á': char = 0x91; break;
      case 'â': char = 0x92; break;
      case 'ä': char = 0x93; break;
      case 'ç': char = 0x94; break;
      case 'è': char = 0x95; break;
      case 'é': char = 0x96; break;
      case 'ê': char = 0x97; break;
      case 'ë': char = 0x98; break;
      case 'ï': char = 0x99; break;
      case 'ô': char = 0x9a; break;
      case 'ö': char = 0x9b; break;
      case 'ù': char = 0x9c; break;
      case 'û': char = 0x9d; break;
      case 'ü': char = 0x9e; break;
      default: char = char.charCodeAt(0); break;
    }

    messages.write(char);
  }

  function writeShortcode(command, value) {

    switch (command) {
      case 'break':      messages.write(0x04); break;
      case 'col':        messages.write(0x05); writeColor(value); break;
      case 'spaces':     messages.write(0x06); writeHex(value, 1); break;
      case 'link':       messages.write(0x07); writeHex(value, 2); break;
      case 'shop':       messages.write(0x0a); break;
      case 'waitext':    messages.write(0x0b); break;
      case 'delay':      messages.write(0x0c); writeHex(value, 1); break;
      case 'waitkey':    messages.write(0x0d); break;
      case 'fadewait':   messages.write(0x0e); writeHex(value, 1); break;
      case 'name':       messages.write(0x0f); break;
      case 'instanton':  messages.write(0x08); break;
      case 'instantoff': messages.write(0x09); break;
      case 'ocarina':    messages.write(0x10); break;
      case 'fadewait2':  messages.write(0x11); break;
      case 'sfx':        messages.write(0x12); writeHex(value, 2); break;
      case 'item':       messages.write(0x13); writeHex(value, 1); break;
      case 'ldelay':     messages.write(0x14); writeHex(value, 1); break;
      case 'loadbg':     messages.write(0x15); writeHex(value, 3); break;
      case 'marathon':   messages.write(0x16); break;
      case 'horcerace':  messages.write(0x17); break;
      case 'archery':    messages.write(0x18); break;
      case 'skulltulas': messages.write(0x19); break;
      case 'nobskip':    messages.write(0x1a); break;
      case '2opts':      messages.write(0x1b); break;
      case '3opts':      messages.write(0x1c); break;
      case 'fish':       messages.write(0x1d); break;
      case 'minigame':   messages.write(0x1e); writeHex(value, 1); break;
      case 'time':       messages.write(0x1f); break;
      case 'A':          messages.write(0x9f); break;
      case 'B':          messages.write(0xa0); break;
      case 'C':          messages.write(0xa1); break;
      case 'L':          messages.write(0xa2); break;
      case 'R':          messages.write(0xa3); break;
      case 'Z':          messages.write(0xa4); break;
      case 'Cu':         messages.write(0xa5); break;
      case 'Cd':         messages.write(0xa6); break;
      case 'Cl':         messages.write(0xa7); break;
      case 'Cr':         messages.write(0xa8); break;
      case 'Tri':        messages.write(0xa9); break;
      case 'Stick':      messages.write(0xaa); break;
    }
  }

  function writeColor(color) {
    switch (color) {
      case 'white': color = 0x40; break;
      case 'red': color = 0x41; break;
      case 'green': color = 0x42; break;
      case 'blue': color = 0x43; break;
      case 'light-blue': color = 0x44; break;
      case 'pink': color = 0x45; break;
      case 'yellow': color = 0x46; break;
      case 'black': color = 0x47; break;
    }
    messages.write(color);
  }

  function writeHex(hex, width) {
    var value = Number('0x' + hex);
    switch (width) {
      case 1:
        messages.write(value);
        break;
      case 2:
        messages.write((value & 0xff00) >> 8);
        messages.write((value & 0x00ff));
        break;
      case 3:
        messages.write((value & 0xff0000) >> 16);
        messages.write((value & 0x00ff00) >> 8);
        messages.write((value & 0x0000ff));
        break;
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
    saveAs([table.buffer], 'message_table.bin');
    saveAs([messages.buffer], 'nes_message_data_static.bin');
  }
}
