// utils.js

function hexString(num, padding) {
  padding = padding || 0;
  string = num.toString(16);
  while (string.length < padding) {
    string = '0' + string;
  }
  return string;
}