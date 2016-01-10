// Basic usage - creating elements
// The next two lines assume placebo is being used with Ender
var require = window.require,
    placebo = require('placebo');

// Create a <p> element
// Note that without calling .place() the elements will remain in limbo
placebo('p');

// Create a <p> with id foo
placebo('p#foo');

// Create a <div> with id bar
placebo('#bar');

// Create a <p> with class baz
placebo('p.baz');

// Create a <div> with class baz
placebo('.baz');

// Clone all elements on the page
placebo('*');

// Create a <div> followed a <p>
placebo('div, p');
// Alternatively,
placebo('div + p');
// Conversely, create a <p> followed by a <div>
placebo('div ~ p');

// Create a <div> with id baz and a <p> with the class baz and place them in the document
placebo('#baz, p.baz');

// Create a <p> within a <div>
placebo('div p');
// Alternatively,
placebo('div > p');

// Create an <div> with attribute foo
placebo('div[foo]');

// Create an <a> with attribute target equal to "_blank"
placebo('a[target=_blank]');
// Alternatively,
placebo('a[target~=_blank]');
// Or,
placebo('a[target|=_blank]');
// Or,
placebo('a[target^=_blank]');
// Or,
placebo('a[target$=_blank]');
// Or,
placebo('a[target*=_blank]');

// Create an <a> with attribute target equal to "_blank" and title equal to "baz" and class baz
placebo('a[target=_blank][title=baz].baz');

// Shortcut to create a checked input
placebo('input:checked');

// Shortcut to disable an input
placebo('input:disabled');

// Create a <p> element that cannot have any children
// 'div p' would normally create a <p> within a <div>, but because the <div> is empty it has no children
// This will result in the <div> having the "data-placebo-prevent-children" attribute
placebo('div:empty p');

// Shortcut to enable an input
placebo('input:enabled');

// Creates a <p> with the id "first" that will be the first child of its parent when placed
placebo('p:first-child#first');

// Creates a <a> that will be the first <a> in its parent
placebo('a:first-of-type');

// Focuses the element when the page loads
placebo('input:focus');

// Sets the value of an input element to a random valid value and places it in the document
// Every time the page loads, the input will have a different value between 5 and 10
placebo('input[min=5][max=10]:in-range');
// Conversely, set the value to a random invalid value
placebo('input[min=5][max=10]:out-of-range');

// Creates a <p> with the language "en"
placebo('p:lang(en)');

// Creates a <p> that will be the last child of its parent
placebo('p:last-child');

// Creates a <a> that will be the last a in its parent
placebo('a:last-of-type');

// Creates a <p> element that will be the second child of its parent
placebo('p:nth-child(2)');

// Creates a <p> element that will be the second to last child of its parent
placebo('p:nth-last-child(2)');

// Creates a <p> element that will be the second to last <p> element in its parent
placebo('p:nth-last-of-type(2)');

// Creates a <p> element that will be the second <p> element in its parent
placebo('p:nth-of-type(2)');

// Creates a <div> element and deletes all other <div> elements in its parent
placebo('div:only-of-type');

// Creates a <div> and deletes all of its siblings
placebo('div:only-child');

// Creates an optional input
placebo('input:optional');

// Creates a required input
placebo('input:required');

// Creates a read-only input
placebo('input:read-only');

// Creates a read-write input
placebo('input:read-write');

// Creates an <a> and sets the URL anchor to its id
placebo('a#example:target');

// Create an element using a combination the modifiers and places it in the document
placebo('a#example:target:only-of-type[target=_blank].baz.bar:focus ~ p.baz:lang(en) ~ a[data-disallowed]');

// :active, ::after, ::before, ::first-letter, ::first-line, :hover, :invalid, :link, :not, :root, ::selection, :valid, :visited are not supported