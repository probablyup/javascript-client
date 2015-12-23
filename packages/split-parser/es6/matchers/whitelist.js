
'use strict';

/**
 * Check if a key is inside a whitelist.
 *
 * @param {Set} whitelist - List of keys present in the whitelist
 * @return {function} checker if a given key is present in the whitelist or not.
 */
module.exports = function (whitelist) {
  return function (key) {
    return whitelist.has(key);
  };
};
