var $ = window.$,
    require = window.require,
    placebo = window.placebo,
    placebo2 = require('placebo');

// Global object
placebo('div#foo').place();

// Require()
placebo2('div#baz').place();
