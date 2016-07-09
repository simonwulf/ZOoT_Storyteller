// toolbar.js

'use strict';

function Toolbar() {

  EventDispatcher.apply(this);

  var msgIdInput = document.getElementById('message-id-input');
  var msgTypeSelect = document.getElementById('message-type-select');
  var msgPositionSelect = document.getElementById('message-position-select');
  // var colorButtons = document.querySelectorAll('.color-tool button');

  msgIdInput.addEventListener('change', (e) => {
    this.dispatchEvent('id');
  });

  msgTypeSelect.addEventListener('change', (e) => {
    this.dispatchEvent('type', { type: e.target.selectedIndex });
  });

  msgPositionSelect.addEventListener('change', (e) => {
    this.dispatchEvent('position');
  });

  this.update = function () {
    var message = editor.current;
    if (message == null) {
      msgTypeSelect.setAttribute('disabled', '');
      msgPositionSelect.setAttribute('disabled', '');
      // for (let i = 0; i < colorButtons.length; i++) {
      //   colorButtons[i].setAttribute('disabled', '');
      // }
    } else {
      msgTypeSelect.removeAttribute('disabled');
      msgPositionSelect.removeAttribute('disabled');
      // for (let i = 0; i < colorButtons.length; i++) {
      //   colorButtons[i].removeAttribute('disabled');
      // }
    }

    msgIdInput.value = hexString(message.id, 4);
    msgTypeSelect.selectedIndex = message.type;
    msgPositionSelect.selectedIndex = message.position;
  }
}

Toolbar.prototype = Object.create(EventDispatcher.prototype);
