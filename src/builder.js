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
  "build": function (parsed, done) {
    var a,
      elements = [],
      target,
      i;
    if (!parsed.length) {
      parsed = [parsed];
    }
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
    if (typeof done === "function") {
      done();
    }
    return elements;
  },
  "rules": {
    "attribute": function (e, v) {
      e.setAttribute(v[0], v[1]);
    },
    "child": function (e, v) {
      var children = placebo.builder.build(v),
        i;
      for (i = 0; i < children.length; i += 1) {
        e.appendChild(children[i]);
      }
    },
    "class": function (e, v) {
      e.className += " " + v;
      e.className = e.className.replace(/^\s/, "");
    },
    "id": function (e, v) {
      e.id += " " + v;
      e.id = e.id.replace(/^\s/, "");
    },
    "pseudo": function (e, v) {
      if (placebo.builder.pseudoSelectors[v[0]]) {
        placebo.builder.pseudoSelectors[v[0]](e, v[1]);
      } else if (placebo.builder.pseudoSelectorsDone[v[0]]) {
        placebo.builder.pseudoSelectorsQueue.push(function() {
          placebo.builder.pseudoSelectorsDone[v[0]](e, v[1]);
        });
      }
    }
  }
};

placebo.builder.pseudoSelectorsDone = {};
placebo.builder.pseudoSelectors = {};
placebo.builder.pseudoSelectorsQueue = [];
