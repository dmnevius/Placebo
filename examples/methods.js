// Methods - utilities for extending elements
var placebo = window.placebo,
    element;

// Placebo is very friendly to other libraries!
// So much so that this topic has its own file!
// Check out libraries.js for examples!

// Place element in the document
// After .place is called, no more methods can be used
placebo('p#parent').place();

// Place inside parent
// Accepts objects...
placebo('.foo').place(document.body);
// Selectors...
placebo('.bar').place('#parent');
// Other placebo elements...
element = placebo('.bar');
placebo('.baz').place(element);
element.place();
// and lists of elements (including those created by most selector engines)
placebo('.example').place(document.getElementsByClassName("bar"));

// Set innerHTML to "Placebo" and place element
// Note that the innerHTML does not become "Foo" because it is called after .place
placebo('h1#name').text('Placebo').place().text('Foo');

// Listen for events
placebo('h2#clickMe').text('Click me!').on('click', function () {
    'use strict';
    placebo('.clicked').text('You clicked!').place();
}).place();

// Add styles
placebo('p.red').text('Red').style({
    color: 'red',
    fontStyle: 'italic'
}).place();