/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://enderjs.com)
  * Build: ender build placebo-js
  * Packages: ender-core@2.0.0 ender-commonjs@1.0.8 placebo-js@1.0.0
  * =============================================================
  */

(function () {

  /*!
    * Ender: open module JavaScript framework (client-lib)
    * http://enderjs.com
    * License MIT
    */
  
  /**
   * @constructor
   * @param  {*=}      item      selector|node|collection|callback|anything
   * @param  {Object=} root      node(s) from which to base selector queries
   */
  function Ender(item, root) {
    var i
    this.length = 0 // Ensure that instance owns length
  
    if (typeof item == 'string')
      // start with strings so the result parlays into the other checks
      // the .selector prop only applies to strings
      item = ender._select(this['selector'] = item, root)
  
    if (null == item) return this // Do not wrap null|undefined
  
    if (typeof item == 'function') ender._closure(item, root)
  
    // DOM node | scalar | not array-like
    else if (typeof item != 'object' || item.nodeType || (i = item.length) !== +i || item == item.window)
      this[this.length++] = item
  
    // array-like - bitwise ensures integer length
    else for (this.length = i = (i > 0 ? ~~i : 0); i--;)
      this[i] = item[i]
  }
  
  /**
   * @param  {*=}      item   selector|node|collection|callback|anything
   * @param  {Object=} root   node(s) from which to base selector queries
   * @return {Ender}
   */
  function ender(item, root) {
    return new Ender(item, root)
  }
  
  
  /**
   * @expose
   * sync the prototypes for jQuery compatibility
   */
  ender.fn = ender.prototype = Ender.prototype
  
  /**
   * @enum {number}  protects local symbols from being overwritten
   */
  ender._reserved = {
    reserved: 1,
    ender: 1,
    expose: 1,
    noConflict: 1,
    fn: 1
  }
  
  /**
   * @expose
   * handy reference to self
   */
  Ender.prototype.$ = ender
  
  /**
   * @expose
   * make webkit dev tools pretty-print ender instances like arrays
   */
  Ender.prototype.splice = function () { throw new Error('Not implemented') }
  
  /**
   * @expose
   * @param   {function(*, number, Ender)}  fn
   * @param   {object=}                     scope
   * @return  {Ender}
   */
  Ender.prototype.forEach = function (fn, scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }
  
  /**
   * @expose
   * @param {object|function} o
   * @param {boolean=}        chain
   */
  ender.ender = function (o, chain) {
    var o2 = chain ? Ender.prototype : ender
    for (var k in o) !(k in ender._reserved) && (o2[k] = o[k])
    return o2
  }
  
  /**
   * @expose
   * @param {string}  s
   * @param {Node=}   r
   */
  ender._select = function (s, r) {
    return s ? (r || document).querySelectorAll(s) : []
  }
  
  /**
   * @expose
   * @param {function} fn
   */
  ender._closure = function (fn) {
    fn.call(document, ender)
  }
  
  if (typeof module !== 'undefined' && module['exports']) module['exports'] = ender
  var $ = ender
  
  /**
   * @expose
   * @param {string} name
   * @param {*}      value
   */
  ender.expose = function (name, value) {
    ender.expose.old[name] = window[name]
    window[name] = value
  }
  
  /**
   * @expose
   */
  ender.expose.old = {}
  
  /**
   * @expose
   * @param {boolean} all   restore only $ or all ender globals
   */
  ender.noConflict = function (all) {
    window['$'] = ender.expose.old['$']
    if (all) for (var k in ender.expose.old) window[k] = ender.expose.old[k]
    return this
  }
  
  ender.expose('$', ender)
  ender.expose('ender', ender); // uglify needs this semi-colon between concating files
  
  /*!
    * Ender: open module JavaScript framework (module-lib)
    * http://enderjs.com
    * License MIT
    */
  
  var global = this
  
  /**
   * @param  {string}  id   module id to load
   * @return {object}
   */
  function require(id) {
    if ('$' + id in require._cache)
      return require._cache['$' + id]
    if ('$' + id in require._modules)
      return (require._cache['$' + id] = require._modules['$' + id]._load())
    if (id in window)
      return window[id]
  
    throw new Error('Requested module "' + id + '" has not been defined.')
  }
  
  /**
   * @param  {string}  id       module id to provide to require calls
   * @param  {object}  exports  the exports object to be returned
   */
  function provide(id, exports) {
    return (require._cache['$' + id] = exports)
  }
  
  /**
   * @expose
   * @dict
   */
  require._cache = {}
  
  /**
   * @expose
   * @dict
   */
  require._modules = {}
  
  /**
   * @constructor
   * @param  {string}                                          id   module id for this module
   * @param  {function(Module, object, function(id), object)}  fn   module definition
   */
  function Module(id, fn) {
    this.id = id
    this.fn = fn
    require._modules['$' + id] = this
  }
  
  /**
   * @expose
   * @param  {string}  id   module id to load from the local module context
   * @return {object}
   */
  Module.prototype.require = function (id) {
    var parts, i
  
    if (id.charAt(0) == '.') {
      parts = (this.id.replace(/\/.*?$/, '/') + id.replace(/\.js$/, '')).split('/')
  
      while (~(i = parts.indexOf('.')))
        parts.splice(i, 1)
  
      while ((i = parts.lastIndexOf('..')) > 0)
        parts.splice(i - 1, 2)
  
      id = parts.join('/')
    }
  
    return require(id)
  }
  
  /**
   * @expose
   * @return {object}
   */
   Module.prototype._load = function () {
     var m = this
     var dotdotslash = /^\.\.\//g
     var dotslash = /^\.\/[^\/]+$/g
     if (!m._loaded) {
       m._loaded = true
  
       /**
        * @expose
        */
       m.exports = {}
       m.fn.call(global, m, m.exports, function (id) {
         if (id.match(dotdotslash)) {
           id = m.id.replace(/[^\/]+\/[^\/]+$/, '') + id.replace(dotdotslash, '')
         }
         else if (id.match(dotslash)) {
           id = m.id.replace(/\/[^\/]+$/, '') + id.replace('.', '')
         }
         return m.require(id)
       }, global)
     }
  
     return m.exports
   }
  
  /**
   * @expose
   * @param  {string}                     id        main module id
   * @param  {Object.<string, function>}  modules   mapping of module ids to definitions
   * @param  {string}                     main      the id of the main module
   */
  Module.createPackage = function (id, modules, main) {
    var path, m
  
    for (path in modules) {
      new Module(id + '/' + path, modules[path])
      if (m = path.match(/^(.+)\/index$/)) new Module(id + '/' + m[1], modules[path])
    }
  
    if (main) require._modules['$' + id] = require._modules['$' + id + '/' + main]
  }
  
  if (ender && ender.expose) {
    /*global global,require,provide,Module */
    ender.expose('global', global)
    ender.expose('require', require)
    ender.expose('provide', provide)
    ender.expose('Module', Module)
  }
  
  Module.createPackage('placebo-js', {
    'placebo': function (module, exports, require, global) {
      (function (context) {      
          'use strict';      
          var parser = (function () {      
                  /*      
                   * Generated by PEG.js 0.8.0.      
                   *      
                   * http://pegjs.majda.cz/      
                   */      
            
                  function peg$subclass(child, parent) {      
                      function Ctor() {      
                          this.constructor = child;      
                      }      
                      Ctor.prototype = parent.prototype;      
                      child.prototype = new Ctor();      
                  }      
            
                  function SyntaxError(message, expected, found, offset, line, column) {      
                      this.message = message;      
                      this.expected = expected;      
                      this.found = found;      
                      this.offset = offset;      
                      this.line = line;      
                      this.column = column;      
            
                      this.name = "SyntaxError";      
                  }      
            
                  peg$subclass(SyntaxError, Error);      
            
                  function parse(input) {      
                      var options = arguments.length > 1 ? arguments[1] : {},      
            
                          peg$FAILED = {},      
            
                          peg$startRuleFunctions = {      
                              start: peg$parsestart      
                          },      
                          peg$startRuleFunction = peg$parsestart,      
            
                          peg$c0 = peg$FAILED,      
                          peg$c1 = null,      
                          peg$c2 = function (e, extra) {      
                              return {      
                                  "node": e.join("") || "div",      
                                  "extra": extra      
                              };      
                          },      
                          peg$c3 = /^[^.#,>+~[\]|=\^$*:)( ]/,      
                          peg$c4 = {      
                              type: "class",      
                              value: "[^.#,>+~[\\]|=\\^$*:)( ]",      
                              description: "[^.#,>+~[\\]|=\\^$*:)( ]"      
                          },      
                          peg$c5 = [],      
                          peg$c6 = "*",      
                          peg$c7 = {      
                              type: "literal",      
                              value: "*",      
                              description: "\"*\""      
                          },      
                          peg$c8 = function (node) {      
                              return node;      
                          },      
                          peg$c9 = ":",      
                          peg$c10 = {      
                              type: "literal",      
                              value: ":",      
                              description: "\":\""      
                          },      
                          peg$c11 = "active",      
                          peg$c12 = {      
                              type: "literal",      
                              value: "active",      
                              description: "\"active\""      
                          },      
                          peg$c13 = "after",      
                          peg$c14 = {      
                              type: "literal",      
                              value: "after",      
                              description: "\"after\""      
                          },      
                          peg$c15 = "before",      
                          peg$c16 = {      
                              type: "literal",      
                              value: "before",      
                              description: "\"before\""      
                          },      
                          peg$c17 = "checked",      
                          peg$c18 = {      
                              type: "literal",      
                              value: "checked",      
                              description: "\"checked\""      
                          },      
                          peg$c19 = "disabled",      
                          peg$c20 = {      
                              type: "literal",      
                              value: "disabled",      
                              description: "\"disabled\""      
                          },      
                          peg$c21 = "empty",      
                          peg$c22 = {      
                              type: "literal",      
                              value: "empty",      
                              description: "\"empty\""      
                          },      
                          peg$c23 = "enabled",      
                          peg$c24 = {      
                              type: "literal",      
                              value: "enabled",      
                              description: "\"enabled\""      
                          },      
                          peg$c25 = "first-child",      
                          peg$c26 = {      
                              type: "literal",      
                              value: "first-child",      
                              description: "\"first-child\""      
                          },      
                          peg$c27 = "first-letter",      
                          peg$c28 = {      
                              type: "literal",      
                              value: "first-letter",      
                              description: "\"first-letter\""      
                          },      
                          peg$c29 = "first-line",      
                          peg$c30 = {      
                              type: "literal",      
                              value: "first-line",      
                              description: "\"first-line\""      
                          },      
                          peg$c31 = "first-of-type",      
                          peg$c32 = {      
                              type: "literal",      
                              value: "first-of-type",      
                              description: "\"first-of-type\""      
                          },      
                          peg$c33 = "focus",      
                          peg$c34 = {      
                              type: "literal",      
                              value: "focus",      
                              description: "\"focus\""      
                          },      
                          peg$c35 = "hover",      
                          peg$c36 = {      
                              type: "literal",      
                              value: "hover",      
                              description: "\"hover\""      
                          },      
                          peg$c37 = "in-range",      
                          peg$c38 = {      
                              type: "literal",      
                              value: "in-range",      
                              description: "\"in-range\""      
                          },      
                          peg$c39 = "invalid",      
                          peg$c40 = {      
                              type: "literal",      
                              value: "invalid",      
                              description: "\"invalid\""      
                          },      
                          peg$c41 = "last-child",      
                          peg$c42 = {      
                              type: "literal",      
                              value: "last-child",      
                              description: "\"last-child\""      
                          },      
                          peg$c43 = "last-of-type",      
                          peg$c44 = {      
                              type: "literal",      
                              value: "last-of-type",      
                              description: "\"last-of-type\""      
                          },      
                          peg$c45 = "link",      
                          peg$c46 = {      
                              type: "literal",      
                              value: "link",      
                              description: "\"link\""      
                          },      
                          peg$c47 = "only-of-type",      
                          peg$c48 = {      
                              type: "literal",      
                              value: "only-of-type",      
                              description: "\"only-of-type\""      
                          },      
                          peg$c49 = "only-child",      
                          peg$c50 = {      
                              type: "literal",      
                              value: "only-child",      
                              description: "\"only-child\""      
                          },      
                          peg$c51 = "optional",      
                          peg$c52 = {      
                              type: "literal",      
                              value: "optional",      
                              description: "\"optional\""      
                          },      
                          peg$c53 = "out-of-range",      
                          peg$c54 = {      
                              type: "literal",      
                              value: "out-of-range",      
                              description: "\"out-of-range\""      
                          },      
                          peg$c55 = "read-only",      
                          peg$c56 = {      
                              type: "literal",      
                              value: "read-only",      
                              description: "\"read-only\""      
                          },      
                          peg$c57 = "read-write",      
                          peg$c58 = {      
                              type: "literal",      
                              value: "read-write",      
                              description: "\"read-write\""      
                          },      
                          peg$c59 = "required",      
                          peg$c60 = {      
                              type: "literal",      
                              value: "required",      
                              description: "\"required\""      
                          },      
                          peg$c61 = "root",      
                          peg$c62 = {      
                              type: "literal",      
                              value: "root",      
                              description: "\"root\""      
                          },      
                          peg$c63 = "selection",      
                          peg$c64 = {      
                              type: "literal",      
                              value: "selection",      
                              description: "\"selection\""      
                          },      
                          peg$c65 = "target",      
                          peg$c66 = {      
                              type: "literal",      
                              value: "target",      
                              description: "\"target\""      
                          },      
                          peg$c67 = "valid",      
                          peg$c68 = {      
                              type: "literal",      
                              value: "valid",      
                              description: "\"valid\""      
                          },      
                          peg$c69 = "visited",      
                          peg$c70 = {      
                              type: "literal",      
                              value: "visited",      
                              description: "\"visited\""      
                          },      
                          peg$c71 = function (p, extra) {      
                              var a = {};      
                              a.pseudo = p;      
                              a.extra = extra || {};      
                              return a;      
                          },      
                          peg$c72 = "lang",      
                          peg$c73 = {      
                              type: "literal",      
                              value: "lang",      
                              description: "\"lang\""      
                          },      
                          peg$c74 = "nth-child",      
                          peg$c75 = {      
                              type: "literal",      
                              value: "nth-child",      
                              description: "\"nth-child\""      
                          },      
                          peg$c76 = "nth-last-child",      
                          peg$c77 = {      
                              type: "literal",      
                              value: "nth-last-child",      
                              description: "\"nth-last-child\""      
                          },      
                          peg$c78 = "nth-last-of-type",      
                          peg$c79 = {      
                              type: "literal",      
                              value: "nth-last-of-type",      
                              description: "\"nth-last-of-type\""      
                          },      
                          peg$c80 = "nth-of-type",      
                          peg$c81 = {      
                              type: "literal",      
                              value: "nth-of-type",      
                              description: "\"nth-of-type\""      
                          },      
                          peg$c82 = "(",      
                          peg$c83 = {      
                              type: "literal",      
                              value: "(",      
                              description: "\"(\""      
                          },      
                          peg$c84 = /^[0-9]/,      
                          peg$c85 = {      
                              type: "class",      
                              value: "[0-9]",      
                              description: "[0-9]"      
                          },      
                          peg$c86 = ")",      
                          peg$c87 = {      
                              type: "literal",      
                              value: ")",      
                              description: "\")\""      
                          },      
                          peg$c88 = function (p, v, extra) {      
                              var a = {};      
                              a.pseudo = p;      
                              a.value = v.join("");      
                              a.extra = extra || {};      
                              return a;      
                          },      
                          peg$c89 = "not",      
                          peg$c90 = {      
                              type: "literal",      
                              value: "not",      
                              description: "\"not\""      
                          },      
                          peg$c91 = function (p, e, v, extra) {      
                              var a = {};      
                              a.pseudo = p;      
                              a.value = {};      
                              a.value.node = e.join("") || "div";      
                              a.value.extra = v;      
                              a.extra = extra || {};      
                              return a;      
                          },      
                          peg$c92 = "[",      
                          peg$c93 = {      
                              type: "literal",      
                              value: "[",      
                              description: "\"[\""      
                          },      
                          peg$c94 = "]",      
                          peg$c95 = {      
                              type: "literal",      
                              value: "]",      
                              description: "\"]\""      
                          },      
                          peg$c96 = function (cond, extra) {      
                              cond.extra = extra || {};      
                              return cond;      
                          },      
                          peg$c97 = ".",      
                          peg$c98 = {      
                              type: "literal",      
                              value: ".",      
                              description: "\".\""      
                          },      
                          peg$c99 = function (val, extra) {      
                              return {      
                                  "class": val.join(""),      
                                  "extra": extra || {}      
                              };      
                          },      
                          peg$c100 = "#",      
                          peg$c101 = {      
                              type: "literal",      
                              value: "#",      
                              description: "\"#\""      
                          },      
                          peg$c102 = function (val, extra) {      
                              return {      
                                  "id": val.join(""),      
                                  "extra": extra || {}      
                              };      
                          },      
                          peg$c103 = " ",      
                          peg$c104 = {      
                              type: "literal",      
                              value: " ",      
                              description: "\" \""      
                          },      
                          peg$c105 = ",",      
                          peg$c106 = {      
                              type: "literal",      
                              value: ",",      
                              description: "\",\""      
                          },      
                          peg$c107 = function (e, extra) {      
                              return {      
                                  "node": e.join(""),      
                                  "extra": extra || {}      
                              };      
                          },      
                          peg$c108 = function (e, extra) {      
                              return {      
                                  "contains": e.join(""),      
                                  "extra": extra || {}      
                              };      
                          },      
                          peg$c109 = ">",      
                          peg$c110 = {      
                              type: "literal",      
                              value: ">",      
                              description: "\">\""      
                          },      
                          peg$c111 = function (e, extra) {      
                              return {      
                                  "child": e.join(""),      
                                  "extra": extra || {}      
                              };      
                          },      
                          peg$c112 = "+",      
                          peg$c113 = {      
                              type: "literal",      
                              value: "+",      
                              description: "\"+\""      
                          },      
                          peg$c114 = function (e, extra) {      
                              return {      
                                  "immediate_child": e.join(""),      
                                  "extra": extra || {}      
                              };      
                          },      
                          peg$c115 = "~",      
                          peg$c116 = {      
                              type: "literal",      
                              value: "~",      
                              description: "\"~\""      
                          },      
                          peg$c117 = function (e, extra) {      
                              return {      
                                  "after": e.join(""),      
                                  "extra": extra || {}      
                              };      
                          },      
                          peg$c118 = function (attr) {      
                              return {      
                                  "attr": attr.join("")      
                              };      
                          },      
                          peg$c119 = "=",      
                          peg$c120 = {      
                              type: "literal",      
                              value: "=",      
                              description: "\"=\""      
                          },      
                          peg$c121 = function (attr, val) {      
                              return {      
                                  "attr_is": attr.join(""),      
                                  "value": val.join("")      
                              };      
                          },      
                          peg$c122 = "~=",      
                          peg$c123 = {      
                              type: "literal",      
                              value: "~=",      
                              description: "\"~=\""      
                          },      
                          peg$c124 = function (attr, val) {      
                              return {      
                                  "attr_has_word": attr.join(""),      
                                  "value": val.join("")      
                              };      
                          },      
                          peg$c125 = "|=",      
                          peg$c126 = {      
                              type: "literal",      
                              value: "|=",      
                              description: "\"|=\""      
                          },      
                          peg$c127 = function (attr, val) {      
                              return {      
                                  "attr_starts_hyphen": attr.join(""),      
                                  "value": val.join("")      
                              };      
                          },      
                          peg$c128 = "^=",      
                          peg$c129 = {      
                              type: "literal",      
                              value: "^=",      
                              description: "\"^=\""      
                          },      
                          peg$c130 = function (attr, val) {      
                              return {      
                                  "attr_starts": attr.join(""),      
                                  "value": val.join("")      
                              };      
                          },      
                          peg$c131 = "$=",      
                          peg$c132 = {      
                              type: "literal",      
                              value: "$=",      
                              description: "\"$=\""      
                          },      
                          peg$c133 = function (attr, val) {      
                              return {      
                                  "attr_ends": attr.join(""),      
                                  "value": val.join("")      
                              };      
                          },      
                          peg$c134 = "*=",      
                          peg$c135 = {      
                              type: "literal",      
                              value: "*=",      
                              description: "\"*=\""      
                          },      
                          peg$c136 = function (attr, val) {      
                              return {      
                                  "attr_has": attr.join(""),      
                                  "value": val.join("")      
                              };      
                          },      
            
                          peg$currPos = 0,      
                          peg$reportedPos = 0,      
                          peg$cachedPos = 0,      
                          peg$cachedPosDetails = {      
                              line: 1,      
                              column: 1,      
                              seenCR: false      
                          },      
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
                          return input.substring(peg$reportedPos, peg$currPos);      
                      }      
            
                      function offset() {      
                          return peg$reportedPos;      
                      }      
            
                      function line() {      
                          return peg$computePosDetails(peg$reportedPos).line;      
                      }      
            
                      function column() {      
                          return peg$computePosDetails(peg$reportedPos).column;      
                      }      
            
                      function expected(description) {      
                          throw peg$buildException(      
                              null,      
                              [{      
                                  type: "other",      
                                  description: description      
                              }],      
                              peg$reportedPos      
                          );      
                      }      
            
                      function error(message) {      
                          throw peg$buildException(message, null, peg$reportedPos);      
                      }      
            
                      function peg$computePosDetails(pos) {      
                          function advance(details, startPos, endPos) {      
                              var p, ch;      
            
                              for (p = startPos; p < endPos; p += 1) {      
                                  ch = input.charAt(p);      
                                  if (ch === "\n") {      
                                      if (!details.seenCR) {      
                                          details.line += 1;      
                                      }      
                                      details.column = 1;      
                                      details.seenCR = false;      
                                  } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {      
                                      details.line += 1;      
                                      details.column = 1;      
                                      details.seenCR = true;      
                                  } else {      
                                      details.column += 1;      
                                      details.seenCR = false;      
                                  }      
                              }      
                          }      
            
                          if (peg$cachedPos !== pos) {      
                              if (peg$cachedPos > pos) {      
                                  peg$cachedPos = 0;      
                                  peg$cachedPosDetails = {      
                                      line: 1,      
                                      column: 1,      
                                      seenCR: false      
                                  };      
                              }      
                              advance(peg$cachedPosDetails, peg$cachedPos, pos);      
                              peg$cachedPos = pos;      
                          }      
            
                          return peg$cachedPosDetails;      
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
            
                      function peg$buildException(message, expected, pos) {      
                          function cleanupExpected(expected) {      
                              var i = 1;      
            
                              expected.sort(function (a, b) {      
                                  if (a.description < b.description) {      
                                      return -1;      
                                  } else if (a.description > b.description) {      
                                      return 1;      
                                  } else {      
                                      return 0;      
                                  }      
                              });      
            
                              while (i < expected.length) {      
                                  if (expected[i - 1] === expected[i]) {      
                                      expected.splice(i, 1);      
                                  } else {      
                                      i += 1;      
                                  }      
                              }      
                          }      
            
                          function buildMessage(expected, found) {      
                              function stringEscape(s) {      
                                  function hex(ch) {      
                                      return ch.charCodeAt(0).toString(16).toUpperCase();      
                                  }      
            
                                  return s      
                                      .replace(/\\/g, '\\\\')      
                                      .replace(/"/g, '\\"')      
                                      .replace(/\x08/g, '\\b')      
                                      .replace(/\t/g, '\\t')      
                                      .replace(/\n/g, '\\n')      
                                      .replace(/\f/g, '\\f')      
                                      .replace(/\r/g, '\\r')      
                                      .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function (ch) {      
                                          return '\\x0' + hex(ch);      
                                      })      
                                      .replace(/[\x10-\x1F\x80-\xFF]/g, function (ch) {      
                                          return '\\x' + hex(ch);      
                                      })      
                                      .replace(/[\u0180-\u0FFF]/g, function (ch) {      
                                          return '\\u0' + hex(ch);      
                                      })      
                                      .replace(/[\u1080-\uFFFF]/g, function (ch) {      
                                          return '\\u' + hex(ch);      
                                      });      
                              }      
            
                              var expectedDescs = new Array(expected.length),      
                                  expectedDesc,      
                                  foundDesc,      
                                  i;      
            
                              for (i = 0; i < expected.length; i++) {      
                                  expectedDescs[i] = expected[i].description;      
                              }      
            
                              expectedDesc = expected.length > 1 ? expectedDescs.slice(0, -1).join(", ") + " or " + expectedDescs[expected.length - 1] : expectedDescs[0];      
            
                              foundDesc = found ? "\"" + stringEscape(found) + "\"" : "end of input";      
            
                              return "Expected " + expectedDesc + " but " + foundDesc + " found.";      
                          }      
            
                          var posDetails = peg$computePosDetails(pos),      
                              found = pos < input.length ? input.charAt(pos) : null;      
            
                          if (expected !== null) {      
                              cleanupExpected(expected);      
                          }      
            
                          return new SyntaxError(      
                              message !== null ? message : buildMessage(expected, found),      
                              expected,      
                              found,      
                              pos,      
                              posDetails.line,      
                              posDetails.column      
                          );      
                      }      
            
                      function peg$parsestart() {      
                          var s0, s1, s2;      
            
                          s0 = peg$currPos;      
                          s1 = peg$parseelement();      
                          if (s1 === peg$FAILED) {      
                              s1 = peg$c1;      
                          }      
                          if (s1 !== peg$FAILED) {      
                              s2 = peg$parseextra();      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  peg$reportedPos = s0;      
                                  s1 = peg$c2(s1, s2);      
                                  s0 = s1;      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsevalid() {      
                          var s0;      
            
                          if (peg$c3.test(input.charAt(peg$currPos))) {      
                              s0 = input.charAt(peg$currPos);      
                              peg$currPos += 1;      
                          } else {      
                              s0 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c4);      
                              }      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseelement() {      
                          var s0, s1, s2;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          if (s2 === peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 42) {      
                                  s2 = peg$c6;      
                                  peg$currPos += 1;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c7);      
                                  }      
                              }      
                          }      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                              if (s2 === peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 42) {      
                                      s2 = peg$c6;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s2 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c7);      
                                      }      
                                  }      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              peg$reportedPos = s0;      
                              s1 = peg$c8(s1);      
                          }      
                          s0 = s1;      
            
                          return s0;      
                      }      
            
                      function peg$parseextra() {      
                          var s0;      
            
                          s0 = peg$parseattributes();      
                          if (s0 === peg$FAILED) {      
                              s0 = peg$parsepseudo();      
                              if (s0 === peg$FAILED) {      
                                  s0 = peg$parsepseudoSpecial();      
                                  if (s0 === peg$FAILED) {      
                                      s0 = peg$parsepseudoSpecialO();      
                                      if (s0 === peg$FAILED) {      
                                          s0 = peg$parsemulti();      
                                          if (s0 === peg$FAILED) {      
                                              s0 = peg$parsechild();      
                                              if (s0 === peg$FAILED) {      
                                                  s0 = peg$parseichild();      
                                                  if (s0 === peg$FAILED) {      
                                                      s0 = peg$parseafter();      
                                                      if (s0 === peg$FAILED) {      
                                                          s0 = peg$parsecontains();      
                                                          if (s0 === peg$FAILED) {      
                                                              s0 = peg$parsebrackets();      
                                                          }      
                                                      }      
                                                  }      
                                              }      
                                          }      
                                      }      
                                  }      
                              }      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseattributes() {      
                          var s0;      
            
                          s0 = peg$parseclass();      
                          if (s0 === peg$FAILED) {      
                              s0 = peg$parseid();      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsepseudo() {      
                          var s0, s1, s2, s3, s4;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 58) {      
                              s1 = peg$c9;      
                              peg$currPos += 1;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c10);      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 58) {      
                                  s2 = peg$c9;      
                                  peg$currPos += 1;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c10);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.substr(peg$currPos, 6) === peg$c11) {      
                                      s3 = peg$c11;      
                                      peg$currPos += 6;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c12);      
                                      }      
                                  }      
                                  if (s3 === peg$FAILED) {      
                                      if (input.substr(peg$currPos, 5) === peg$c13) {      
                                          s3 = peg$c13;      
                                          peg$currPos += 5;      
                                      } else {      
                                          s3 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c14);      
                                          }      
                                      }      
                                      if (s3 === peg$FAILED) {      
                                          if (input.substr(peg$currPos, 6) === peg$c15) {      
                                              s3 = peg$c15;      
                                              peg$currPos += 6;      
                                          } else {      
                                              s3 = peg$FAILED;      
                                              if (peg$silentFails === 0) {      
                                                  peg$fail(peg$c16);      
                                              }      
                                          }      
                                          if (s3 === peg$FAILED) {      
                                              if (input.substr(peg$currPos, 7) === peg$c17) {      
                                                  s3 = peg$c17;      
                                                  peg$currPos += 7;      
                                              } else {      
                                                  s3 = peg$FAILED;      
                                                  if (peg$silentFails === 0) {      
                                                      peg$fail(peg$c18);      
                                                  }      
                                              }      
                                              if (s3 === peg$FAILED) {      
                                                  if (input.substr(peg$currPos, 8) === peg$c19) {      
                                                      s3 = peg$c19;      
                                                      peg$currPos += 8;      
                                                  } else {      
                                                      s3 = peg$FAILED;      
                                                      if (peg$silentFails === 0) {      
                                                          peg$fail(peg$c20);      
                                                      }      
                                                  }      
                                                  if (s3 === peg$FAILED) {      
                                                      if (input.substr(peg$currPos, 5) === peg$c21) {      
                                                          s3 = peg$c21;      
                                                          peg$currPos += 5;      
                                                      } else {      
                                                          s3 = peg$FAILED;      
                                                          if (peg$silentFails === 0) {      
                                                              peg$fail(peg$c22);      
                                                          }      
                                                      }      
                                                      if (s3 === peg$FAILED) {      
                                                          if (input.substr(peg$currPos, 7) === peg$c23) {      
                                                              s3 = peg$c23;      
                                                              peg$currPos += 7;      
                                                          } else {      
                                                              s3 = peg$FAILED;      
                                                              if (peg$silentFails === 0) {      
                                                                  peg$fail(peg$c24);      
                                                              }      
                                                          }      
                                                          if (s3 === peg$FAILED) {      
                                                              if (input.substr(peg$currPos, 11) === peg$c25) {      
                                                                  s3 = peg$c25;      
                                                                  peg$currPos += 11;      
                                                              } else {      
                                                                  s3 = peg$FAILED;      
                                                                  if (peg$silentFails === 0) {      
                                                                      peg$fail(peg$c26);      
                                                                  }      
                                                              }      
                                                              if (s3 === peg$FAILED) {      
                                                                  if (input.substr(peg$currPos, 12) === peg$c27) {      
                                                                      s3 = peg$c27;      
                                                                      peg$currPos += 12;      
                                                                  } else {      
                                                                      s3 = peg$FAILED;      
                                                                      if (peg$silentFails === 0) {      
                                                                          peg$fail(peg$c28);      
                                                                      }      
                                                                  }      
                                                                  if (s3 === peg$FAILED) {      
                                                                      if (input.substr(peg$currPos, 10) === peg$c29) {      
                                                                          s3 = peg$c29;      
                                                                          peg$currPos += 10;      
                                                                      } else {      
                                                                          s3 = peg$FAILED;      
                                                                          if (peg$silentFails === 0) {      
                                                                              peg$fail(peg$c30);      
                                                                          }      
                                                                      }      
                                                                      if (s3 === peg$FAILED) {      
                                                                          if (input.substr(peg$currPos, 13) === peg$c31) {      
                                                                              s3 = peg$c31;      
                                                                              peg$currPos += 13;      
                                                                          } else {      
                                                                              s3 = peg$FAILED;      
                                                                              if (peg$silentFails === 0) {      
                                                                                  peg$fail(peg$c32);      
                                                                              }      
                                                                          }      
                                                                          if (s3 === peg$FAILED) {      
                                                                              if (input.substr(peg$currPos, 5) === peg$c33) {      
                                                                                  s3 = peg$c33;      
                                                                                  peg$currPos += 5;      
                                                                              } else {      
                                                                                  s3 = peg$FAILED;      
                                                                                  if (peg$silentFails === 0) {      
                                                                                      peg$fail(peg$c34);      
                                                                                  }      
                                                                              }      
                                                                              if (s3 === peg$FAILED) {      
                                                                                  if (input.substr(peg$currPos, 5) === peg$c35) {      
                                                                                      s3 = peg$c35;      
                                                                                      peg$currPos += 5;      
                                                                                  } else {      
                                                                                      s3 = peg$FAILED;      
                                                                                      if (peg$silentFails === 0) {      
                                                                                          peg$fail(peg$c36);      
                                                                                      }      
                                                                                  }      
                                                                                  if (s3 === peg$FAILED) {      
                                                                                      if (input.substr(peg$currPos, 8) === peg$c37) {      
                                                                                          s3 = peg$c37;      
                                                                                          peg$currPos += 8;      
                                                                                      } else {      
                                                                                          s3 = peg$FAILED;      
                                                                                          if (peg$silentFails === 0) {      
                                                                                              peg$fail(peg$c38);      
                                                                                          }      
                                                                                      }      
                                                                                      if (s3 === peg$FAILED) {      
                                                                                          if (input.substr(peg$currPos, 7) === peg$c39) {      
                                                                                              s3 = peg$c39;      
                                                                                              peg$currPos += 7;      
                                                                                          } else {      
                                                                                              s3 = peg$FAILED;      
                                                                                              if (peg$silentFails === 0) {      
                                                                                                  peg$fail(peg$c40);      
                                                                                              }      
                                                                                          }      
                                                                                          if (s3 === peg$FAILED) {      
                                                                                              if (input.substr(peg$currPos, 10) === peg$c41) {      
                                                                                                  s3 = peg$c41;      
                                                                                                  peg$currPos += 10;      
                                                                                              } else {      
                                                                                                  s3 = peg$FAILED;      
                                                                                                  if (peg$silentFails === 0) {      
                                                                                                      peg$fail(peg$c42);      
                                                                                                  }      
                                                                                              }      
                                                                                              if (s3 === peg$FAILED) {      
                                                                                                  if (input.substr(peg$currPos, 12) === peg$c43) {      
                                                                                                      s3 = peg$c43;      
                                                                                                      peg$currPos += 12;      
                                                                                                  } else {      
                                                                                                      s3 = peg$FAILED;      
                                                                                                      if (peg$silentFails === 0) {      
                                                                                                          peg$fail(peg$c44);      
                                                                                                      }      
                                                                                                  }      
                                                                                                  if (s3 === peg$FAILED) {      
                                                                                                      if (input.substr(peg$currPos, 4) === peg$c45) {      
                                                                                                          s3 = peg$c45;      
                                                                                                          peg$currPos += 4;      
                                                                                                      } else {      
                                                                                                          s3 = peg$FAILED;      
                                                                                                          if (peg$silentFails === 0) {      
                                                                                                              peg$fail(peg$c46);      
                                                                                                          }      
                                                                                                      }      
                                                                                                      if (s3 === peg$FAILED) {      
                                                                                                          if (input.substr(peg$currPos, 12) === peg$c47) {      
                                                                                                              s3 = peg$c47;      
                                                                                                              peg$currPos += 12;      
                                                                                                          } else {      
                                                                                                              s3 = peg$FAILED;      
                                                                                                              if (peg$silentFails === 0) {      
                                                                                                                  peg$fail(peg$c48);      
                                                                                                              }      
                                                                                                          }      
                                                                                                          if (s3 === peg$FAILED) {      
                                                                                                              if (input.substr(peg$currPos, 10) === peg$c49) {      
                                                                                                                  s3 = peg$c49;      
                                                                                                                  peg$currPos += 10;      
                                                                                                              } else {      
                                                                                                                  s3 = peg$FAILED;      
                                                                                                                  if (peg$silentFails === 0) {      
                                                                                                                      peg$fail(peg$c50);      
                                                                                                                  }      
                                                                                                              }      
                                                                                                              if (s3 === peg$FAILED) {      
                                                                                                                  if (input.substr(peg$currPos, 8) === peg$c51) {      
                                                                                                                      s3 = peg$c51;      
                                                                                                                      peg$currPos += 8;      
                                                                                                                  } else {      
                                                                                                                      s3 = peg$FAILED;      
                                                                                                                      if (peg$silentFails === 0) {      
                                                                                                                          peg$fail(peg$c52);      
                                                                                                                      }      
                                                                                                                  }      
                                                                                                                  if (s3 === peg$FAILED) {      
                                                                                                                      if (input.substr(peg$currPos, 12) === peg$c53) {      
                                                                                                                          s3 = peg$c53;      
                                                                                                                          peg$currPos += 12;      
                                                                                                                      } else {      
                                                                                                                          s3 = peg$FAILED;      
                                                                                                                          if (peg$silentFails === 0) {      
                                                                                                                              peg$fail(peg$c54);      
                                                                                                                          }      
                                                                                                                      }      
                                                                                                                      if (s3 === peg$FAILED) {      
                                                                                                                          if (input.substr(peg$currPos, 9) === peg$c55) {      
                                                                                                                              s3 = peg$c55;      
                                                                                                                              peg$currPos += 9;      
                                                                                                                          } else {      
                                                                                                                              s3 = peg$FAILED;      
                                                                                                                              if (peg$silentFails === 0) {      
                                                                                                                                  peg$fail(peg$c56);      
                                                                                                                              }      
                                                                                                                          }      
                                                                                                                          if (s3 === peg$FAILED) {      
                                                                                                                              if (input.substr(peg$currPos, 10) === peg$c57) {      
                                                                                                                                  s3 = peg$c57;      
                                                                                                                                  peg$currPos += 10;      
                                                                                                                              } else {      
                                                                                                                                  s3 = peg$FAILED;      
                                                                                                                                  if (peg$silentFails === 0) {      
                                                                                                                                      peg$fail(peg$c58);      
                                                                                                                                  }      
                                                                                                                              }      
                                                                                                                              if (s3 === peg$FAILED) {      
                                                                                                                                  if (input.substr(peg$currPos, 8) === peg$c59) {      
                                                                                                                                      s3 = peg$c59;      
                                                                                                                                      peg$currPos += 8;      
                                                                                                                                  } else {      
                                                                                                                                      s3 = peg$FAILED;      
                                                                                                                                      if (peg$silentFails === 0) {      
                                                                                                                                          peg$fail(peg$c60);      
                                                                                                                                      }      
                                                                                                                                  }      
                                                                                                                                  if (s3 === peg$FAILED) {      
                                                                                                                                      if (input.substr(peg$currPos, 4) === peg$c61) {      
                                                                                                                                          s3 = peg$c61;      
                                                                                                                                          peg$currPos += 4;      
                                                                                                                                      } else {      
                                                                                                                                          s3 = peg$FAILED;      
                                                                                                                                          if (peg$silentFails === 0) {      
                                                                                                                                              peg$fail(peg$c62);      
                                                                                                                                          }      
                                                                                                                                      }      
                                                                                                                                      if (s3 === peg$FAILED) {      
                                                                                                                                          if (input.substr(peg$currPos, 9) === peg$c63) {      
                                                                                                                                              s3 = peg$c63;      
                                                                                                                                              peg$currPos += 9;      
                                                                                                                                          } else {      
                                                                                                                                              s3 = peg$FAILED;      
                                                                                                                                              if (peg$silentFails === 0) {      
                                                                                                                                                  peg$fail(peg$c64);      
                                                                                                                                              }      
                                                                                                                                          }      
                                                                                                                                          if (s3 === peg$FAILED) {      
                                                                                                                                              if (input.substr(peg$currPos, 6) === peg$c65) {      
                                                                                                                                                  s3 = peg$c65;      
                                                                                                                                                  peg$currPos += 6;      
                                                                                                                                              } else {      
                                                                                                                                                  s3 = peg$FAILED;      
                                                                                                                                                  if (peg$silentFails === 0) {      
                                                                                                                                                      peg$fail(peg$c66);      
                                                                                                                                                  }      
                                                                                                                                              }      
                                                                                                                                              if (s3 === peg$FAILED) {      
                                                                                                                                                  if (input.substr(peg$currPos, 5) === peg$c67) {      
                                                                                                                                                      s3 = peg$c67;      
                                                                                                                                                      peg$currPos += 5;      
                                                                                                                                                  } else {      
                                                                                                                                                      s3 = peg$FAILED;      
                                                                                                                                                      if (peg$silentFails === 0) {      
                                                                                                                                                          peg$fail(peg$c68);      
                                                                                                                                                      }      
                                                                                                                                                  }      
                                                                                                                                                  if (s3 === peg$FAILED) {      
                                                                                                                                                      if (input.substr(peg$currPos, 7) === peg$c69) {      
                                                                                                                                                          s3 = peg$c69;      
                                                                                                                                                          peg$currPos += 7;      
                                                                                                                                                      } else {      
                                                                                                                                                          s3 = peg$FAILED;      
                                                                                                                                                          if (peg$silentFails === 0) {      
                                                                                                                                                              peg$fail(peg$c70);      
                                                                                                                                                          }      
                                                                                                                                                      }      
                                                                                                                                                  }      
                                                                                                                                              }      
                                                                                                                                          }      
                                                                                                                                      }      
                                                                                                                                  }      
                                                                                                                              }      
                                                                                                                          }      
                                                                                                                      }      
                                                                                                                  }      
                                                                                                              }      
                                                                                                          }      
                                                                                                      }      
                                                                                                  }      
                                                                                              }      
                                                                                          }      
                                                                                      }      
                                                                                  }      
                                                                              }      
                                                                          }      
                                                                      }      
                                                                  }      
                                                              }      
                                                          }      
                                                      }      
                                                  }      
                                              }      
                                          }      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = peg$parseextra();      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          peg$reportedPos = s0;      
                                          s1 = peg$c71(s3, s4);      
                                          s0 = s1;      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsepseudoSpecial() {      
                          var s0, s1, s2, s3, s4, s5, s6;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 58) {      
                              s1 = peg$c9;      
                              peg$currPos += 1;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c10);      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.substr(peg$currPos, 4) === peg$c72) {      
                                  s2 = peg$c72;      
                                  peg$currPos += 4;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c73);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  if (input.substr(peg$currPos, 9) === peg$c74) {      
                                      s2 = peg$c74;      
                                      peg$currPos += 9;      
                                  } else {      
                                      s2 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c75);      
                                      }      
                                  }      
                                  if (s2 === peg$FAILED) {      
                                      if (input.substr(peg$currPos, 14) === peg$c76) {      
                                          s2 = peg$c76;      
                                          peg$currPos += 14;      
                                      } else {      
                                          s2 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c77);      
                                          }      
                                      }      
                                      if (s2 === peg$FAILED) {      
                                          if (input.substr(peg$currPos, 16) === peg$c78) {      
                                              s2 = peg$c78;      
                                              peg$currPos += 16;      
                                          } else {      
                                              s2 = peg$FAILED;      
                                              if (peg$silentFails === 0) {      
                                                  peg$fail(peg$c79);      
                                              }      
                                          }      
                                          if (s2 === peg$FAILED) {      
                                              if (input.substr(peg$currPos, 11) === peg$c80) {      
                                                  s2 = peg$c80;      
                                                  peg$currPos += 11;      
                                              } else {      
                                                  s2 = peg$FAILED;      
                                                  if (peg$silentFails === 0) {      
                                                      peg$fail(peg$c81);      
                                                  }      
                                              }      
                                          }      
                                      }      
                                  }      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 40) {      
                                      s3 = peg$c82;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c83);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = [];      
                                      s5 = peg$parsevalid();      
                                      if (s5 === peg$FAILED) {      
                                          if (peg$c84.test(input.charAt(peg$currPos))) {      
                                              s5 = input.charAt(peg$currPos);      
                                              peg$currPos += 1;      
                                          } else {      
                                              s5 = peg$FAILED;      
                                              if (peg$silentFails === 0) {      
                                                  peg$fail(peg$c85);      
                                              }      
                                          }      
                                      }      
                                      while (s5 !== peg$FAILED) {      
                                          s4.push(s5);      
                                          s5 = peg$parsevalid();      
                                          if (s5 === peg$FAILED) {      
                                              if (peg$c84.test(input.charAt(peg$currPos))) {      
                                                  s5 = input.charAt(peg$currPos);      
                                                  peg$currPos += 1;      
                                              } else {      
                                                  s5 = peg$FAILED;      
                                                  if (peg$silentFails === 0) {      
                                                      peg$fail(peg$c85);      
                                                  }      
                                              }      
                                          }      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          if (input.charCodeAt(peg$currPos) === 41) {      
                                              s5 = peg$c86;      
                                              peg$currPos += 1;      
                                          } else {      
                                              s5 = peg$FAILED;      
                                              if (peg$silentFails === 0) {      
                                                  peg$fail(peg$c87);      
                                              }      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              s6 = peg$parseextra();      
                                              if (s6 === peg$FAILED) {      
                                                  s6 = peg$c1;      
                                              }      
                                              if (s6 !== peg$FAILED) {      
                                                  peg$reportedPos = s0;      
                                                  s1 = peg$c88(s2, s4, s6);      
                                                  s0 = s1;      
                                              } else {      
                                                  peg$currPos = s0;      
                                                  s0 = peg$c0;      
                                              }      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsepseudoSpecialO() {      
                          var s0, s1, s2, s3, s4, s5, s6, s7;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 58) {      
                              s1 = peg$c9;      
                              peg$currPos += 1;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c10);      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.substr(peg$currPos, 3) === peg$c89) {      
                                  s2 = peg$c89;      
                                  peg$currPos += 3;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c90);      
                                  }      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 40) {      
                                      s3 = peg$c82;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c83);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = peg$parseelement();      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = peg$parseextra();      
                                          if (s5 === peg$FAILED) {      
                                              s5 = peg$c1;      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              if (input.charCodeAt(peg$currPos) === 41) {      
                                                  s6 = peg$c86;      
                                                  peg$currPos += 1;      
                                              } else {      
                                                  s6 = peg$FAILED;      
                                                  if (peg$silentFails === 0) {      
                                                      peg$fail(peg$c87);      
                                                  }      
                                              }      
                                              if (s6 !== peg$FAILED) {      
                                                  s7 = peg$parseextra();      
                                                  if (s7 === peg$FAILED) {      
                                                      s7 = peg$c1;      
                                                  }      
                                                  if (s7 !== peg$FAILED) {      
                                                      peg$reportedPos = s0;      
                                                      s1 = peg$c91(s2, s4, s5, s7);      
                                                      s0 = s1;      
                                                  } else {      
                                                      peg$currPos = s0;      
                                                      s0 = peg$c0;      
                                                  }      
                                              } else {      
                                                  peg$currPos = s0;      
                                                  s0 = peg$c0;      
                                              }      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsebrackets() {      
                          var s0, s1, s2, s3, s4;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 91) {      
                              s1 = peg$c92;      
                              peg$currPos += 1;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c93);      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              s2 = peg$parseequal();      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$parsehasword();      
                                  if (s2 === peg$FAILED) {      
                                      s2 = peg$parsehas();      
                                      if (s2 === peg$FAILED) {      
                                          s2 = peg$parsestartsh();      
                                          if (s2 === peg$FAILED) {      
                                              s2 = peg$parsestarts();      
                                              if (s2 === peg$FAILED) {      
                                                  s2 = peg$parseend();      
                                                  if (s2 === peg$FAILED) {      
                                                      s2 = peg$parseattr();      
                                                  }      
                                              }      
                                          }      
                                      }      
                                  }      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 93) {      
                                      s3 = peg$c94;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c95);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = peg$parseextra();      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          peg$reportedPos = s0;      
                                          s1 = peg$c96(s2, s4);      
                                          s0 = s1;      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseclass() {      
                          var s0, s1, s2, s3;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 46) {      
                              s1 = peg$c97;      
                              peg$currPos++;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c98);      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              s2 = [];      
                              s3 = peg$parsevalid();      
                              while (s3 !== peg$FAILED) {      
                                  s2.push(s3);      
                                  s3 = peg$parsevalid();      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  s3 = peg$parseextra();      
                                  if (s3 === peg$FAILED) {      
                                      s3 = peg$c1;      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      peg$reportedPos = s0;      
                                      s1 = peg$c99(s2, s3);      
                                      s0 = s1;      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseid() {      
                          var s0, s1, s2, s3;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 35) {      
                              s1 = peg$c100;      
                              peg$currPos++;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c101);      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              s2 = [];      
                              s3 = peg$parsevalid();      
                              while (s3 !== peg$FAILED) {      
                                  s2.push(s3);      
                                  s3 = peg$parsevalid();      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  s3 = peg$parseextra();      
                                  if (s3 === peg$FAILED) {      
                                      s3 = peg$c1;      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      peg$reportedPos = s0;      
                                      s1 = peg$c102(s2, s3);      
                                      s0 = s1;      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsemulti() {      
                          var s0, s1, s2, s3, s4, s5;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 32) {      
                              s1 = peg$c103;      
                              peg$currPos++;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c104);      
                              }      
                          }      
                          if (s1 === peg$FAILED) {      
                              s1 = peg$c1;      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 44) {      
                                  s2 = peg$c105;      
                                  peg$currPos++;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c106);      
                                  }      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 32) {      
                                      s3 = peg$c103;      
                                      peg$currPos++;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c104);      
                                      }      
                                  }      
                                  if (s3 === peg$FAILED) {      
                                      s3 = peg$c1;      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = peg$parseelement();      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = peg$parseextra();      
                                          if (s5 === peg$FAILED) {      
                                              s5 = peg$c1;      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c107(s4, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsecontains() {      
                          var s0, s1, s2, s3;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 32) {      
                              s1 = peg$c103;      
                              peg$currPos++;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c104);      
                              }      
                          }      
                          if (s1 !== peg$FAILED) {      
                              s2 = peg$parseelement();      
                              if (s2 !== peg$FAILED) {      
                                  s3 = peg$parseextra();      
                                  if (s3 === peg$FAILED) {      
                                      s3 = peg$c1;      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      peg$reportedPos = s0;      
                                      s1 = peg$c108(s2, s3);      
                                      s0 = s1;      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsechild() {      
                          var s0, s1, s2, s3, s4, s5;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 32) {      
                              s1 = peg$c103;      
                              peg$currPos++;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c104);      
                              }      
                          }      
                          if (s1 === peg$FAILED) {      
                              s1 = peg$c1;      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 62) {      
                                  s2 = peg$c109;      
                                  peg$currPos += 1;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c110);      
                                  }      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 32) {      
                                      s3 = peg$c103;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c104);      
                                      }      
                                  }      
                                  if (s3 === peg$FAILED) {      
                                      s3 = peg$c1;      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = peg$parseelement();      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = peg$parseextra();      
                                          if (s5 === peg$FAILED) {      
                                              s5 = peg$c1;      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c111(s4, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseichild() {      
                          var s0, s1, s2, s3, s4, s5;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 32) {      
                              s1 = peg$c103;      
                              peg$currPos += 1;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c104);      
                              }      
                          }      
                          if (s1 === peg$FAILED) {      
                              s1 = peg$c1;      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 43) {      
                                  s2 = peg$c112;      
                                  peg$currPos += 1;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c113);      
                                  }      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 32) {      
                                      s3 = peg$c103;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c104);      
                                      }      
                                  }      
                                  if (s3 === peg$FAILED) {      
                                      s3 = peg$c1;      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = peg$parseelement();      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = peg$parseextra();      
                                          if (s5 === peg$FAILED) {      
                                              s5 = peg$c1;      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c114(s4, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseafter() {      
                          var s0, s1, s2, s3, s4, s5;      
            
                          s0 = peg$currPos;      
                          if (input.charCodeAt(peg$currPos) === 32) {      
                              s1 = peg$c103;      
                              peg$currPos += 1;      
                          } else {      
                              s1 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c104);      
                              }      
                          }      
                          if (s1 === peg$FAILED) {      
                              s1 = peg$c1;      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 126) {      
                                  s2 = peg$c115;      
                                  peg$currPos += 1;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c116);      
                                  }      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 32) {      
                                      s3 = peg$c103;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c104);      
                                      }      
                                  }      
                                  if (s3 === peg$FAILED) {      
                                      s3 = peg$c1;      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      s4 = peg$parseelement();      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = peg$parseextra();      
                                          if (s5 === peg$FAILED) {      
                                              s5 = peg$c1;      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c117(s4, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseattr() {      
                          var s0, s1, s2;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                          }      
                          if (s1 !== peg$FAILED) {      
                              peg$reportedPos = s0;      
                              s1 = peg$c118(s1);      
                          }      
                          s0 = s1;      
            
                          return s0;      
                      }      
            
                      function peg$parseequal() {      
                          var s0, s1, s2, s3, s4, s5, s6;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 32) {      
                                  s2 = peg$c103;      
                                  peg$currPos += 1;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c104);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.charCodeAt(peg$currPos) === 61) {      
                                      s3 = peg$c119;      
                                      peg$currPos += 1;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c120);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      if (input.charCodeAt(peg$currPos) === 32) {      
                                          s4 = peg$c103;      
                                          peg$currPos++;      
                                      } else {      
                                          s4 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c104);      
                                          }      
                                      }      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = [];      
                                          s6 = peg$parsevalid();      
                                          while (s6 !== peg$FAILED) {      
                                              s5.push(s6);      
                                              s6 = peg$parsevalid();      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c121(s1, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsehasword() {      
                          var s0, s1, s2, s3, s4, s5, s6;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 32) {      
                                  s2 = peg$c103;      
                                  peg$currPos++;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c104);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.substr(peg$currPos, 2) === peg$c122) {      
                                      s3 = peg$c122;      
                                      peg$currPos += 2;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c123);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      if (input.charCodeAt(peg$currPos) === 32) {      
                                          s4 = peg$c103;      
                                          peg$currPos++;      
                                      } else {      
                                          s4 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c104);      
                                          }      
                                      }      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = [];      
                                          s6 = peg$parsevalid();      
                                          while (s6 !== peg$FAILED) {      
                                              s5.push(s6);      
                                              s6 = peg$parsevalid();      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c124(s1, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsestartsh() {      
                          var s0, s1, s2, s3, s4, s5, s6;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 32) {      
                                  s2 = peg$c103;      
                                  peg$currPos++;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c104);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.substr(peg$currPos, 2) === peg$c125) {      
                                      s3 = peg$c125;      
                                      peg$currPos += 2;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c126);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      if (input.charCodeAt(peg$currPos) === 32) {      
                                          s4 = peg$c103;      
                                          peg$currPos++;      
                                      } else {      
                                          s4 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c104);      
                                          }      
                                      }      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = [];      
                                          s6 = peg$parsevalid();      
                                          while (s6 !== peg$FAILED) {      
                                              s5.push(s6);      
                                              s6 = peg$parsevalid();      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c127(s1, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsestarts() {      
                          var s0, s1, s2, s3, s4, s5, s6;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 32) {      
                                  s2 = peg$c103;      
                                  peg$currPos++;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c104);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.substr(peg$currPos, 2) === peg$c128) {      
                                      s3 = peg$c128;      
                                      peg$currPos += 2;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c129);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      if (input.charCodeAt(peg$currPos) === 32) {      
                                          s4 = peg$c103;      
                                          peg$currPos++;      
                                      } else {      
                                          s4 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c104);      
                                          }      
                                      }      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = [];      
                                          s6 = peg$parsevalid();      
                                          while (s6 !== peg$FAILED) {      
                                              s5.push(s6);      
                                              s6 = peg$parsevalid();      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c130(s1, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parseend() {      
                          var s0, s1, s2, s3, s4, s5, s6;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 32) {      
                                  s2 = peg$c103;      
                                  peg$currPos++;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c104);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.substr(peg$currPos, 2) === peg$c131) {      
                                      s3 = peg$c131;      
                                      peg$currPos += 2;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c132);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      if (input.charCodeAt(peg$currPos) === 32) {      
                                          s4 = peg$c103;      
                                          peg$currPos++;      
                                      } else {      
                                          s4 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c104);      
                                          }      
                                      }      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = [];      
                                          s6 = peg$parsevalid();      
                                          while (s6 !== peg$FAILED) {      
                                              s5.push(s6);      
                                              s6 = peg$parsevalid();      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c133(s1, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      function peg$parsehas() {      
                          var s0, s1, s2, s3, s4, s5, s6;      
            
                          s0 = peg$currPos;      
                          s1 = [];      
                          s2 = peg$parsevalid();      
                          while (s2 !== peg$FAILED) {      
                              s1.push(s2);      
                              s2 = peg$parsevalid();      
                          }      
                          if (s1 !== peg$FAILED) {      
                              if (input.charCodeAt(peg$currPos) === 32) {      
                                  s2 = peg$c103;      
                                  peg$currPos++;      
                              } else {      
                                  s2 = peg$FAILED;      
                                  if (peg$silentFails === 0) {      
                                      peg$fail(peg$c104);      
                                  }      
                              }      
                              if (s2 === peg$FAILED) {      
                                  s2 = peg$c1;      
                              }      
                              if (s2 !== peg$FAILED) {      
                                  if (input.substr(peg$currPos, 2) === peg$c134) {      
                                      s3 = peg$c134;      
                                      peg$currPos += 2;      
                                  } else {      
                                      s3 = peg$FAILED;      
                                      if (peg$silentFails === 0) {      
                                          peg$fail(peg$c135);      
                                      }      
                                  }      
                                  if (s3 !== peg$FAILED) {      
                                      if (input.charCodeAt(peg$currPos) === 32) {      
                                          s4 = peg$c103;      
                                          peg$currPos++;      
                                      } else {      
                                          s4 = peg$FAILED;      
                                          if (peg$silentFails === 0) {      
                                              peg$fail(peg$c104);      
                                          }      
                                      }      
                                      if (s4 === peg$FAILED) {      
                                          s4 = peg$c1;      
                                      }      
                                      if (s4 !== peg$FAILED) {      
                                          s5 = [];      
                                          s6 = peg$parsevalid();      
                                          while (s6 !== peg$FAILED) {      
                                              s5.push(s6);      
                                              s6 = peg$parsevalid();      
                                          }      
                                          if (s5 !== peg$FAILED) {      
                                              peg$reportedPos = s0;      
                                              s1 = peg$c136(s1, s5);      
                                              s0 = s1;      
                                          } else {      
                                              peg$currPos = s0;      
                                              s0 = peg$c0;      
                                          }      
                                      } else {      
                                          peg$currPos = s0;      
                                          s0 = peg$c0;      
                                      }      
                                  } else {      
                                      peg$currPos = s0;      
                                      s0 = peg$c0;      
                                  }      
                              } else {      
                                  peg$currPos = s0;      
                                  s0 = peg$c0;      
                              }      
                          } else {      
                              peg$currPos = s0;      
                              s0 = peg$c0;      
                          }      
            
                          return s0;      
                      }      
            
                      peg$result = peg$startRuleFunction();      
            
                      if (peg$result !== peg$FAILED && peg$currPos === input.length) {      
                          return peg$result;      
                      } else {      
                          if (peg$result !== peg$FAILED && peg$currPos < input.length) {      
                              peg$fail({      
                                  type: "end",      
                                  description: "end of input"      
                              });      
                          }      
            
                          throw peg$buildException(null, peg$maxFailExpected, peg$maxFailPos);      
                      }      
                  }      
            
                  return {      
                      SyntaxError: SyntaxError,      
                      parse: parse      
                  };      
              })();;      
          function build(elements, data, loadOrder, load, special, def, done) {      
              var element = elements[elements.length - 1],      
                  child,      
                  prev,      
                  i;      
              if (element.children.length > 0) {      
                  element = element.children[element.children.length - 1];      
              }      
              if (!data.extra || Object.getOwnPropertyNames(data.extra).length === 0) {      
                  return [elements, loadOrder, special, done];      
              } else {      
                  if (data.extra['class']) {      
                      element.setAttribute("class", ((element.getAttribute("class") || "") + " " + data.extra['class']).replace(/^\s/, ""));      
                  } else if (data.extra.id) {      
                      element.setAttribute("id", ((element.getAttribute("id") || "") + " " + data.extra.id).replace(/^\s/, ""));      
                  } else if (data.extra.node) {      
                      elements.push(document.createElement(data.extra.node));      
                      load += 1;      
                      loadOrder.push(load);      
                      special.push(def);      
                  } else if (data.extra.child) {      
                      if (!element.getAttribute("data-placebo-prevent-children")) {      
                          child = document.createElement(data.extra.child);      
                          element.appendChild(child);      
                      }      
                  } else if (data.extra.immediate_child) {      
                      elements.push(document.createElement(data.extra.immediate_child));      
                      load += 1;      
                      loadOrder.push(load);      
                      special.push(def);      
                  } else if (data.extra.after) {      
                      elements.push(document.createElement(data.extra.after));      
                      load += 1;      
                      loadOrder.splice(0, 0, load);      
                      special.push(def);      
                  } else if (data.extra.attr) {      
                      element.setAttribute(data.extra.attr, "");      
                  } else if (data.extra.attr_is) {      
                      element.setAttribute(data.extra.attr_is, data.extra.value);      
                  } else if (data.extra.attr_has_word) {      
                      element.setAttribute(data.extra.attr_has_word, data.extra.value);      
                  } else if (data.extra.attr_starts_hyphen) {      
                      element.setAttribute(data.extra.attr_starts_hyphen, data.extra.value);      
                  } else if (data.extra.attr_starts) {      
                      element.setAttribute(data.extra.attr_starts, data.extra.value);      
                  } else if (data.extra.attr_ends) {      
                      element.setAttribute(data.extra.attr_ends, data.extra.value);      
                  } else if (data.extra.attr_has) {      
                      element.setAttribute(data.extra.attr_has, data.extra.value);      
                  } else if (data.extra.pseudo) {      
                      if (data.extra.pseudo === "checked") {      
                          element.checked = true;      
                      } else if (data.extra.pseudo === "disabled") {      
                          element.disabled = true;      
                      } else if (data.extra.pseudo === "empty") {      
                          element.innerHTML = "";      
                          element.setAttribute("data-placebo-prevent-children", "true");      
                      } else if (data.extra.pseudo === "enabled") {      
                          element.disabled = false;      
                      } else if (data.extra.pseudo === "first-child") {      
                          special[special.length - 1] = function(e, p) {      
                              p.insertBefore(e, p.childNodes[0]);      
                          };      
                      } else if (data.extra.pseudo === "first-of-type") {      
                          special[special.length - 1] = function(e, p) {      
                              var found = false,      
                                  i;      
                              for (i = 0; i < p.children.length; i += 1) {      
                                  if (p.children[i].nodeName === element.nodeName && !found) {      
                                      found = true;      
                                      p.insertBefore(e, p.children[i]);      
                                  }      
                              }      
                              if (!found) {      
                                  p.appendChild(e);      
                              }      
                          };      
                      } else if (data.extra.pseudo === "focus") {      
                          done.push(function() {      
                              element.focus();      
                          });      
                      } else if (data.extra.pseudo === "in-range") {      
                          if (element.getAttribute("min") && element.getAttribute("max")) {      
                              element.setAttribute("value", Math.floor((Math.random() * Number(element.getAttribute("max"))) + Number(element.getAttribute("min"))));      
                          } else if (element.getAttribute("max")) {      
                              element.setAttribute("value", Math.floor((Math.random() * Number(element.getAttribute("max")))));      
                          } else if (element.getAttribute("min")) {      
                              element.setAttribute("value", Math.floor((Math.random() * (Number(element.getAttribute("min")) * 2)) + Number(element.getAttribute("min"))));      
                          }      
                      } else if (data.extra.pseudo === "lang") {      
                          element.setAttribute("lang", data.extra.value);      
                      } else if (data.extra.pseudo === "last-of-type") {      
                          special[special.length - 1] = function(e, p) {      
                              var found = false,      
                                  pre,      
                                  i;      
                              for (i = 0; i < p.children.length; i += 1) {      
                                  if (p.children[i].nodeName === element.nodeName) {      
                                      pre = p.children[i];      
                                      found = true;      
                                  }      
                              }      
                              if (found && pre.nextElementSibling) {      
                                  p.insertBefore(e, pre.nextElementSibling);      
                              } else {      
                                  p.appendChild(e);      
                              }      
                          };      
                      } else if (data.extra.pseudo === "nth-child") {      
                          special[special.length - 1] = function(e, p) {      
                              if (p.children[Number(data.extra.value) - 1]) {      
                                  p.insertBefore(e, p.children[Number(data.extra.value) - 1]);      
                              } else {      
                                  p.appendChild(e);      
                              }      
                          };      
                      } else if (data.extra.pseudo === "nth-last-of-type") {      
                          special[special.length - 1] = function(e, p) {      
                              var matches = [],      
                                  found = false,      
                                  i;      
                              for (i = 0; i < p.children.length; i += 1) {      
                                  if (p.children[i].nodeName === element.nodeName) {      
                                      matches.push(p.children[i]);      
                                  }      
                              }      
                              if (matches.length >= Number(data.extra.value)) {      
                                  p.insertBefore(e, matches[(matches.length - Number(data.extra.value)) + 1]);      
                              } else {      
                                  p.appendChild(e);      
                              }      
                          };      
                      } else if (data.extra.pseudo === "nth-of-type") {      
                          special[special.length - 1] = function(e, p) {      
                              var matches = [],      
                                  found = false,      
                                  i;      
                              for (i = 0; i < p.children.length; i += 1) {      
                                  if (p.children[i].nodeName === element.nodeName) {      
                                      matches.push(p.children[i]);      
                                  }      
                              }      
                              if (matches.length >= Number(data.extra.value)) {      
                                  p.insertBefore(e, matches[Number(data.extra.value) - 1]);      
                              } else {      
                                  p.appendChild(e);      
                              }      
                          };      
                      } else if (data.extra.pseudo === "only-of-type") {      
                          special[special.length - 1] = function(e, p) {      
                              var i;      
                              for (i = 0; i < p.children.length; i += 1) {      
                                  if (p.children[i].nodeName === element.nodeName) {      
                                      while (p.children[i].hasChildNodes()) {      
                                          p.children[i].removeChild(p.children[i].firstChild);      
                                      }      
                                      p.removeChild(p.children[i]);      
                                  }      
                              }      
                              p.appendChild(e);      
                          };      
                      } else if (data.extra.pseudo === "only-child") {      
                          special[special.length - 1] = function(e, p) {      
                              while (p.hasChildNodes()) {      
                                  p.removeChild(p.firstChild);      
                              }      
                              p.appendChild(e);      
                          };      
                      } else if (data.extra.pseudo === "optional") {      
                          element.required = false;      
                      } else if (data.extra.pseudo === "out-of-range") {      
                          if (element.getAttribute("max")) {      
                              element.setAttribute("value", Math.floor((Math.random() * (Number(element.getAttribute("max")) * 2)) + Number(element.getAttribute("max"))));      
                          }      
                      } else if (data.extra.pseudo === "read-only") {      
                          element.readyOnly = true;      
                          element.setAttribute("readonly", "");      
                          element.contentEditable = false;      
                      } else if (data.extra.pseudo === "read-write") {      
                          element.readOnly = false;      
                          element.contentEditable = true;      
                      } else if (data.extra.pseudo === "required") {      
                          element.required = true;      
                      } else if (data.extra.pseudo === "target") {      
                          if (element.getAttribute("id")) {      
                              history.pushState({}, document.title, "#" + element.getAttribute("id"));      
                          }      
                      }      
                  }      
                  return build(elements, data.extra, loadOrder, load, special, def, done);      
              }      
          }      
            
          function placebo(selector) {      
              var data = parser.parse(selector),      
                  elements = [],      
                  def = function(e, p) {      
                      p.appendChild(e);      
                  },      
                  loadOrder,      
                  targets,      
                  special,      
                  built,      
                  done,      
                  i;      
              if (data.node === "*") {      
                  targets = document.querySelectorAll("*");      
                  for (i = 0; i < targets.length; i += 1) {      
                      elements.push(targets[i].cloneNode(true));      
                  }      
                  loadOrder = [0];      
                  special = [def];      
                  done = [];      
              } else {      
                  built = build([document.createElement(data.node)], data, [0], 1, [def], def, []);      
                  elements = built[0];      
                  loadOrder = built[1];      
                  special = built[2];      
                  done = built[3];      
              }      
              return {      
                  "done": done,      
                  "elements": elements,      
                  "loadOrder": loadOrder,      
                  "place": function(parent) {      
                      var load = [],      
                          i,      
                          b,      
                          c;      
                      if (!parent) {      
                          if (document.body) {      
                              parent = document.body;      
                          } else {      
                              throw "Placebo requires a document with a body!";      
                          }      
                      }      
            
                      function min(item, array) {      
                          var a;      
                          for (a = 0; a < array.length; a += 1) {      
                              if (item > array[a]) {      
                                  return false;      
                              }      
                          }      
                          return true;      
                      }      
            
                      function sort(loadOrder, elements, special, stack) {      
                          var i;      
                          if (!loadOrder || loadOrder.length < 1) {      
                              return stack;      
                          } else {      
                              for (i = 0; i < loadOrder.length; i += 1) {      
                                  if (min(loadOrder[i], loadOrder)) {      
                                      stack[0].push(elements[i]);      
                                      stack[1].push(special[i]);      
                                      loadOrder.splice(i, 1);      
                                      elements.splice(i, 1);      
                                      special.splice(i, 1);      
                                      return sort(loadOrder, elements, special, stack);      
                                  }      
                              }      
                          }      
                      }      
                      load = sort(this.loadOrder, this.elements, this.special, [      
                          [],      
                          []      
                      ]);      
                      for (b = 0; b < load[0].length; b += 1) {      
                          load[1][b](load[0][b], parent);      
                      }      
                      for (c = 0; c < this.done.length; c += 1) {      
                          this.done[c](parent);      
                      }      
                  },      
                  "special": special      
              };      
          }      
          context.placebo = placebo;      
      }(this));
    },
    'ender': function (module, exports, require, global) {
      (function ($) {      
          'use strict';      
          $.ender({      
              placebo: placebo      
          });      
      }(ender));
    }
  }, 'placebo');

  require('placebo-js');
  require('placebo-js/ender');

}.call(window));
//# sourceMappingURL=ender.js.map
