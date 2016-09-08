// editor_help.js

'use strict';

function initHelp() {

  function makeList(items) {
    var list = '<ul class="value-list">';
    for (var i = 0; i < items.length; i++) {
      list += '<li>' + items[i] + '</li>';
    }
    list += '</ul>';
    return list;
  }

  var helpEntries = [
    {
      title: 'Keyboard shortcuts',
      description: makeList([
          'ctrl/cmd+alt+down: select next message',
          'ctrl/cmd+alt+up: select previous message'
        ])
    },
    {
      title: 'More info',
      description: '...can be found on <a href="http://wiki.spinout182.com/w/Ocarina_of_Time:_Text_Format" target="_blank">Spinout\'s wiki</a>'
    },
    {
      title: '[2opts]',
      description: 'Initiate a two option choice.'
    },
    {
      title: '[3opts]',
      description: 'Initiate a three option choice.'
    },
    {
      title: '[A]',
      description: 'Display the A button icon.'
    },
    {
      title: '[archery]',
      description: 'Show last horseback archery score.'
    },
    {
      title: '[B]',
      description: 'Display the B button icon.'
    },
    {
      title: '[break]',
      description: 'Pause and wait for player keypress before continuing in a new message box'
    },
    {
      title: '[C]',
      description: 'Display the C button icon.'
    },
    {
      title: '[Cd]',
      description: 'Display the C Down button icon.'
    },
    {
      title: '[Cl]',
      description: 'Display the C Left button icon.'
    },
    {
      title: '[col:color]',
      description: "The following text will be colored according to <em>color</em> (2 digit hex). Valid values are:" +
        makeList([
          '40 = white',
          '41 = red',
          '42 = green',
          '43 = blue',
          '44 = light blue',
          '45 = pink',
          '46 = yellow',
          '47 = black'
        ])
    },
    {
      title: '[Cr]',
      description: 'Display the C Right button icon.'
    },
    {
      title: '[Cu]',
      description: 'Display the C Up button icon.'
    },
    {
      title: '[delay:amount]',
      description: 'Delay printing by <em>amount</em> (2 digit hex).'
    },
    {
      title: '[fadewait:delay]',
      description: '???'
    },
    {
      title: '[fadewait2]',
      description: '???'
    },
    {
      title: '[fish]',
      description: 'Show last fish weight.'
    },
    {
      title: '[horserace]',
      description: 'Show last horse race score.'
    },
    {
      title: '[instantoff]',
      description: 'Disable instant text display.'
    },
    {
      title: '[instanton]',
      description: 'Display the following text instantly'
    },
    {
      title: '[item:value]',
      description: 'Show item icon for <em>value</em> (2 digit hex).'
    },
    {
      title: '[L]',
      description: 'Display the L button icon.'
    },
    {
      title: '[ldelay:delay]',
      description: 'Delay each following letter by <em>delay</em> frames(?) (2 digit hex).'
    },
    {
      title: '[link:id]',
      description: 'Continue with the message referenced by <em>id</em> (4 digit hex).'
    },
    {
      title: '[loadbg:id]',
      description: 'Load a background for the dialog box identified by <em>id</em>. Valid values are unknown.'
    },
    {
      title: '[marathon]',
      description: 'Show last marathon score.'
    },
    {
      title: '[minigame:game]',
      description: 'Show the player\'s record for <em>game</em>. Valid values are:' +
        makeList([
          '00 = horseback archery points',
          '01 = big poe card points',
          '02 = largest fish caught',
          '03 = horse race time',
          '04 = marathon time',
          '06 = dampé race time'
        ])
    },
    {
      title: '[name]',
      description: 'Displays the player\'s name.'
    },
    {
      title: '[nobskip]',
      description: 'Prevents the player from skipping the following text by pressing the B button.'
    },
    {
      title: '[ocarina]',
      description: 'Initiate Ocarina play.'
    },
    {
      title: '[R]',
      description: 'Display the R button icon.'
    },
    {
      title: '[sfx:effect]',
      description: 'Play sound <em>effect</em> (4 digit hex).'
    },
    {
      title: '[shop]',
      description: 'Open shop dialogue (?)'
    },
    {
      title: '[skulltulas]',
      description: 'Show gold skulltula count.'
    },
    {
      title: '[spaces:count]',
      description: 'Insert <em>count</em> spaces (2 digit hex).'
    },
    {
      title: '[Stick]',
      description: 'Display the analog stick icon.'
    },
    {
      title: '[time]',
      description: 'Show time of day.'
    },
    {
      title: '[Tri]',
      description: 'Display the Z-targeting icon.'
    },
    {
      title: '[waitext]',
      description: 'Wait for external event (?)'
    },
    {
      title: '[waitkey]',
      description: 'Pause and wait for player keypress before continuing'
    },
    {
      title: '[Z]',
      description: 'Display the Z button icon.'
    }
  ];

  var helpList = document.querySelector('.editor-help-list');

  for (var i = 0; i < helpEntries.length; i++) {
    var entry = helpEntries[i];
    var listItem = document.createElement('li');
    var label = document.createElement('h3');
    var descDiv = document.createElement('div');

    label.classList.add('editor-help-label');
    label.innerText = entry.title;

    descDiv.classList.add('editor-help-description');
    descDiv.innerHTML = entry.description;

    listItem.classList.add('editor-help-entry');
    listItem.appendChild(label);
    listItem.appendChild(descDiv);

    helpList.appendChild(listItem);
  }
}
