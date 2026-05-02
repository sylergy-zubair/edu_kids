/**
 * Node < 20.12 has no util.styleText; RN 0.85 CLI expects it.
 * Prefer upgrading Node to ^20.19.4 or ^22.13 (see react-native package engines).
 */
'use strict';

const util = require('util');

if (typeof util.styleText !== 'function') {
  util.styleText = function styleText(_format, text) {
    return text;
  };
}
