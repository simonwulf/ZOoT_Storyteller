// editor.js

var msgContainer = document.querySelector('.editor .message-container');
var msgIdInput = document.getElementById('message-id-input');
var msgTypeSelect = document.getElementById('message-type-select');
var msgPositionSelect = document.getElementById('message-position-select');

function editMessage(msgTableEntry) {
  if (msgContainer.firstChild)
    msgContainer.removeChild(msgContainer.firstChild);
  msgContainer.appendChild(msgTableEntry.message)

  msgIdInput.value = hexString(msgTableEntry.id, 4);
  msgTypeSelect.selectedIndex = msgTableEntry.type;
  msgPositionSelect.selectedIndex = msgTableEntry.position;
}