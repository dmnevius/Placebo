/**
 * Builder
 *
 * Builds elements from objects created by parser.js
 */

placebo.builder = {
  /**
   * Builds DOM elements from placebo.parser objects
   * @param  {Object} parsed The output of placebo.parser to build
   * @return {Array}         An array of DOM elements matching the placebo.parser output
   */
  "build": function (parsed) {
    var a,
      elements = [],
      target,
      i;
    for (i = 0; i < parsed.length; i += 1) {
      if (parsed[i].node === "*") {
        parsed[i].node = "div";
      }
      target = document.createElement(parsed[i].node);
      for (a = 0; a < parsed[i].extra.length; a += 1) {
        this.rules[parsed[i].extra[a].name](target, parsed[i].extra[a].value);
      }
      elements.push(target);
    }
    return elements;
  },
  "rules": {
    // div[foo=bar]
    "attribute": function (e, v) {
      e.setAttribute(v[0], v[1]);
    },
    // div p
    "child": function (e, v) {
      var children = placebo.builder.build(v),
        i;
      for (i = 0; i < children.length; i += 1) {
        e.appendChild(children[i]);
      }
    },
    // .class
    "class": function (e, v) {
      e.className += " " + v;
      e.className = e.className.replace(/^\s/, "");
    },
    // #id
    "id": function (e, v) {
      e.id += " " + v;
      e.id = e.id.replace(/^\s/, "");
    },
    "pseudo": function (e, v) {
      console.log(v);
    }
  }
};
