// message_preview.js

function MessagePreviewBuilder() {

  var currentColor = 'white';
  var preview;
  var currentBox;
  var boxes;

  this.renderPreview = function (message) {

    const STATE_PLAIN = 0;
    const STATE_SC_NAME = 1;
    const STATE_SC_VALUE = 2;

    var index = 0;
    var state = STATE_PLAIN;
    var sc_name;
    var sc_value;

    preview = '';
    currentBox = beginBox();
    boxes = [];

    while (index < message.length) {
      var char = message[index];
      switch (state) {
        case STATE_PLAIN:
          if (char == '[') {
            sc_name = '';
            state = STATE_SC_NAME;
          } else {
            preview += char;
          }
          break;
        case STATE_SC_NAME:
          if (char == ']') {
            preview += renderShortcode(sc_name);
            state = STATE_PLAIN;
          } else if (char == ':') {
            sc_value = '';
            state = STATE_SC_VALUE;
          } else {
            sc_name += char;
          }
          break;
        case STATE_SC_VALUE:
          if (char == ']') {
            preview += renderShortcode(sc_name, sc_value);
            state = STATE_PLAIN;
          } else {
            sc_value += char;
          }
          break;
      }
      index++;
    }

    endBox();

    return boxes;
  }

  function beginBox() {
    var box = document.createElement('div');
    var vfix = document.createElement('div');
    box.classList.add('message-preview-box');
    vfix.classList.add('message-valign-fix');
    box.appendChild(vfix);
    console.log(currentColor);
    console.log(preview);
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

  function renderShortcode(name, value) {

    switch (name) {
      case 'break': endBox(); currentBox = beginBox(); break;
      case 'delay': endBox(); currentBox = beginBox(); break;
      case 'col': return renderColor(value);
      case 'spaces': return renderSpaces(Number('0x'+value));
      case 'name': return 'Link';
      case 'A': return '<span class="icon-A"></span>';
      case 'B': return '<span class="icon-B"></span>';
      case 'C': return '<span class="icon-C"></span>';
      case 'L': return '<span class="icon-L"></span>';
      case 'R': return '<span class="icon-R"></span>';
      case 'Z': return '<span class="icon-Z"></span>';
      case 'Cu': return '<span class="icon-Up"></span>';
      case 'Cd': return '<span class="icon-Down"></span>';
      case 'Cl': return '<span class="icon-Left"></span>';
      case 'Cr': return '<span class="icon-Right"></span>';
      case 'Tri': return '<span class="icon-Triangle"></span>';
      case 'Stick': return '<span class="icon-Stick"></span>';
      default: return '';
    }
  }
}
