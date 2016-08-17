'use strict';

/*
 * Module dependencies.
 */

var each = require('@ndhoule/each');

/**
 * noop.
 */
function noop() {}

/**
 * Original send method.
 */

var send = XMLHttpRequest.prototype.send;

// Watch for events added via attachEvent/addEventListener and
// unregister them via their opposite.
function bindAttach(add, remove) {
  var cached = XMLHttpRequest.prototype[add];
  if (!cached) return;
  XMLHttpRequest.prototype[add] = function() {
    var queue = this._queue = this._queue || [];
    queue.push([remove, arguments]);
    return cached.apply(this, arguments);
  };
}
bindAttach('attachEvent', 'detachEvent');
bindAttach('addEventListener', 'removeEventListener');

/**
 * Requests made.
 */

var requests = [];

/**
 * Clear all active AJAX requests.
 *
 * @api public
 */
function clearAjax() {
  each(function(request) {
    try {
      request.onload = noop;
      request.onerror = noop;
      request.onabort = noop;
      request.onreadystatechange = noop;
      each(function(added) {
        request[added[0]].apply(request, added[1]);
      }, request._queue || []);
      request.abort();
    } catch (e) {
      // Ignore error
    }
  }, requests);
  requests.length = [];
}

/**
 * Capture AJAX requests.
 *
 * @api public
 */
function bind() {
  XMLHttpRequest.prototype.send = function() {
    requests.push(this);
    return send.apply(this, arguments);
  };
}

/**
 * Reset `XMLHttpRequest` back to normal.
 *
 * @api public
 */
function unbind() {
  XMLHttpRequest.prototype.send = send;
}

/*
 * Automatically bind.
 */

bind();

/*
 * Exports.
 */

module.exports = clearAjax;
module.exports.bind = bind;
module.exports.unbind = unbind;
