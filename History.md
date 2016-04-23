This file is the FINAL authority on version numbering. Please ignore commit names, NPM releases, etc. and refer to this file instead.

### Placebo 2.1.1
*Includes 2.1.0*

[Browse Files](https://github.com/dmnevius/Placebo)
```
npm install placebo-js
```
* Added element requirements to allow using classes and IDs without specifying a node type
* Added a Pseudo Plugin API and several default plugins
* Added demo/home pages
* Added integration tests for Require.js and Ender
* Fixed problems with AMD modules for placebo and default plugins
* Relaxed valid characters for attributes to allow for things such as URLs in attribute values
  ex. "link[href=http://example.com/styles.css]"
___

### Placebo 2.0.1
*Includes 2.0.0*

[Browse Files](https://github.com/dmnevius/Placebo/tree/9e536f3e269eba6de97a3d29a15d622b96f270d6)
```
npm install placebo-js@2.0.1
```
* Added minified version of placebo
* Better documentation in README.md
* Re-wrote entire core with an internal API to make future releases easier
* Re-wrote the entire parser to be much more efficient and usable

### Placebo 1.4.3
*Includes 1.4.0, 1.4.1, & 1.4.2*

[Browse Files](https://github.com/dmnevius/Placebo/tree/1cb1c926e197e1d7f77ae8e9e13e767e02481df9)
```
npm install placebo-js@1.1.0
```
* Added the :text pseudo selector
* Fixed a bug in accepted valid characters
* Fixed a bug that caused an error if certain strings were supplied
* More characters are now valid

___

### Placebo 1.3.1
*Includes 1.3.0*

[Browse Files](https://github.com/dmnevius/Placebo/tree/d8a3e77c1a79bbed397f5ab58823b35ca9aeaa30)
```
npm install placebo-js@1.0.8
```
* Added AMD module support
* Attribute values can use more characters
* Improved Ender integration

___

### Placebo 1.2.0
[Browse Files](https://github.com/dmnevius/Placebo/tree/4b90906b7f02e1536b867f313ae023c52774b8e9)
```
npm install placebo-js@1.0.2
```
* Added simple documentation in README.md
* Added some basic examples
* Added .export to make using placebo with other libraries easier
* Added .on to listen for events
* Added .style to style elements
* Added .text for setting the text of placebo elements
* Extended the abilities of .place

___

### Placebo 1.1.0
[Browse Files](https://github.com/dmnevius/Placebo/tree/b9b9848fa91c8a62432dfb7d99a72a7e4b8254e9)
```
npm install placebo-js@1.0.0
```
* Added support for Ender
* Created README.md
* Removed unused dependencies

___

### Placebo 1.0.0
[Browse Files](https://github.com/dmnevius/Placebo/tree/0c6118bf829d119d5d5fa8620167f38a178f807c)

__Not available through NPM or Bower__
* Added .gitattributes & .gitignore files
* Launched Placebo