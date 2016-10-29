(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.placebo = factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

















var set = function set(object, property, value, receiver) {
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent !== null) {
      set(parent, property, value, receiver);
    }
  } else if ("value" in desc && desc.writable) {
    desc.value = value;
  } else {
    var setter = desc.set;

    if (setter !== undefined) {
      setter.call(receiver, value);
    }
  }

  return value;
};

var Element = function () {
  function Element(tag, parent) {
    classCallCheck(this, Element);
    this.nodeName = tag.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.innerText = '';
    this.parentNode = parent;
    this.nextSibling = null;
    this.lang = '';
    if (this.nodeName === 'INPUT') {
      this.checked = false;
      this.disabled = false;
      this.required = false;
      this.readonly = false;
      this.min = '';
      this.max = '';
      this.value = '';
      this.required = '';
    }
  }
  createClass(Element, [{
    key: 'asDOM',
    value: function asDOM() {
      if (typeof document !== 'undefined') {
        if (this.nodeName === '#TEXT') {
          return document.createTextNode(this.innerText);
        }
        var element = document.createElement(this.nodeName);
        var attributes = Object.getOwnPropertyNames(this.attributes);
        for (var a = 0; a < attributes.length; a += 1) {
          element.setAttribute(attributes[a], this.attributes[attributes[a]]);
        }
        for (var i = 0; i < this.children.length; i += 1) {
          element.appendChild(this.children[i].asDOM());
        }
        return element;
      }
      throw new Error('Element could not be converted to DOM - No document was found!');
    }
  }, {
    key: 'asHTML',
    value: function asHTML() {
      if (this.nodeName === '#TEXT') {
        return this.innerText;
      }
      var selfClosing = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'];
      var string = '<' + this.nodeName.toLowerCase();
      var attributes = Object.getOwnPropertyNames(this.attributes);
      for (var i = 0; i < attributes.length; i += 1) {
        string += ' ' + attributes[i] + '="' + this.attributes[attributes[i]] + '"';
      }
      if (selfClosing.indexOf(this.nodeName) > -1 && this.children.length < 1) {
        string += ' />';
      } else {
        string += '>';
        for (var _i = 0; _i < this.children.length; _i += 1) {
          string += this.children[_i].asHTML();
        }
        string += '</' + this.nodeName.toLowerCase() + '>';
      }
      return string;
    }
  }, {
    key: 'appendChild',
    value: function appendChild(child) {
      var node = child;
      node.parentNode = this;
      node.nodeID = this.children.length;
      this.children.push(node);
      this.rebuildTree();
    }
  }, {
    key: 'appendToAttribute',
    value: function appendToAttribute(attribute, value) {
      if (typeof this.attributes[attribute] !== 'string') {
        this.attributes[attribute] = value;
      } else {
        this.attributes[attribute] += ' ' + value;
      }
    }
  }, {
    key: 'getElementsByTagName',
    value: function getElementsByTagName(tag) {
      var result = [];
      for (var i = 0; i < this.children.length; i += 1) {
        if (this.children[i].nodeName === tag.toUpperCase()) {
          result.push(this.children[i]);
        }
        result.concat(this.children[i].getElementsByTagName(tag));
      }
      return result;
    }
  }, {
    key: 'getChildIDs',
    value: function getChildIDs() {
      var output = [];
      for (var i = 0; i < this.children.length; i += 1) {
        output.push(this.children[i].nodeID);
      }
      return output;
    }
  }, {
    key: 'insertBefore',
    value: function insertBefore(newChild, target) {
      for (var i = 0; i < this.children.length; i += 1) {
        if (typeof this.children[i] !== 'undefined' && this.children[i].nodeID === target.nodeID) {
          this.children.splice(i, 0, newChild);
          break;
        }
      }
      this.rebuildTree();
    }
  }, {
    key: 'rebuildTree',
    value: function rebuildTree() {
      for (var i = 0; i < this.children.length; i += 1) {
        this.children[i].nextSibling = this.children[i + 1];
      }
    }
  }, {
    key: 'removeChild',
    value: function removeChild(child) {
      for (var i = 0; i < this.children.length; i += 1) {
        if (this.children[i].nodeID === child.nodeID) {
          this.children.splice(i, 1);
          break;
        }
      }
      this.rebuildTree();
    }
  }, {
    key: 'removeAttribute',
    value: function removeAttribute(attribute) {
      delete this.attributes[attribute];
    }
  }, {
    key: 'setAttribute',
    value: function setAttribute(attribute, value) {
      this.attributes[attribute] = value;
    }
  }]);
  return Element;
}();

