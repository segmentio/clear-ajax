'use strict';

var clearAjax = require('../');

describe('clear-ajax', function() {
  var error;

  beforeEach(function() {
    error = null;
  });

  afterEach(function(done) {
    setTimeout(function() {
      done(error);
    }, 1000);
  });

  it('should remove all event listeners', function() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/1234', true);

    // on*
    xhr.onload = makeListener('onload');
    xhr.onerror = makeListener('onerror');
    xhr.onabort = makeListener('onabort');
    xhr.onreadystatechange = makeListener('onreadystatechange');
    // attach
    if (xhr.attachEvent) {
      xhr.attachEvent('onload', makeListener('attach-onload'));
      xhr.attachEvent('onerror', makeListener('attach-onerror'));
      xhr.attachEvent('onabort', makeListener('attach-onabort'));
      xhr.attachEvent('onreadystatechange', makeListener('attach-onreadystatechange'));
    }
    // add
    if (xhr.addEventListener) {
      xhr.addEventListener('load', makeListener('add-load'));
      xhr.addEventListener('error', makeListener('add-error'));
      xhr.addEventListener('abort', makeListener('add-abort'));
      xhr.addEventListener('readystatechange', makeListener('add-readystatechange'));
    }

    xhr.send();

    error = null;
    clearAjax();
  });

  function makeListener(name) {
    return function() {
      error = new Error(name + ' was called');
    };
  }
});
