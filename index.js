/* eslint no-console: ['off'] */
/* eslint strict: ['off'] */
/* eslint no-restricted-syntax: ['off'] */
const placebo = require('./dist/placebo');

const obj = placebo('div p:text(1), div:text(2), p:text(3):first-of-type');

function print(element, indent) {
  'use strict';

  let indentation = '';
  let i = 0;
  while (i < indent) {
    indentation += ' ';
    i += 1;
  }
  if (element.nodeName === '#TEXT') {
    console.log(`${indentation}|- "${element.innerText}"`);
  } else {
    console.log(`${indentation}|- ${element.nodeName}`);
    for (const attr of Object.getOwnPropertyNames(element.attributes)) {
      console.log(`${indentation}|---${attr}: ${element.attributes[attr]}`);
    }
    for (const child of element.children) {
      print(child, indent + 1);
    }
  }
}

print(obj.tree, 0);
console.log(obj.html());