var builder = {
  build: function build(input) {
    var container = new Element('div');
    var parsed = input;
    if (typeof parsed.length !== 'number') {
      parsed = [parsed];
    }
    for (var i = 0; i < parsed.length; i += 1) {
      var element = parsed[i];
      if (element.node === '*') {
        element.node = 'div';
      }
      var target = new Element(element.node);
      for (var r = 0; r < element.extra.length; r += 1) {
        this.rules[element.extra[r].name](target, element.extra[r].value);
      }
      container.appendChild(target);
    }
    return container;
  },
  rules: {
    attribute: function attribute(element, values) {
      element.setAttribute(values[0], values[1]);
    },
    child: function child(element, value) {
      var children = builder.build(value).children;
      for (var i = 0; i < children.length; i += 1) {
        element.appendChild(children[i]);
      }
    },
    class: function _class(element, value) {
      element.appendToAttribute('class', value);
    },
    id: function id(element, value) {
      element.appendToAttribute('id', value);
    },
    pseudo: function pseudo(element, values) {
      if (typeof builder.pseudoSelectors[values[0]] === 'function') {
        builder.pseudoSelectorsQueue.push([values[0], element, values[1]]);
      }
    }
  },
  pseudoSelectors: {},
  pseudoSelectorsQueue: [],
  pseudoSelectorsDone: []
};

var version = '2.3.0';
function addPseudoBehavior(selector, callback) {
  builder.pseudoSelectors[selector] = callback;
}
function onPseudoDone(callback) {
  builder.pseudoSelectorsDone.push(callback);
}

var Factory = function () {
  function Factory(tree) {
    classCallCheck(this, Factory);
    this.tree = tree;
    this.elements = [];
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      for (var i = 0; i < tree.children.length; i += 1) {
        this.elements.push(tree.children[i].asDOM());
      }
    }
  }
  createClass(Factory, [{
    key: 'html',
    value: function html() {
      var html = '';
      for (var i = 0; i < this.tree.children.length; i += 1) {
        html += this.tree.children[i].asHTML();
      }
      return html;
    }
  }, {
    key: 'place',
    value: function place(target) {
      var parent = target;
      if (typeof document !== 'undefined') {
        if (typeof parent === 'undefined') {
          if (typeof document.body !== 'undefined') {
            parent = document.body;
          } else {
            throw new Error('No parent element supplied to placebo.place()!');
          }
        }
        for (var i = 0; i < this.elements.length; i += 1) {
          parent.appendChild(this.elements[i]);
        }
        return parent;
      }
      throw new Error('placebo.place() requires a document!');
    }
  }]);
  return Factory;
}();

function peg$subclass(child, parent) {
  function ctor() {
    this.constructor = child;
  }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}
function peg$SyntaxError(message, expected, found, location) {
  this.message = message;
  this.expected = expected;
  this.found = found;
  this.location = location;
  this.name = "SyntaxError";
  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}
peg$subclass(peg$SyntaxError, Error);
peg$SyntaxError.buildMessage = function (expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
    literal: function literal(expectation) {
      return "\"" + literalEscape(expectation.text) + "\"";
    },
    "class": function _class(expectation) {
      var escapedParts = "",
          i;
      for (i = 0; i < expectation.parts.length; i++) {
        escapedParts += expectation.parts[i] instanceof Array ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1]) : classEscape(expectation.parts[i]);
      }
      return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
    },
    any: function any(expectation) {
      return "any character";
    },
    end: function end(expectation) {
      return "end of input";
    },
    other: function other(expectation) {
      return expectation.description;
    }
  };
  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }
  function literalEscape(s) {
    return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
      return '\\x0' + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return '\\x' + hex(ch);
    });
  }
  function classEscape(s) {
    return s.replace(/\\/g, '\\\\').replace(/\]/g, '\\]').replace(/\^/g, '\\^').replace(/-/g, '\\-').replace(/\0/g, '\\0').replace(/\t/g, '\\t').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/[\x00-\x0F]/g, function (ch) {
      return '\\x0' + hex(ch);
    }).replace(/[\x10-\x1F\x7F-\x9F]/g, function (ch) {
      return '\\x' + hex(ch);
    });
  }
  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }
  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i,
        j;
    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }
    descriptions.sort();
    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }
    switch (descriptions.length) {
      case 1:
        return descriptions[0];
      case 2:
        return descriptions[0] + " or " + descriptions[1];
      default:
        return descriptions.slice(0, -1).join(", ") + ", or " + descriptions[descriptions.length - 1];
    }
  }
  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }
  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};
