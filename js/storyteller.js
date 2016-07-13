// storyteller.js

'use strict';

var editor = new Editor();

(function () {

  var msgTableInput = document.getElementById('message-table-input');
  var msgDataInput = document.getElementById('message-data-input');
  var loadBtn = document.querySelector('.load-btn');
  var saveBtn = document.querySelector('.save-btn');

  var files = [null, null];
  var fileCount;

  loadBtn.addEventListener('click', function (e) {
    fileCount = 0;
    msgTableInput.click();
    msgDataInput.click();
  });

  saveBtn.addEventListener('click', function (e) {
    var writer = new MessageWriter();
    writer.writeAndSave();
  });

  msgTableInput.addEventListener('change', handleFileInput);
  msgDataInput.addEventListener('change', handleFileInput);

  function handleFileInput(e) {
    files[fileCount++] = e.target.files[0];
    if (fileCount == 2) {
      editor.load(
        files[0],
        files[1]
      );
    }
    e.target.value = ''; // Ensure that 'change' can be triggered next time, also prevents the event from firing on cancel
  }

})();
