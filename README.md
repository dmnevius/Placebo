# Placebo

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