function peg$parse(input, options) {
  options = options !== void 0 ? options : {};
  var peg$FAILED = {},
      peg$startRuleFunctions = { start: peg$parsestart },
      peg$startRuleFunction = peg$parsestart,
      peg$c0 = " ",
      peg$c1 = peg$literalExpectation(" ", false),
      peg$c2 = ",",
      peg$c3 = peg$literalExpectation(",", false),
      peg$c4 = "+",
      peg$c5 = peg$literalExpectation("+", false),
      peg$c6 = "~",
      peg$c7 = peg$literalExpectation("~", false),
      peg$c8 = function peg$c8(node) {
    return node;
  },
      peg$c9 = function peg$c9(first, rest) {
    return [first].concat(rest);
  },
      peg$c10 = /^[a-zA-Z_]/,
      peg$c11 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false),
      peg$c12 = /^[a-zA-Z0-9_\-]/,
      peg$c13 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", "-"], false, false),
      peg$c14 = "-",
      peg$c15 = peg$literalExpectation("-", false),
      peg$c16 = function peg$c16(hyphen, first, rest) {
    return hyphen || "" + first + rest.join("");
  },
      peg$c17 = function peg$c17(name) {
    return name.join("");
  },
      peg$c18 = "*",
      peg$c19 = peg$literalExpectation("*", false),
      peg$c20 = function peg$c20(name) {
    return name;
  },
      peg$c21 = /^[^)\]]/,
      peg$c22 = peg$classExpectation([")", "]"], true, false),
      peg$c23 = function peg$c23(text) {
    return text.join("");
  },
      peg$c24 = function peg$c24(node, extra) {
    return { node: node || "div", extra: extra };
  },
      peg$c25 = function peg$c25(node, extra) {
    return { node: node, extra: extra };
  },
      peg$c26 = ".",
      peg$c27 = peg$literalExpectation(".", false),
      peg$c28 = function peg$c28(name) {
    return { "name": "class", "value": name };
  },
      peg$c29 = "#",
      peg$c30 = peg$literalExpectation("#", false),
      peg$c31 = function peg$c31(name) {
    return { "name": "id", "value": name };
  },
      peg$c32 = function peg$c32(child) {
    return { "name": "child", "value": child };
  },
      peg$c33 = ">",
      peg$c34 = peg$literalExpectation(">", false),
      peg$c35 = "[",
      peg$c36 = peg$literalExpectation("[", false),
      peg$c37 = "]",
      peg$c38 = peg$literalExpectation("]", false),
      peg$c39 = function peg$c39(name) {
    return { "name": "attribute", "value": [name, ""] };
  },
      peg$c40 = "|",
      peg$c41 = peg$literalExpectation("|", false),
      peg$c42 = "^",
      peg$c43 = peg$literalExpectation("^", false),
      peg$c44 = "$",
      peg$c45 = peg$literalExpectation("$", false),
      peg$c46 = "=",
      peg$c47 = peg$literalExpectation("=", false),
      peg$c48 = function peg$c48(name, value) {
    return { "name": "attribute", "value": [name, value || ""] };
  },
      peg$c49 = ":",
      peg$c50 = peg$literalExpectation(":", false),
      peg$c51 = function peg$c51(name) {
    return { "name": "pseudo", "value": [name, null] };
  },
      peg$c52 = "(",
      peg$c53 = peg$literalExpectation("(", false),
      peg$c54 = ")",
      peg$c55 = peg$literalExpectation(")", false),
      peg$c56 = function peg$c56(name, value) {
    return { "name": "pseudo", "value": [name, value] };
  },
      peg$currPos = 0,
      peg$savedPos = 0,
      peg$posDetailsCache = [{ line: 1, column: 1 }],
      peg$maxFailPos = 0,
      peg$maxFailExpected = [],
      peg$silentFails = 0,
      peg$result;
  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }
    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }
  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }
  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }
  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildStructuredError([peg$otherExpectation(description)], input.substring(peg$savedPos, peg$currPos), location);
  }
  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos);
    throw peg$buildSimpleError(message, location);
  }
  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }
  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }
  function peg$anyExpectation() {
    return { type: "any" };
  }
  function peg$endExpectation() {
    return { type: "end" };
  }
  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }
  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos],
        p;
    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }
      details = peg$posDetailsCache[p];
      details = {
        line: details.line,
        column: details.column
      };
      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }
        p++;
      }
      peg$posDetailsCache[pos] = details;
      return details;
    }
  }
  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails = peg$computePosDetails(endPos);
    return {
      start: {
        offset: startPos,
        line: startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line: endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }
  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) {
      return;
    }
    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }
    peg$maxFailExpected.push(expected);
  }
  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }
  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(peg$SyntaxError.buildMessage(expected, found), expected, found, location);
  }
  function peg$parsestart() {
    var s0;
    s0 = peg$parsesiblings();
    if (s0 === peg$FAILED) {
      s0 = peg$parsenode();
    }
    return s0;
  }
  function peg$parsesibling() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 32) {
      s1 = peg$c0;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c1);
      }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 44) {
        s2 = peg$c2;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c3);
        }
      }
      if (s2 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 43) {
          s2 = peg$c4;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c5);
          }
        }
        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 126) {
            s2 = peg$c6;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c7);
            }
          }
        }
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c0;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c1);
          }
        }
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsenodeRequired();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c8(s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsesiblings() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    s1 = peg$parsenodeRequired();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 32) {
        s2 = peg$c0;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c1);
        }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsesibling();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsesibling();
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c9(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenmstart() {
    var s0;
    if (peg$c10.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c11);
      }
    }
    return s0;
  }
  function peg$parsenmchar() {
    var s0;
    if (peg$c12.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c13);
      }
    }
    return s0;
  }
  function peg$parseident() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 45) {
      s1 = peg$c14;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c15);
      }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsenmstart();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$parsenmchar();
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$parsenmchar();
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c16(s1, s2, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsename() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    s2 = peg$parsenmchar();
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$parsenmchar();
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c17(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parseelement() {
    var s0, s1;
    s0 = peg$currPos;
    s1 = peg$parseident();
    if (s1 === peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 42) {
        s1 = peg$c18;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c19);
        }
      }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c20(s1);
    }
    s0 = s1;
    return s0;
  }
  function peg$parsetext() {
    var s0, s1, s2;
    s0 = peg$currPos;
    s1 = [];
    if (peg$c21.test(input.charAt(peg$currPos))) {
      s2 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c22);
      }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c21.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c22);
          }
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 32) {
        s2 = peg$c0;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c1);
        }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c23(s1);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenode() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseelement();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseextra();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseextra();
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c24(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsenodeRequired() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    s1 = peg$parseelement();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$parseextra();
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$parseextra();
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c25(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseextra() {
    var s0;
    s0 = peg$parseclass();
    if (s0 === peg$FAILED) {
      s0 = peg$parseid();
      if (s0 === peg$FAILED) {
        s0 = peg$parsechildren();
        if (s0 === peg$FAILED) {
          s0 = peg$parseinside();
          if (s0 === peg$FAILED) {
            s0 = peg$parseattributeIs();
            if (s0 === peg$FAILED) {
              s0 = peg$parseattribute();
              if (s0 === peg$FAILED) {
                s0 = peg$parsepseudoSpecial();
                if (s0 === peg$FAILED) {
                  s0 = peg$parsepseudo();
                }
              }
            }
          }
        }
      }
    }
    return s0;
  }
  function peg$parseclass() {
    var s0, s1, s2;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 46) {
      s1 = peg$c26;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c27);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseident();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c28(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseid() {
    var s0, s1, s2;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 35) {
      s1 = peg$c29;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c30);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsename();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c31(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseinside() {
    var s0, s1, s2;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 32) {
      s1 = peg$c0;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c1);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsesiblings();
      if (s2 === peg$FAILED) {
        s2 = peg$parsenodeRequired();
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c32(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsechildren() {
    var s0, s1, s2, s3, s4;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 32) {
      s1 = peg$c0;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c1);
      }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 62) {
        s2 = peg$c33;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c34);
        }
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c0;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c1);
          }
        }
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parsesiblings();
          if (s4 === peg$FAILED) {
            s4 = peg$parsenodeRequired();
          }
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c32(s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseattribute() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 91) {
      s1 = peg$c35;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c36);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsetext();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 93) {
          s3 = peg$c37;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c38);
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c39(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parseattributeIs() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 91) {
      s1 = peg$c35;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c36);
      }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseident();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 126) {
          s3 = peg$c6;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) {
            peg$fail(peg$c7);
          }
        }
        if (s3 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 124) {
            s3 = peg$c40;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c41);
            }
          }
          if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 94) {
              s3 = peg$c42;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) {
                peg$fail(peg$c43);
              }
            }
            if (s3 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 36) {
                s3 = peg$c44;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c45);
                }
              }
              if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 42) {
                  s3 = peg$c18;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) {
                    peg$fail(peg$c19);
                  }
                }
              }
            }
          }
        }
        if (s3 === peg$FAILED) {
          s3 = null;
        }
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 61) {
            s4 = peg$c46;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c47);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsetext();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 93) {
                s6 = peg$c37;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c38);
                }
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c48(s2, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsepseudo() {
    var s0, s1, s2, s3;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 58) {
      s1 = peg$c49;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c50);
      }
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 58) {
        s2 = peg$c49;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c50);
        }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseident();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c51(s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  function peg$parsepseudoSpecial() {
    var s0, s1, s2, s3, s4, s5, s6;
    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 58) {
      s1 = peg$c49;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) {
        peg$fail(peg$c50);
      }
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 58) {
        s2 = peg$c49;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) {
          peg$fail(peg$c50);
        }
      }
      if (s2 === peg$FAILED) {
        s2 = null;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseident();
        if (s3 !== peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 40) {
            s4 = peg$c52;
            peg$currPos++;
          } else {
            s4 = peg$FAILED;
            if (peg$silentFails === 0) {
              peg$fail(peg$c53);
            }
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parsetext();
            if (s5 === peg$FAILED) {
              s5 = null;
            }
            if (s5 !== peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 41) {
                s6 = peg$c54;
                peg$currPos++;
              } else {
                s6 = peg$FAILED;
                if (peg$silentFails === 0) {
                  peg$fail(peg$c55);
                }
              }
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c56(s3, s5);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    return s0;
  }
  peg$result = peg$startRuleFunction();
  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }
    throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1) : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
  }
}
var parser = {
  SyntaxError: peg$SyntaxError,
  parse: peg$parse
};

