/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

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
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
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
      peg$startRuleFunction  = peg$parsestart,

      peg$c0 = " ",
      peg$c1 = peg$literalExpectation(" ", false),
      peg$c2 = ",",
      peg$c3 = peg$literalExpectation(",", false),
      peg$c4 = "+",
      peg$c5 = peg$literalExpectation("+", false),
      peg$c6 = "~",
      peg$c7 = peg$literalExpectation("~", false),
      peg$c8 = function(node) {return node},
      peg$c9 = function(first, rest) {return [first].concat(rest)},
      peg$c10 = /^[a-zA-Z_]/,
      peg$c11 = peg$classExpectation([["a", "z"], ["A", "Z"], "_"], false, false),
      peg$c12 = /^[a-zA-Z0-9_\-]/,
      peg$c13 = peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", "-"], false, false),
      peg$c14 = "-",
      peg$c15 = peg$literalExpectation("-", false),
      peg$c16 = function(hyphen, first, rest) {return hyphen||"" + first + rest.join("")},
      peg$c17 = function(name) {return name.join("")},
      peg$c18 = "*",
      peg$c19 = peg$literalExpectation("*", false),
      peg$c20 = function(name) {return name},
      peg$c21 = /^[^)\]]/,
      peg$c22 = peg$classExpectation([")", "]"], true, false),
      peg$c23 = function(text) {return text.join("")},
      peg$c24 = function(node, extra) {return {node:node||"div",extra:extra}},
      peg$c25 = function(node, extra) {return {node:node,extra:extra}},
      peg$c26 = ".",
      peg$c27 = peg$literalExpectation(".", false),
      peg$c28 = function(name) {return {"name":"class","value":name}},
      peg$c29 = "#",
      peg$c30 = peg$literalExpectation("#", false),
      peg$c31 = function(name) {return {"name":"id","value":name}},
      peg$c32 = function(child) {return {"name":"child","value":child}},
      peg$c33 = ">",
      peg$c34 = peg$literalExpectation(">", false),
      peg$c35 = "[",
      peg$c36 = peg$literalExpectation("[", false),
      peg$c37 = "]",
      peg$c38 = peg$literalExpectation("]", false),
      peg$c39 = function(name) {return {"name":"attribute","value":[name, ""]}},
      peg$c40 = "|",
      peg$c41 = peg$literalExpectation("|", false),
      peg$c42 = "^",
      peg$c43 = peg$literalExpectation("^", false),
      peg$c44 = "$",
      peg$c45 = peg$literalExpectation("$", false),
      peg$c46 = "=",
      peg$c47 = peg$literalExpectation("=", false),
      peg$c48 = function(name, value) {return {"name":"attribute","value":[name, value||""]}},
      peg$c49 = ":",
      peg$c50 = peg$literalExpectation(":", false),
      peg$c51 = function(name) {return {"name":"pseudo","value":[name,null]}},
      peg$c52 = "(",
      peg$c53 = peg$literalExpectation("(", false),
      peg$c54 = ")",
      peg$c55 = peg$literalExpectation(")", false),
      peg$c56 = function(name, value) {return {"name":"pseudo","value":[name, value]}},

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

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
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

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
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
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
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

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
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
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
      if (peg$silentFails === 0) { peg$fail(peg$c1); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c3); }
      }
      if (s2 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 43) {
          s2 = peg$c4;
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c5); }
        }
        if (s2 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 126) {
            s2 = peg$c6;
            peg$currPos++;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c7); }
          }
        }
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c0;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c1); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c1); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c11); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c13); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c15); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c19); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c22); }
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        if (peg$c21.test(input.charAt(peg$currPos))) {
          s2 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s2 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c22); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c1); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c27); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c30); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c1); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c1); }
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
        if (peg$silentFails === 0) { peg$fail(peg$c34); }
      }
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 32) {
          s3 = peg$c0;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c1); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c36); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsetext();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 93) {
          s3 = peg$c37;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c38); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c36); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseident();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 126) {
          s3 = peg$c6;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c7); }
        }
        if (s3 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 124) {
            s3 = peg$c40;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c41); }
          }
          if (s3 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 94) {
              s3 = peg$c42;
              peg$currPos++;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c43); }
            }
            if (s3 === peg$FAILED) {
              if (input.charCodeAt(peg$currPos) === 36) {
                s3 = peg$c44;
                peg$currPos++;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c45); }
              }
              if (s3 === peg$FAILED) {
                if (input.charCodeAt(peg$currPos) === 42) {
                  s3 = peg$c18;
                  peg$currPos++;
                } else {
                  s3 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c19); }
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
            if (peg$silentFails === 0) { peg$fail(peg$c47); }
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
                if (peg$silentFails === 0) { peg$fail(peg$c38); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c50); }
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 58) {
        s2 = peg$c49;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c50); }
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
      if (peg$silentFails === 0) { peg$fail(peg$c50); }
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 58) {
        s2 = peg$c49;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c50); }
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
            if (peg$silentFails === 0) { peg$fail(peg$c53); }
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
                if (peg$silentFails === 0) { peg$fail(peg$c55); }
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

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};
