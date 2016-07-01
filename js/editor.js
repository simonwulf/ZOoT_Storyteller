// editor.js

var editor = document.getElementById('editor');

function editMessage(msgTableEntry) {
  if (editor.firstChild)
    editor.removeChild(editor.firstChild);
  editor.appendChild(msgTableEntry.message)
}