var family = function () {
  placebo.addPseudoBehavior('empty', function (e) {
    if (e.children.length > 0) {
      for (var c = 0; c < e.children.length; c += 1) {
        e.children[c].parentNode.removeChild(e.children[c]);
      }
    }
  });
  placebo.addPseudoBehavior('first-of-type', function (e) {
    var parent = e.parentNode;
    var ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    parent.insertBefore(e, ofType[0]);
  });
  placebo.addPseudoBehavior('last-child', function (e) {
    var parent = e.parentNode;
    parent.removeChild(e);
    parent.appendChild(e);
  });
  placebo.addPseudoBehavior('last-of-type', function (e) {
    var parent = e.parentNode;
    var ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    parent.insertBefore(e, ofType[ofType.length - 1].nextSibling);
  });
  placebo.addPseudoBehavior('nth-child', function (e, v) {
    var parent = e.parentNode;
    parent.removeChild(e);
    if (parent.children[Number(v) - 1]) {
      parent.insertBefore(e, parent.children[Number(v) - 1]);
    } else {
      parent.appendChild(e);
    }
  });
  placebo.addPseudoBehavior('nth-last-child', function (e, v) {
    var parent = e.parentNode;
    parent.removeChild(e);
    if (parent.children[parent.children.length - (Number(v) - 1)]) {
      parent.insertBefore(e, parent.children[parent.children.length - (Number(v) - 1)]);
    } else {
      parent.insertBefore(e, parent.children[0]);
    }
  });
  placebo.addPseudoBehavior('nth-last-of-type', function (e, v) {
    var parent = e.parentNode;
    var ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    if (ofType[ofType.length - (Number(v) - 1)]) {
      parent.insertBefore(e, ofType[ofType.length - (Number(v) - 1)]);
    } else {
      parent.appendChild(e);
    }
  });
  placebo.addPseudoBehavior('nth-of-type', function (e, v) {
    var parent = e.parentNode;
    var ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    if (ofType[Number(v) - 1]) {
      if (ofType[Number(v) - 1].nextSibling) {
        parent.insertBefore(e, ofType[Number(v) - 1].nextSibling);
      } else {
        parent.appendChild(e);
      }
    } else {
      parent.insertBefore(e, ofType[ofType.length - 1].nextSibling);
    }
  });
  placebo.addPseudoBehavior('only-of-type', function (e) {
    var parent = e.parentNode;
    var ofType = parent.getElementsByTagName(e.nodeName);
    for (var i = 0; i < ofType.length; i += 1) {
      if (ofType[i].nodeID !== e.nodeID) {
        parent.removeChild(ofType[i]);
      }
    }
  });
  placebo.addPseudoBehavior('only-child', function (e) {
    var parent = e.parentNode;
    while (parent.children.length > 0) {
      parent.removeChild(parent.children[0]);
    }
    parent.appendChild(e);
  });
}

