<<<<<<< HEAD
# Placebo
## Create DOM elements from CSS selectors
=======
# Placebo - Create elements from CSS selectors
Create elements from CSS selectors

## Methods
### .place()
Places the placebo element in the document:
``` js
placebo('element').place();
```
Optional parameter parent to append the element(s) to: (default is document.body)
``` js
placebo('element').place(document.body);
// Also works with other placebo elements
var parent = placebo('#parent');
placebo('element').place(parent);
```
For selectors that modify the order or siblings, Placebo's .place must be used.
These selectors are "*", ",", "+", "~", :first-child, :last-child, :nth-child, :nth-last-child, :only-child, :first-of-type, :last-of-type, :nth-of-type, :nth-last-of-type, :only-of-type, :focus, and :target.

## Features
### Create an element:
``` js
placebo('element');
```
### Add a class:
``` js
placebo('.class');
```
### Set id:
``` js
placebo('#id');
```
### Clone all element:
``` js
placebo('*');
```
### Create multiple elements:
``` js
placebo('element, element');
// Or
placebo('element + element');
```
### Create an element inside another element:
``` js
placebo('element element');
// Or
placebo('element > element');
```
### Create multiple elements in reverse order:
``` js
placebo('element ~ element');
```
### Set empty attribute:
``` js
placebo('element[attribute]');
```
### Set an attribute:
``` js
// Any of the following will work:
placebo('element[attribute=value]');
placebo('element[attribute~=value]');
placebo('element[attribute|=value]');
placebo('element[attribute^=value]');
placebo('element[attribute$=value]');
placebo('element[attribute*=value]');
```
### Checked input
``` js
placebo('input:checked');
```
### Disabled input
``` js
placebo('input:disabled');
```
### Enabled input
``` js
placebo('input:enabled');
```
### Remove all children
``` js
placebo('element:empty');
```
### Set as first child
``` js
placebo('element:first-child');
```
### Set as last child
``` js
placebo('element:last-child');
```
### Set as nth child
``` js
placebo('element:nth-child(n)');
```
### Set as nth last child
``` js
placebo('element:nth-last-child(n)');
```
### Set as only child
``` js
placebo('element:only-child');
```
### Set as first of type
``` js
placebo('element:first-of-type');
```
### Set as last of type
``` js
placebo('element:last-of-type');
```
### Set as nth of type
``` js
placebo('element:nth-of-type(n)');
```
### Set as nth last of type
``` js
placebo('element:nth-last-of-type(n)');
```
### Set as only of type
``` js
placebo('element:only-of-type');
```
### Focus input
``` js
placebo('input:focus');
```
### Set random valid value
``` js
placebo('input:in-range');
```
### Set random invalid value
``` js
placebo('input:out-of-range');
```
### Set language
``` js
placebo('element:lang(language)');
```
### Set optional input
``` js
placebo('input:optional');
```
### Set required input
``` js
placebo('input:required');
```
### Set read-only
``` js
placebo('input:read-only');
```
### Set read and write
``` js
placebo('input:read-write');
```
### Set URL anchor to the id of the element
``` js
placebo('element#id:target');
```
### Unsupported modifiers
:active, ::after, ::before, ::first-letter, ::first-line, :hover, :invalid, :link, :not, :root, ::selection, :valid, :visited are not supported.
>>>>>>> 145b6d7ac9bf9bd9e8d83294b3e7caff428630b8
