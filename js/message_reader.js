// message_reader.js

'use strict';

function MessageReader(data) {
  
  var msgData = data;
  var currentColor;

  this.readMessage = function (offset, length) {
    
    var end = offset + length;
    var element = document.createElement('div');
    var full = '';
    var snippet = '';
    var longSnippet = false;

    currentColor = 'white';

    element.setAttribute('contenteditable', '');
    element.setAttribute('spellCheck', false);
    element.classList.add('message');

    while (offset < end) {

      var standardChar = false;
      if (msgData[offset] >= 0x7f && msgData[offset] <= 0xab) {
        full += renderSpecial(msgData[offset]);
      } else {
        switch (msgData[offset]) {
          case 0x00: break;
          case 0x03: break;
            
          case 0x01: full += '<br>'; break;
            
          case 0x02: break; // end
          case 0x0a: full += renderShortcode(0x0a, 'shp'); break; // shop-keep-open
          case 0x0b: full += renderShortcode(0x0b, 'we'); break; // wait-external
          case 0x0d: full += renderShortcode(0x0d, 'wkc'); break; // wait-keypress-continue
          case 0x0f: full += renderShortcode(0x0f, 'Link'); break; // player-name
          case 0x08: full += renderShortcode(0x08, 'in1'); break; // instant-on
          case 0x09: full += renderShortcode(0x09, 'in0'); break; // instant-off
          case 0x10: full += renderShortcode(0x10, 'oca'); break; // ocarina
          case 0x11: full += renderShortcode(0x11, 'fdw2'); break; // fade-and-wait-2
          case 0x16: full += renderShortcode(0x16, 'scm'); break; // byte-result-marathon
          case 0x17: full += renderShortcode(0x17, 'schr'); break; // byte-result-horse-race
          case 0x18: full += renderShortcode(0x18, 'scha'); break; // byte-result-horseback-archery
          case 0x19: full += renderShortcode(0x19, 'scs'); break; // byte-result-skulltula-count
          case 0x1a: full += renderShortcode(0x1a, 'pbs'); break; // prevent-b-skip
          case 0x1b: full += renderShortcode(0x1b, 'o2'); break; // option-two
          case 0x1c: full += renderShortcode(0x1c, 'o3'); break; // option-three
          case 0x1d: full += renderShortcode(0x1d, 'scf'); break; // byte-result-fish
          case 0x1f: full += renderShortcode(0x1f, 'tod'); break; // current-time

          case 0x04: full += renderBoxBreak(); break; // wait-keypress-break
          case 0x05: full += renderColor(msgData[++offset]); break;
          case 0x06: full += renderSpaceStrip(msgData[++offset]); break;
          case 0x07: full += renderMsgLink(msgData[++offset] << 8 | msgData[++offset]); break;
          case 0x0c: full += renderDelay(msgData[++offset]); break;
          case 0x0e: full += renderFadeAndWait(msgData[++offset]); break;
          case 0x12: full += renderAudioCue(msgData[++offset] << 8 | msgData[++offset]); break;
          case 0x13: full += renderItemIcon(msgData[++offset]); break;
          case 0x14: full += renderLetterDelay(msgData[++offset]); break;
          case 0x15: full += renderBGLoader(msgData[++offset], msgData[++offset], msgData[++offset]); break;
          case 0x1e: full += renderResult(msgData[++offset]); break;
          default:
            standardChar = true;
        }
      }

      if (standardChar) {
        var char = String.fromCharCode(msgData[offset]);
        full += char;
        if (snippet.length < 25)
          snippet += char;
        else
          longSnippet = true;
      }

      offset++;
    }

    if (longSnippet)
      snippet = snippet.substr(0, snippet.length-3) + '...';

    element.innerHTML = full;
    return {
      full: element,
      snippet: snippet
    }
  };

  function renderShortcode(command, name, value) {
    var code = '<span class="shortcode" contenteditable="false" data-command="' + command + '">'
    code += '[' + name;
    if (arguments.length > 2)
      code += ':' + '<span class="shortcode-value" contenteditable>' + value + '</span>';
    code += ']</span>';
    return code;
  }

  function renderBoxBreak() {
    return '<span class="wait-box-break" data-command="0x04"></span>';
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
        output += '<span class="color-' + colorName + '" data-color="' + color + '">';
      currentColor = colorName;
    }
    return output;
  }

  function renderSpaceStrip(amount) {
    return renderShortcode(0x06, 'sp', hexString(amount, 2));
  }

  function renderMsgLink(msgId) {
    return renderShortcode(0x07, 'lnk', hexString(msgId, 4));
  }

  function renderDelay(delay) {
    return renderShortcode(0x0c, 'dly', hexString(delay, 2));
  }

  function renderFadeAndWait(delay) {
    return renderShortcode(0x0e, 'fdw', hexString(delay, 2));
  }

  function renderAudioCue(effect) {
    return renderShortcode(0x12, 'aud', hexString(effect, 4));
  }

  function renderItemIcon(item) {
    return renderShortcode(0x13, 'itm', hexString(item, 2));
  }

  function renderLetterDelay(delay) {
    return renderShortcode(0x14, 'ldly', hexString(delay, 2));
  }

  function renderBGLoader(background) {
    return renderShortcode(0x15, 'lbg', hexString(background, 6));
  }

  function renderResult(minigame) {
    return renderShortcode(0x1e, 'mgs', hexString(minigame, 2));
  }

  function renderSpecial(char) {
    switch (char) {
      case 0x7f: return renderShortcode(0x7f, '0x7f');
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
      case 0x9f: return renderShortcode(0x9f, 'A');
      case 0xa0: return renderShortcode(0xa0, 'B');
      case 0xa1: return renderShortcode(0xa1, 'C');
      case 0xa2: return renderShortcode(0xa2, 'L');
      case 0xa3: return renderShortcode(0xa3, 'R');
      case 0xa4: return renderShortcode(0xa4, 'Z');
      case 0xa5: return renderShortcode(0xa5, 'Cu');
      case 0xa6: return renderShortcode(0xa6, 'Cd');
      case 0xa7: return renderShortcode(0xa7, 'Cl');
      case 0xa8: return renderShortcode(0xa8, 'Cr');
      case 0xa9: return renderShortcode(0xa9, 'Dn');
      case 0xaa: return renderShortcode(0xaa, 'T');
      case 0xab: return renderShortcode(0xab, '+');
    }
  }
}