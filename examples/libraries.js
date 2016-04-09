// Libraries - Use Placebo's elements with other libraries
var require = window.require,
    placebo = window.placebo,
    bonzo = require('bonzo');

// Using placebo with libraries requires some testing, but the following should usually work:
bonzo(placebo('.foo').elements).addClass('bar');
// Using placebo's .elements object with a library will work for most libraries
// In some cases, however, libraries will require a single element passed at a time.
// If this is the case, the following will map the elements to the library:
placebo('.foo').export(function (element) {
    'use strict';
    bonzo(element).addClass('bar');
});