var input = function () {
  placebo.addPseudoBehavior('checked', function (e) {
    e.checked = true;
    e.setAttribute('checked', '');
  });
  placebo.addPseudoBehavior('disabled', function (e) {
    e.disabled = true;
    e.setAttribute('disabled', '');
  });
  placebo.addPseudoBehavior('enabled', function (e) {
    e.disabled = false;
    e.removeAttribute('disabled');
  });
  placebo.addPseudoBehavior('in-range', function (e) {
    var min = 0;
    var max = 100;
    var value = 50;
    if (e.attributes.min) {
      min = Number(e.attributes.min);
    }
    if (e.attributes.max) {
      max = Number(e.attributes.max);
    }
    value = Math.floor(Math.random() * (max - min + 1) + min);
    e.value = value;
    e.setAttribute('value', value);
  });
  placebo.addPseudoBehavior('optional', function (e) {
    e.required = false;
    e.removeAttribute('required');
  });
  placebo.addPseudoBehavior('out-of-range', function (e) {
    var min = 0;
    var max = 100;
    var value = 101;
    if (e.min) {
      min = Number(e.min);
    }
    if (e.max) {
      max = Number(e.max);
    }
    if (Math.floor(Math.random() * (max - min - 1) + min) % 2 === 0) {
      value = Math.floor(Math.random() * (min * -1 - min - 1) + max * -1);
    } else {
      value = Math.floor(Math.random() * (max * 2 - max - 1) + max * 2);
    }
    e.value = value;
    e.setAttribute('value', value);
  });
  placebo.addPseudoBehavior('read-only', function (e) {
    e.readonly = true;
    e.setAttribute('read-only', '');
  });
  placebo.addPseudoBehavior('read-write', function (e) {
    e.readonly = false;
    e.removeAttribute('read-only');
  });
  placebo.addPseudoBehavior('required', function (e) {
    e.required = true;
    e.setAttribute('required', '');
  });
}

