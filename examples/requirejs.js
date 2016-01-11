// Use placebo with RequireJS (or any other AMD module library) http://requirejs.org
var require = window.require;

require(['../placebo'], function (placebo) {
    'use strict';
    placebo('h1#title').text("Placebo &amp; RequireJS").place();
});