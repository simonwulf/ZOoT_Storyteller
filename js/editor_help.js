// editor_help.js

'use strict';

function initHelp() {

  var helpList = document.querySelector('.editor-help-list');
  var entryId = 0;

  function addHelpEntry(title, description) {
    var entry = document.createElement('li');
    var checkbox = document.createElement('input');
    var label = document.createElement('label');
    var descDiv = document.createElement('div');

    checkbox.setAttribute('type', 'checkbox');
    checkbox.setAttribute('id', 'editor-help-cb-' + entryId);
    label.classList.add('editor-help-label');
    label.setAttribute('for', 'editor-help-cb-' + entryId);
    label.innerText = title;

    descDiv.classList.add('editor-help-description');
    descDiv.innerText = description;

    entry.classList.add('editor-help-entry');
    entry.appendChild(checkbox);
    entry.appendChild(label);
    entry.appendChild(descDiv);

    helpList.appendChild(entry);

    entryId++;
  }

  addHelpEntry('[break]', 'Pause and wait for player keypress before continuing in a new message box');
  addHelpEntry('[shop]', 'Open shop dialogue (?)');
  addHelpEntry('[waitext]', 'Wait for external event (?)');
  addHelpEntry('[waitkey]', 'Pause and wait for player keypress before continuing');
  addHelpEntry('[name]', 'Displays the player\'s name.');
  addHelpEntry('[instanton]', 'Display the following text instantly');
  addHelpEntry('[instantoff]', 'Disable instant text display.');
  addHelpEntry('[ocarina]', 'Initialize Ocarina play.');
  addHelpEntry('[fadewait2]', '???');
  addHelpEntry('[marathon]', 'Show last marathon score.');
  addHelpEntry('[horcerace]', 'Show last horce race score.');
  addHelpEntry('[archery]', 'Show last horseback archery score.');
  addHelpEntry('[skulltulas]', 'Show gold skulltula count.');
  addHelpEntry('[nobskip]', 'Prevents the player from skipping the following text by pressing the B button.');
  addHelpEntry('[2opts]', 'Initialize a two option choice.');
  addHelpEntry('[3opts]', 'Initialize a three option choice.');
  addHelpEntry('[fish]', 'Show last fish weight.');
  addHelpEntry('[time]', 'Show time of day.');
  addHelpEntry('[col:color]', "The following text will be colored according to _color_ (2 digit hex). Valid values are:\n" +
                           "40 = white\n" +
                           "41 = red\n" +
                           "42 = green\n" +
                           "43 = blue\n" +
                           "44 = light blue\n" +
                           "45 = pink\n" +
                           "46 = yellow\n" +
                           "47 = black");
  addHelpEntry('[spaces:count]', 'Insert _count_ spaces (2 digit hex).');
  addHelpEntry('[link:id]', 'Continue with the message referenced by _id_ (4 digit hex).');
  addHelpEntry('[delay:amount]', 'Delay printing by _amount_ (2 digit hex).');
  addHelpEntry('[fadewait:delay]', '???');
  addHelpEntry('[sfx:effect]', 'Play sound _effect_ (4 digit hex). Valid values are: ...');
  addHelpEntry('[item:value]', 'Show item icon for _value_ (2 digit hex).');
  addHelpEntry('[ldelay:##]', '');
  addHelpEntry('[loadbg:######]', '');
  addHelpEntry('[minigame:##]', '');
  addHelpEntry('[A]', '');
  addHelpEntry('[B]', '');
  addHelpEntry('[C]', '');
  addHelpEntry('[L]', '');
  addHelpEntry('[R]', '');
  addHelpEntry('[Z]', '');
  addHelpEntry('[Cu]', '');
  addHelpEntry('[Cd]', '');
  addHelpEntry('[Cl]', '');
  addHelpEntry('[Cr]', '');
  addHelpEntry('[Tri]', '');
  addHelpEntry('[Stick]', '');
}