var text = function () {
  var texts = {
    before: [],
    middle: [],
    after: []
  };
  placebo.addPseudoBehavior('after', function (e, v) {
    texts.after.push([e, v]);
  });
  placebo.addPseudoBehavior('before', function (e, v) {
    texts.before.splice(0, 0, [e, v]);
  });
  placebo.addPseudoBehavior('first-letter', function (e, v) {
    var text = new Element('#TEXT');
    text.innerText = v[0] + e.innerText.substr(1);
    e.appendChild(text);
  });
  placebo.addPseudoBehavior('lang', function (e, v) {
    e.lang = v;
    e.setAttribute('lang', v);
  });
  placebo.addPseudoBehavior('text', function (e, v) {
    texts.middle.push([e, v]);
  });
  placebo.onPseudoDone(function () {
    var text = void 0;
    for (var b = 0; b < texts.before.length; b += 1) {
      text = new Element('#TEXT');
      text.innerText = texts.before[b][1];
      texts.before[b][0].appendChild(text);
    }
    for (var m = 0; m < texts.middle.length; m += 1) {
      text = new Element('#TEXT');
      text.innerText = texts.middle[m][1];
      texts.middle[m][0].appendChild(text);
    }
    for (var a = 0; a < texts.after.length; a += 1) {
      text = new Element('#TEXT');
      text.innerText = texts.after[a][1];
      texts.after[a][0].appendChild(text);
    }
    texts.before = [];
    texts.middle = [];
    texts.after = [];
  });
}

function placebo(selector) {
  var parsed = parser.parse(selector);
  var built = builder.build(parsed);
  for (var i = 0; i < builder.pseudoSelectorsQueue.length; i += 1) {
    var item = builder.pseudoSelectorsQueue[i];
    builder.pseudoSelectors[item[0]](item[1], item[2]);
  }
  for (var a = 0; a < builder.pseudoSelectorsDone.length; a += 1) {
    builder.pseudoSelectorsDone[a]();
  }
  return new Factory(built);
}
placebo.addPseudoBehavior = addPseudoBehavior;
placebo.onPseudoDone = onPseudoDone;
placebo.version = version;
placebo.plugin = function plugin(factory) {
  factory(placebo);
  return placebo;
};
family();
input();
text();

return placebo;

})));
