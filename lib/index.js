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
  XMLHttpRequest.prototype.send = function send() {
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
