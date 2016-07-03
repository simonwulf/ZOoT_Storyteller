// message_reader.jsp

function MessageReader(data) {
  
  var currentColor;

  this.readMessage = function (offset, length) {
    
    var end = offset + length;
    var element = document.createElement('div');
    var text = '';

    currentColor = 'white';

    element.setAttribute('contenteditable', '');
    element.setAttribute('spellCheck', false);
    element.classList.add('message');

    while (offset < end) {

      var standardChar = false;
      if (msgData[offset] >= 0x7f && msgData[offset] <= 0xab) {
        text += renderSpecial(msgData[offset]);
      } else {
        switch (msgData[offset]) {
          case 0x00: break;
          case 0x03: break;
            
          case 0x01: text += '<br>'; break;
            
          case 0x02: text += renderSpan('marker end', '[end]'); break;
          case 0x0a: text += renderSpan('marker shop-keep-open', '[0x0a]'); break;
          case 0x0b: text += renderSpan('marker wait-external', '[wait-external]'); break;
          case 0x10: text += renderSpan('marker ocarina', '[ocarina]'); break;
          case 0x16: text += renderSpan('marker byte-result-marathon', '[marathon-score]'); break;
          case 0x17: text += renderSpan('marker byte-result-horse-race', '[horse-race-score]'); break;
          case 0x18: text += renderSpan('marker byte-result-horseback-archery', '[horseback-archery-score]'); break;
          case 0x19: text += renderSpan('marker byte-result-skulltula-count', '[gold-skulltula-count]'); break;
          case 0x1a: text += renderSpan('marker prevent-b-skip', '[prevent-b-skip]'); break;
          case 0x1b: text += renderSpan('marker option-two', '[2-options]'); break;
          case 0x1c: text += renderSpan('marker option-three', '[3-options]'); break;
          case 0x1d: text += renderSpan('marker byte-result-fish', '[largest-fish]'); break;
          case 0x1f: text += renderSpan('marker current-time', '[time-of-day]'); break;
          
          case 0x04: text += renderSpan('wait-keypress-break'); break;
          case 0x0d: text += renderSpan('wait-keypress-continue', ' >> '); break;

          case 0x05: text += renderColor(msgData[++offset]); break;
          case 0x06: text += renderSpaceStrip(msgData[++offset]); break;
          case 0x07: text += renderMsgLink(msgData[++offset] << 8 | msgData[++offset]); break;
          case 0x08: text += renderInstant(true); break;
          case 0x09: text += renderInstant(false); break;
          case 0x0c: text += renderDelay(msgData[++offset]); break;
          case 0x0e: text += renderFadeAndWait(0x0e, msgData[++offset]); break;
          case 0x0f: text += renderPlayerName(); break;
          case 0x11: text += renderFadeAndWait(0x11); break;
          case 0x12: text += renderAudioCue(msgData[++offset] << 8 | msgData[++offset]); break;
          case 0x13: text += renderItemIcon(msgData[++offset]); break;
          case 0x14: text += renderLetterDelay(msgData[++offset]); break;
          case 0x15: text += renderBGLoader(msgData[++offset], msgData[++offset], msgData[++offset]); break;
          case 0x1e: text += renderResult(msgData[++offset]); break;
          default:
            standardChar = true;
        }
      }

      if (standardChar)
        text += String.fromCharCode(msgData[offset]);

      offset++;
    }

    element.innerHTML = text;
    return element;
  };

  function renderSpan(classes, content) {
    content = content || '';
    return '<span class="' + classes + '">' + content + '</span>';
  }

  function renderColor(color) {
    var output = '';
    var colorName = '';
    switch (color) {
      case 0x40: colorName = 'white'; break;
      case 0x41: colorName = 'red'; break;
      case 0x42: colorName = 'green'; break;
      case 0x43: colorName = 'blue'; break;
      case 0x44: colorName = 'light-blue'; break;
      case 0x45: colorName = 'pink'; break;
      case 0x46: colorName = 'yellow'; break;
      case 0x47: colorName = 'black'; break;
    }
    if (colorName != currentColor) {
      if (currentColor != 'white')
        output += '</span>';
      if (colorName != 'white')
        output += '<span class="color-' + colorName + '">';
      currentColor = colorName;
    }
    return output;
  }

  function renderSpaceStrip(amount) {
    /*var spaces = '';
    for (var i = 0; i < amount; i++) {
      spaces += '-';
    }*/
    return renderSpan('marker space-strip', '[spaces:0x' + hexString(amount, 2) + ']');
  }

  function renderMsgLink(msgId) {
    return '<a href="#">0x' + hexString(msgId, 4) + '</a>';
  }

  function renderInstant(instant) {
    return renderSpan(
      'marker ' + (instant ? 'instant-on' : 'instant-off'),
      '[' + (instant ? 'instant-on' : 'instant-off') + ']'
    );
  }

  function renderDelay(delay) {
    return renderSpan('marker delay', '[delay:0x' + hexString(delay, 2) + ']');
  }

  function renderFadeAndWait(command, delay) {
    return renderSpan('marker fade-and-wait', '[fade-and-wait]');
  }

  function renderPlayerName() {
    return renderSpan('marker player-name', '[Link]');
  }

  function renderAudioCue(effect) {
    return renderSpan('marker audio-cue', '[audio:0x' + hexString(effect, 4) + ']');
  }

  function renderItemIcon(item) {
    return renderSpan('marker item-icon', '[item:0x' + hexString(item, 2) + ']');
  }

  function renderLetterDelay(delay) {
    return renderSpan('marker delay', '[letter-delay:0x' + hexString(delay, 2) + ']');
  }

  function renderBGLoader(background) {
    return renderSpan('marker bg-loader', '[load-bg:0x' + hexString(background, 6) + ']');
  }

  function renderResult(minigame) {
    return renderSpan('marker minigame-result', '[minigame-score:0x' + hexString(minigame, 2) + '}');
  }

  function renderSpecial(char) {
    switch (char) {
      case 0x7f: return renderSpan('marker', '[0x7f]');
      case 0x80: return 'À';
      case 0x81: return 'Á';
      case 0x82: return 'Â';
      case 0x83: return 'Ä';
      case 0x84: return 'Ç';
      case 0x85: return 'È';
      case 0x86: return 'É';
      case 0x87: return 'Ê';
      case 0x88: return 'Ë';
      case 0x89: return 'Ï';
      case 0x8a: return 'Ô';
      case 0x8b: return 'Ö';
      case 0x8c: return 'Ù';
      case 0x8d: return 'Û';
      case 0x8e: return 'Ü';
      case 0x8f: return 'ß';
      case 0x80: return 'à';
      case 0x91: return 'á';
      case 0x92: return 'â';
      case 0x93: return 'ä';
      case 0x94: return 'ç';
      case 0x95: return 'è';
      case 0x96: return 'é';
      case 0x97: return 'ê';
      case 0x98: return 'ë';
      case 0x99: return 'ï';
      case 0x9a: return 'ô';
      case 0x9b: return 'ö';
      case 0x9c: return 'ù';
      case 0x9d: return 'û';
      case 0x9e: return 'ü';
      case 0x9f: return renderSpan('marker button-icon a-button', '[A]');
      case 0xa0: return renderSpan('marker button-icon b-button', '[B]');
      case 0xa1: return renderSpan('marker button-icon c-button', '[C]');
      case 0xa2: return renderSpan('marker button-icon l-button', '[L]');
      case 0xa3: return renderSpan('marker button-icon r-button', '[R]');
      case 0xa4: return renderSpan('marker button-icon z-button', '[Z]');
      case 0xa5: return renderSpan('marker button-icon c-up-button', '[Cu]');
      case 0xa6: return renderSpan('marker button-icon c-down-button', '[Cd]');
      case 0xa7: return renderSpan('marker button-icon c-left-button', '[Cl]');
      case 0xa8: return renderSpan('marker button-icon c-right-button', '[Cr]');
      case 0xa9: return renderSpan('marker button-icon down-arrow', '[Dn-arrow]');
      case 0xaa: return renderSpan('marker button-icon control-stick', '[Stick]');
      case 0xab: return renderSpan('marker button-icon d-pad', '[D-pad]');
    }
  }
}