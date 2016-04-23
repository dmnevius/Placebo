# Placebo

![NPM Version](https://img.shields.io/npm/v/placebo-js.svg)
![Travis CI Status](https://travis-ci.org/dmnevius/Placebo.svg?branch=master)
![CodeClimate GPA](https://codeclimate.com/github/dmnevius/Placebo/badges/gpa.svg)
![CodeClimate Issues](https://codeclimate.com/github/dmnevius/Placebo/badges/issue_count.svg)
![GitHub Issues](https://img.shields.io/github/issues/dmnevius/Placebo.svg)
![GitHub Downloads](https://img.shields.io/github/downloads/dmnevius/Placebo/total.svg)
![NPM Downloads](https://img.shields.io/npm/dt/placebo-js.svg)

There are plenty of libraries that use CSS selectors to find elements on a page, but Placebo takes those selectors and instead creates elements to match them.

## Usage
Once you have loaded Placebo, you will have access to a global ``placebo`` function. Passing CSS selectors into this function will return an object with the generated elements and other helpful tools.

Using Placebo is easy; just think of the CSS selector to match the element you want to create and then pass that to Placebo.
```
placebo("div.foo") // <div class="foo"></div>
placebo("div > p") // <div><p></p></div>
placebo("a[target=_blank]") // <a target="_blank"></a>
```

### Properties
The following properties are returned by ``placebo()``:
#### elements
``elements`` is an array containing a list of elements created by Placebo. ``elements`` is helpful when using Placebo with other libraries such as jQuery or Bonzo.

```
$("body").append(placebo("div > p").elements);
```
__Without using .elements, placebo will not work with other libraries!__
#### html
``html()`` is a function that returns the elements as plain HTML.
```
placebo("div > p").html() // Returns: "<div><p></p></div>"
```
#### place
``place(parent)`` is a helper function that places the elements in the specified parent. ``place`` is helpful to quickly put new elements on the page.
```
placebo("a[href=#]").place(document.body) // <a href="#"></a> is now in the document body
```

## Installation
Get Placebo directly by downloading either [placebo.js](https://raw.githubusercontent.com/dmnevius/Placebo/master/placebo.js) or [placebo.min.js](https://raw.githubusercontent.com/dmnevius/Placebo/master/placebo.min.js) from this repository or get Placebo from a package manager:
```
npm install placebo-js
```
```
bower install placebo-js
```
Placebo also works with [Ender](http://enderjs.com/):
```
ender add placebo-js
```
```
$.placebo
// or
require("placebo");
```
## Plugins
Since v2.0.2, Placebo supports "Pseudo Plugins", which are scripts that provide functionality beyond the default CSS selector behavior.

These plugins are used in the form of CSS pseudo selectors, such as ``:required`` or ``:first-of-type``. No use of pseudo selectors will trigger an error, but unless loaded in a plugin the selector will have no effect on the resulting element.

### Using Plugins
Using plugins is as easy as including the script on your page, after you load the main Placebo file.

### Creating Plugins
Since v2.0.2, Placebo offers an API that provides two methods into the otherwise closed-off inner Placebo. These methods are:

#### placebo.addPseudoBehavior
.addPseudoBehavior adds behavior to a specified pseudo selector. .addPseudoBehavior takes three inputs:
- __selector (required)__:
The name of the selector to match. This string will be used by your users to access your plugin. This string must only contain letters, numbers, and hyphens.
In the event of name conflicts, the plugin loaded last will override those loaded earlier.

- __callback (required)__:
Callback is a function that contains the logic of the selector. The function takes two inputs, the first being the target element and the second being a user supplied value, if there is any. See below for an example.

- __done (optional)__:
If and only if done is true, the callback will not be run until every other selector possible has been evaluated. Setting done to true will help make sure that the element is as close to its final state as possible, but ultimately the user decides the order selectors evaluate.

In this example, we create a plugin called "foo" that sets the text of the element to be what the user supplied + "bar":
```
var foo = function (e, v) {
  e.innerHTML = v + " bar";
};
placebo.addPseudoBehavior("foo", foo);
```
If somebody used our plugin above, it might look like this:
```
placebo("p:foo(baz)");
```
With the resulting HTML being ``<p>baz bar</p>``.

#### placebo.onPseudoDone
.onPseudoDone adds a function to be run once all selectors have evaluated. .onPseudoDone takes on input:
- __callback (required)__:
This function will be run once all selectors have evaluated. This cannot be used to register pseudo selectors and should only be used when you must be absolutely sure that the elements are in their final state.

### Default Plugins
Placebo comes with three plugins, located in /plugins: family, input and text. Each of these plugins was created to help fill out the complete CSS selector list.

#### family.js
family.js contains 10 pseudo selectors for modifying the order and position of elements. These selectors are:
- :empty - Prevents the target element from having any child nodes
- :first-of-type - Repositions the target element as the first of its node type within a parent element
- :last-child - Adds the target element as the last child of the parent element
- :last-of-type - Repositions the target element as the last element of its type within its parent
- :nth-child(n) - Repositions the target element as the nth child of its parent
- :nth-last-child(n) - Repositions the target element as the nth from last child of its parent
- :nth-last-of-type(n) - Repositions the target element as the nth last element of its type within its parent
- :nth-of-type(n) - Repositions the target element as the nth element of its type within its parent
- :only-of-type - Removes all other elements of the same node type from the target element's parent
- :only-child - Removes all other elements from the target element's parent

#### input.js
input.js contains 8 pseudo selectors for working with input elements.
- :checked - Sets check boxes as checked
- :disabled - Disables any input
- :enabled - Enables any input
- :in-range - Seeds the value of a text or number input with a random number within its min and max attributes
- :optional - Marks any input as optional
- :out-of-range - Seeds the value of a text or number input with a random number __not__ within its min and max attributes
- :read-only - Sets any input as read-only
- :read-write - Sets any input as read-write

#### text.js
Possibly the most useful default plugin, text.js contains 6 pseudo selectors for adding text to elements.
- ::after(text) - Adds to the end of the element's text
- ::before(text) - Adds to the beginning of the element's text
- ::first-letter(l) - Modifies the first letter of the element's text
- ::first-line(l) - Modified the first line of the element's text
- :lang(ln) - Sets the language of the element
- :text(text) - Unique to placebo, this selector simply sets the text of the element
