// message_preview.js

'use strict';

function MessagePreviewBuilder() {

  var currentColor = 'white';
  var preview;
  var currentBox;
  var boxes;
  var parser = new MessageParser(
    function (char) {
      preview += char;
    },
    renderShortcode
  );

  this.renderPreview = function (message) {

    preview = '';
    currentBox = beginBox();
    boxes = [];

    parser.parse(message);

    endBox();

    return boxes;
  }

  function beginBox() {
    var box = document.createElement('div');
    var vfix = document.createElement('div');
    box.classList.add('message-preview-box');
    vfix.classList.add('message-valign-fix');
    box.appendChild(vfix);
    if (currentColor != 'white')
      preview += '<span class="color-' + currentColor + '">';
    return box;
  }

  function endBox() {
    if (currentBox == null)
      return;
    if (currentColor != 'white')
      preview += '</span>';
    currentBox.firstChild.innerHTML = preview;
    preview = '';
    boxes.push(currentBox);
    currentBox = null;
  }

  function renderColor(color) {
    var result = '';
    if (currentColor != color)
      result += '</span>';
    if (color != 'white')
      result += '<span class="color-' + color + '">';
    currentColor = color;
    return result;
  }

  function renderSpaces(count) {
    return '<span class="space-strip" style="width:' + (count*2) + 'px;"></span>';
  }

  function renderShortcode(command, value) {

    switch (command) {
      case 'break':
      case 'delay': endBox(); currentBox = beginBox(); break;
      case 'col': preview += renderColor(value); break;
      case 'spaces': preview += renderSpaces(Number('0x'+value)); break;
      case 'name': preview += 'Link'; break;
      case 'A': preview += '<span class="icon-A"></span>'; break;
      case 'B': preview += '<span class="icon-B"></span>'; break;
      case 'C': preview += '<span class="icon-C"></span>'; break;
      case 'L': preview += '<span class="icon-L"></span>'; break;
      case 'R': preview += '<span class="icon-R"></span>'; break;
      case 'Z': preview += '<span class="icon-Z"></span>'; break;
      case 'Cu': preview += '<span class="icon-Up"></span>'; break;
      case 'Cd': preview += '<span class="icon-Down"></span>'; break;
      case 'Cl': preview += '<span class="icon-Left"></span>'; break;
      case 'Cr': preview += '<span class="icon-Right"></span>'; break;
      case 'Tri': preview += '<span class="icon-Triangle"></span>'; break;
      case 'Stick': preview += '<span class="icon-Stick"></span>'; break;
    }
  }
}
