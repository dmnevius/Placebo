/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://enderjs.com)
  * Build: ender build bonzo placebo-js
  * Packages: ender-core@2.0.0 ender-commonjs@1.0.8 bonzo@2.0.0 placebo-js@1.0.3
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
  
  Module.createPackage('bonzo', {
    'bonzo': function (module, exports, require, global) {
      /*!
        * Bonzo: DOM Utility (c) Dustin Diaz 2012
        * https://github.com/ded/bonzo
        * License MIT
        */
      (function (name, context, definition) {
        if (typeof module != 'undefined' && module.exports) module.exports = definition()
        else if (typeof define == 'function' && define.amd) define(definition)
        else context[name] = definition()
      })('bonzo', this, function() {
        var win = window
          , doc = win.document
          , html = doc.documentElement
          , parentNode = 'parentNode'
          , specialAttributes = /^(checked|value|selected|disabled)$/i
            // tags that we have trouble inserting *into*
          , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
          , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
          , table = ['<table>', '</table>', 1]
          , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
          , option = ['<select>', '</select>', 1]
          , noscope = ['_', '', 0, 1]
          , tagMap = { // tags that we have trouble *inserting*
                thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
              , tr: ['<table><tbody>', '</tbody></table>', 2]
              , th: td , td: td
              , col: ['<table><colgroup>', '</colgroup></table>', 2]
              , fieldset: ['<form>', '</form>', 1]
              , legend: ['<form><fieldset>', '</fieldset></form>', 2]
              , option: option, optgroup: option
              , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
            }
          , stateAttributes = /^(checked|selected|disabled)$/
          , hasClass, addClass, removeClass
          , uidMap = {}
          , uuids = 0
          , digit = /^-?[\d\.]+$/
          , dattr = /^data-(.+)$/
          , px = 'px'
          , setAttribute = 'setAttribute'
          , getAttribute = 'getAttribute'
          , features = function() {
              var e = doc.createElement('p')
              return {
                transform: function () {
                  var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
                  for (i = 0; i < props.length; i++) {
                    if (props[i] in e.style) return props[i]
                  }
                }()
              , classList: 'classList' in e
              }
            }()
          , whitespaceRegex = /\s+/
          , toString = String.prototype.toString
          , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
          , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
      
      
        function getStyle(el, property) {
          var value = null
            , computed = doc.defaultView.getComputedStyle(el, '')
          computed && (value = computed[property])
          return el.style[property] || value
        }
      
      
        function isNode(node) {
          return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
        }
      
      
        function normalize(node, host, clone) {
          var i, l, ret
          if (typeof node == 'string') return bonzo.create(node)
          if (isNode(node)) node = [ node ]
          if (clone) {
            ret = [] // don't change original array
            for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
            return ret
          }
          return node
        }
      
        /**
         * @param {string} c a class name to test
         * @return {boolean}
         */
        function classReg(c) {
          return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @param {boolean=} opt_rev
         * @return {Bonzo|Array}
         */
        function each(ar, fn, opt_scope, opt_rev) {
          var ind, i = 0, l = ar.length
          for (; i < l; i++) {
            ind = opt_rev ? ar.length - i - 1 : i
            fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
          }
          return ar
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {Bonzo|Array}
         */
        function deepEach(ar, fn, opt_scope) {
          for (var i = 0, l = ar.length; i < l; i++) {
            if (isNode(ar[i])) {
              deepEach(ar[i].childNodes, fn, opt_scope)
              fn.call(opt_scope || ar[i], ar[i], i, ar)
            }
          }
          return ar
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function camelize(s) {
          return s.replace(/-(.)/g, function (m, m1) {
            return m1.toUpperCase()
          })
        }
      
      
        /**
         * @param {string} s
         * @return {string}
         */
        function decamelize(s) {
          return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
        }
      
      
        /**
         * @param {Element} el
         * @return {*}
         */
        function data(el) {
          el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
          var uid = el[getAttribute]('data-node-uid')
          return uidMap[uid] || (uidMap[uid] = {})
        }
      
      
        /**
         * removes the data associated with an element
         * @param {Element} el
         */
        function clearData(el) {
          var uid = el[getAttribute]('data-node-uid')
          if (uid) delete uidMap[uid]
        }
      
      
        function dataValue(d) {
          var f
          try {
            return (d === null || d === undefined) ? undefined :
              d === 'true' ? true :
                d === 'false' ? false :
                  d === 'null' ? null :
                    (f = parseFloat(d)) == d ? f : d;
          } catch(e) {}
          return undefined
        }
      
      
        /**
         * @param {Bonzo|Array} ar
         * @param {function(Object, number, (Bonzo|Array))} fn
         * @param {Object=} opt_scope
         * @return {boolean} whether `some`thing was found
         */
        function some(ar, fn, opt_scope) {
          for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
          return false
        }
      
      
        /**
         * this could be a giant enum of CSS properties
         * but in favor of file size sans-closure deadcode optimizations
         * we're just asking for any ol string
         * then it gets transformed into the appropriate style property for JS access
         * @param {string} p
         * @return {string}
         */
        function styleProperty(p) {
            (p == 'transform' && (p = features.transform)) ||
              (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin'))
            return p ? camelize(p) : null
        }
      
        // this insert method is intense
        function insert(target, host, fn, rev) {
          var i = 0, self = host || this, r = []
            // target nodes could be a css selector if it's a string and a selector engine is present
            // otherwise, just use target
            , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
          // normalize each node in case it's still a string and we need to create nodes on the fly
          each(normalize(nodes), function (t, j) {
            each(self, function (el) {
              fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
            }, null, rev)
          }, this, rev)
          self.length = i
          each(r, function (e) {
            self[--i] = e
          }, null, !rev)
          return self
        }
      
      
        /**
         * sets an element to an explicit x/y position on the page
         * @param {Element} el
         * @param {?number} x
         * @param {?number} y
         */
        function xy(el, x, y) {
          var $el = bonzo(el)
            , style = $el.css('position')
            , offset = $el.offset()
            , rel = 'relative'
            , isRel = style == rel
            , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
      
          if (style == 'static') {
            $el.css('position', rel)
            style = rel
          }
      
          isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
          isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
      
          x != null && (el.style.left = x - offset.left + delta[0] + px)
          y != null && (el.style.top = y - offset.top + delta[1] + px)
      
        }
      
        // classList support for class management
        // altho to be fair, the api sucks because it won't accept multiple classes at once
        if (features.classList) {
          hasClass = function (el, c) {
            return el.classList.contains(c)
          }
          addClass = function (el, c) {
            el.classList.add(c)
          }
          removeClass = function (el, c) {
            el.classList.remove(c)
          }
        }
        else {
          hasClass = function (el, c) {
            return classReg(c).test(el.className)
          }
          addClass = function (el, c) {
            el.className = (el.className + ' ' + c).trim()
          }
          removeClass = function (el, c) {
            el.className = (el.className.replace(classReg(c), ' ')).trim()
          }
        }
      
      
        /**
         * this allows method calling for setting values
         *
         * @example
         * bonzo(elements).css('color', function (el) {
         *   return el.getAttribute('data-original-color')
         * })
         *
         * @param {Element} el
         * @param {function (Element)|string} v
         * @return {string}
         */
        function setter(el, v) {
          return typeof v == 'function' ? v.call(el, el) : v
        }
      
        function scroll(x, y, type) {
          var el = this[0]
          if (!el) return this
          if (x == null && y == null) {
            return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
          }
          if (isBody(el)) {
            win.scrollTo(x, y)
          } else {
            x != null && (el.scrollLeft = x)
            y != null && (el.scrollTop = y)
          }
          return this
        }
      
        /**
         * @constructor
         * @param {Array.<Element>|Element|Node|string} elements
         */
        function Bonzo(elements) {
          this.length = 0
          if (elements) {
            elements = typeof elements !== 'string' &&
              !elements.nodeType &&
              typeof elements.length !== 'undefined' ?
                elements :
                [elements]
            this.length = elements.length
            for (var i = 0; i < elements.length; i++) this[i] = elements[i]
          }
        }
      
        Bonzo.prototype = {
      
            /**
             * @param {number} index
             * @return {Element|Node}
             */
            get: function (index) {
              return this[index] || null
            }
      
            // itetators
            /**
             * @param {function(Element|Node)} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , each: function (fn, opt_scope) {
              return each(this, fn, opt_scope)
            }
      
            /**
             * @param {Function} fn
             * @param {Object=} opt_scope
             * @return {Bonzo}
             */
          , deepEach: function (fn, opt_scope) {
              return deepEach(this, fn, opt_scope)
            }
      
      
            /**
             * @param {Function} fn
             * @param {Function=} opt_reject
             * @return {Array}
             */
          , map: function (fn, opt_reject) {
              var m = [], n, i
              for (i = 0; i < this.length; i++) {
                n = fn.call(this, this[i], i)
                opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
              }
              return m
            }
      
          // text and html inserters!
      
          /**
           * @param {string} h the HTML to insert
           * @param {boolean=} opt_text whether to set or get text content
           * @return {Bonzo|string}
           */
          , html: function (h, opt_text) {
              var method = opt_text
                    ? 'textContent'
                    : 'innerHTML'
                , that = this
                , append = function (el, i) {
                    each(normalize(h, that, i), function (node) {
                      el.appendChild(node)
                    })
                  }
                , updateElement = function (el, i) {
                    try {
                      if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                        return el[method] = h
                      }
                    } catch (e) {}
                    append(el, i)
                  }
              return typeof h != 'undefined'
                ? this.empty().each(updateElement)
                : this[0] ? this[0][method] : ''
            }
      
            /**
             * @param {string=} opt_text the text to set, otherwise this is a getter
             * @return {Bonzo|string}
             */
          , text: function (opt_text) {
              return this.html(opt_text, true)
            }
      
            // more related insertion methods
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , append: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el.appendChild(i)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , prepend: function (node) {
              var that = this
              return this.each(function (el, i) {
                var first = el.firstChild
                each(normalize(node, that, i), function (i) {
                  el.insertBefore(i, first)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , appendTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.appendChild(el)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , prependTo: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t.insertBefore(el, t.firstChild)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , before: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el)
                })
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , after: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode].insertBefore(i, el.nextSibling)
                }, null, 1)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertBefore: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                t[parentNode].insertBefore(el, t)
              })
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , insertAfter: function (target, opt_host) {
              return insert.call(this, target, opt_host, function (t, el) {
                var sibling = t.nextSibling
                sibling ?
                  t[parentNode].insertBefore(el, sibling) :
                  t[parentNode].appendChild(el)
              }, 1)
            }
      
      
            /**
             * @param {Bonzo|string|Element|Array} node
             * @return {Bonzo}
             */
          , replaceWith: function (node) {
              var that = this
              return this.each(function (el, i) {
                each(normalize(node, that, i), function (i) {
                  el[parentNode] && el[parentNode].replaceChild(i, el)
                })
              })
            }
      
            /**
             * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
             * @return {Bonzo}
             */
          , clone: function (opt_host) {
              var ret = [] // don't change original array
                , l, i
              for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
              return bonzo(ret)
            }
      
            // class management
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , addClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                // we `each` here so you can do $el.addClass('foo bar')
                each(c, function (c) {
                  if (c && !hasClass(el, setter(el, c)))
                    addClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {Bonzo}
             */
          , removeClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c && hasClass(el, setter(el, c)))
                    removeClass(el, setter(el, c))
                })
              })
            }
      
      
            /**
             * @param {string} c
             * @return {boolean}
             */
          , hasClass: function (c) {
              c = toString.call(c).split(whitespaceRegex)
              return some(this, function (el) {
                return some(c, function (c) {
                  return c && hasClass(el, c)
                })
              })
            }
      
      
            /**
             * @param {string} c classname to toggle
             * @param {boolean=} opt_condition whether to add or remove the class straight away
             * @return {Bonzo}
             */
          , toggleClass: function (c, opt_condition) {
              c = toString.call(c).split(whitespaceRegex)
              return this.each(function (el) {
                each(c, function (c) {
                  if (c) {
                    typeof opt_condition !== 'undefined' ?
                      opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                      hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
                  }
                })
              })
            }
      
            // display togglers
      
            /**
             * @param {string=} opt_type useful to set back to anything other than an empty string
             * @return {Bonzo}
             */
          , show: function (opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : ''
              return this.each(function (el) {
                el.style.display = opt_type
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , hide: function () {
              return this.each(function (el) {
                el.style.display = 'none'
              })
            }
      
      
            /**
             * @param {Function=} opt_callback
             * @param {string=} opt_type
             * @return {Bonzo}
             */
          , toggle: function (opt_callback, opt_type) {
              opt_type = typeof opt_type == 'string' ? opt_type : '';
              typeof opt_callback != 'function' && (opt_callback = null)
              return this.each(function (el) {
                el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
                opt_callback && opt_callback.call(el)
              })
            }
      
      
            // DOM Walkers & getters
      
            /**
             * @return {Element|Node}
             */
          , first: function () {
              return bonzo(this.length ? this[0] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , last: function () {
              return bonzo(this.length ? this[this.length - 1] : [])
            }
      
      
            /**
             * @return {Element|Node}
             */
          , next: function () {
              return this.related('nextSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , previous: function () {
              return this.related('previousSibling')
            }
      
      
            /**
             * @return {Element|Node}
             */
          , parent: function() {
              return this.related(parentNode)
            }
      
      
            /**
             * @private
             * @param {string} method the directional DOM method
             * @return {Element|Node}
             */
          , related: function (method) {
              return bonzo(this.map(
                function (el) {
                  el = el[method]
                  while (el && el.nodeType !== 1) {
                    el = el[method]
                  }
                  return el || 0
                },
                function (el) {
                  return el
                }
              ))
            }
      
      
            /**
             * @return {Bonzo}
             */
          , focus: function () {
              this.length && this[0].focus()
              return this
            }
      
      
            /**
             * @return {Bonzo}
             */
          , blur: function () {
              this.length && this[0].blur()
              return this
            }
      
            // style getter setter & related methods
      
            /**
             * @param {Object|string} o
             * @param {string=} opt_v
             * @return {Bonzo|string}
             */
          , css: function (o, opt_v) {
              var p, iter = o
              // is this a request for just getting a style?
              if (opt_v === undefined && typeof o == 'string') {
                // repurpose 'v'
                opt_v = this[0]
                if (!opt_v) return null
                if (opt_v === doc || opt_v === win) {
                  p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
                  return o == 'width' ? p.width : o == 'height' ? p.height : ''
                }
                return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
              }
      
              if (typeof o == 'string') {
                iter = {}
                iter[o] = opt_v
              }
      
              function fn(el, p, v) {
                for (var k in iter) {
                  if (iter.hasOwnProperty(k)) {
                    v = iter[k];
                    // change "5" to "5px" - unless you're line-height, which is allowed
                    (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                    try { el.style[p] = setter(el, v) } catch(e) {}
                  }
                }
              }
              return this.each(fn)
            }
      
      
            /**
             * @param {number=} opt_x
             * @param {number=} opt_y
             * @return {Bonzo|number}
             */
          , offset: function (opt_x, opt_y) {
              if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
                return this.each(function (el) {
                  xy(el, opt_x.left, opt_x.top)
                })
              } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
                return this.each(function (el) {
                  xy(el, opt_x, opt_y)
                })
              }
              if (!this[0]) return {
                  top: 0
                , left: 0
                , height: 0
                , width: 0
              }
              var el = this[0]
                , de = el.ownerDocument.documentElement
                , bcr = el.getBoundingClientRect()
                , scroll = getWindowScroll()
                , width = el.offsetWidth
                , height = el.offsetHeight
                , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
                , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)
      
              return {
                  top: top
                , left: left
                , height: height
                , width: width
              }
            }
      
      
            /**
             * @return {number}
             */
          , dim: function () {
              if (!this.length) return { height: 0, width: 0 }
              var el = this[0]
                , de = el.nodeType == 9 && el.documentElement // document
                , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
                   // el isn't visible, can't be measured properly, so fix that
                   function (t) {
                     var s = {
                         position: el.style.position || ''
                       , visibility: el.style.visibility || ''
                       , display: el.style.display || ''
                     }
                     t.first().css({
                         position: 'absolute'
                       , visibility: 'hidden'
                       , display: 'block'
                     })
                     return s
                  }(this) : null
                , width = de
                    ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                    : el.offsetWidth
                , height = de
                    ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                    : el.offsetHeight
      
              orig && this.first().css(orig)
              return {
                  height: height
                , width: width
              }
            }
      
            // attributes are hard. go shopping
      
            /**
             * @param {string} k an attribute to get or set
             * @param {string=} opt_v the value to set
             * @return {Bonzo|string}
             */
          , attr: function (k, opt_v) {
              var el = this[0]
                , n
      
              if (typeof k != 'string' && !(k instanceof String)) {
                for (n in k) {
                  k.hasOwnProperty(n) && this.attr(n, k[n])
                }
                return this
              }
      
              return typeof opt_v == 'undefined' ?
                !el ? null : specialAttributes.test(k) ?
                  stateAttributes.test(k) && typeof el[k] == 'string' ?
                    true : el[k] :  el[getAttribute](k) :
                this.each(function (el) {
                  specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
                })
            }
      
      
            /**
             * @param {string} k
             * @return {Bonzo}
             */
          , removeAttr: function (k) {
              return this.each(function (el) {
                stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
              })
            }
      
      
            /**
             * @param {string=} opt_s
             * @return {Bonzo|string}
             */
          , val: function (s) {
              return (typeof s == 'string' || typeof s == 'number') ?
                this.attr('value', s) :
                this.length ? this[0].value : null
            }
      
            // use with care and knowledge. this data() method uses data attributes on the DOM nodes
            // to do this differently costs a lot more code. c'est la vie
            /**
             * @param {string|Object=} opt_k the key for which to get or set data
             * @param {Object=} opt_v
             * @return {Bonzo|Object}
             */
          , data: function (opt_k, opt_v) {
              var el = this[0], o, m
              if (typeof opt_v === 'undefined') {
                if (!el) return null
                o = data(el)
                if (typeof opt_k === 'undefined') {
                  each(el.attributes, function (a) {
                    (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
                  })
                  return o
                } else {
                  if (typeof o[opt_k] === 'undefined')
                    o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
                  return o[opt_k]
                }
              } else {
                return this.each(function (el) { data(el)[opt_k] = opt_v })
              }
            }
      
            // DOM detachment & related
      
            /**
             * @return {Bonzo}
             */
          , remove: function () {
              this.deepEach(clearData)
              return this.detach()
            }
      
      
            /**
             * @return {Bonzo}
             */
          , empty: function () {
              return this.each(function (el) {
                deepEach(el.childNodes, clearData)
      
                while (el.firstChild) {
                  el.removeChild(el.firstChild)
                }
              })
            }
      
      
            /**
             * @return {Bonzo}
             */
          , detach: function () {
              return this.each(function (el) {
                el[parentNode] && el[parentNode].removeChild(el)
              })
            }
      
            // who uses a mouse anyway? oh right.
      
            /**
             * @param {number} y
             */
          , scrollTop: function (y) {
              return scroll.call(this, null, y, 'y')
            }
      
      
            /**
             * @param {number} x
             */
          , scrollLeft: function (x) {
              return scroll.call(this, x, null, 'x')
            }
      
        }
      
      
        function cloneNode(host, el) {
          var c = el.cloneNode(true)
            , cloneElems
            , elElems
            , i
      
          // check for existence of an event cloner
          // preferably https://github.com/fat/bean
          // otherwise Bonzo won't do this for you
          if (host.$ && typeof host.cloneEvents == 'function') {
            host.$(c).cloneEvents(el)
      
            // clone events from every child node
            cloneElems = host.$(c).find('*')
            elElems = host.$(el).find('*')
      
            for (i = 0; i < elElems.length; i++)
              host.$(cloneElems[i]).cloneEvents(elElems[i])
          }
          return c
        }
      
        function isBody(element) {
          return element === win || (/^(?:body|html)$/i).test(element.tagName)
        }
      
        function getWindowScroll() {
          return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
        }
      
        function createScriptFromHtml(html) {
          var scriptEl = document.createElement('script')
            , matches = html.match(simpleScriptTagRe)
          scriptEl.src = matches[1]
          return scriptEl
        }
      
        /**
         * @param {Array.<Element>|Element|Node|string} els
         * @return {Bonzo}
         */
        function bonzo(els) {
          return new Bonzo(els)
        }
      
        bonzo.setQueryEngine = function (q) {
          query = q;
          delete bonzo.setQueryEngine
        }
      
        bonzo.aug = function (o, target) {
          // for those standalone bonzo users. this love is for you.
          for (var k in o) {
            o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
          }
        }
      
        bonzo.create = function (node) {
          // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
          return typeof node == 'string' && node !== '' ?
            function () {
              if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
              var tag = node.match(/^\s*<([^\s>]+)/)
                , el = doc.createElement('div')
                , els = []
                , p = tag ? tagMap[tag[1].toLowerCase()] : null
                , dep = p ? p[2] + 1 : 1
                , ns = p && p[3]
                , pn = parentNode
      
              el.innerHTML = p ? (p[0] + node + p[1]) : node
              while (dep--) el = el.firstChild
              // for IE NoScope, we may insert cruft at the begining just to get it to work
              if (ns && el && el.nodeType !== 1) el = el.nextSibling
              do {
                if (!tag || el.nodeType == 1) {
                  els.push(el)
                }
              } while (el = el.nextSibling)
              // IE < 9 gives us a parentNode which messes up insert() check for cloning
              // `dep` > 1 can also cause problems with the insert() check (must do this last)
              each(els, function(el) { el[pn] && el[pn].removeChild(el) })
              return els
            }() : isNode(node) ? [node.cloneNode(true)] : []
        }
      
        bonzo.doc = function () {
          var vp = bonzo.viewport()
          return {
              width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
            , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
          }
        }
      
        bonzo.firstChild = function (el) {
          for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
            if (c[i].nodeType === 1) e = c[j = i]
          }
          return e
        }
      
        bonzo.viewport = function () {
          return {
              width: win.innerWidth
            , height: win.innerHeight
          }
        }
      
        bonzo.isAncestor = 'compareDocumentPosition' in html ?
          function (container, element) {
            return (container.compareDocumentPosition(element) & 16) == 16
          } :
          function (container, element) {
            return container !== element && container.contains(element);
          }
      
        return bonzo
      }); // the only line we care about using a semi-colon. placed here for concatenation tools
      
    },
    'src\ender': function (module, exports, require, global) {
      (function ($) {
      
        var b = require('bonzo')
        b.setQueryEngine($)
        $.ender(b)
        $.ender(b(), true)
        $.ender({
          create: function (node) {
            return $(b.create(node))
          }
        })
      
        $.id = function (id) {
          return $([document.getElementById(id)])
        }
      
        function indexOf(ar, val) {
          for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
          return -1
        }
      
        function uniq(ar) {
          var r = [], i = 0, j = 0, k, item, inIt
          for (; item = ar[i]; ++i) {
            inIt = false
            for (k = 0; k < r.length; ++k) {
              if (r[k] === item) {
                inIt = true; break
              }
            }
            if (!inIt) r[j++] = item
          }
          return r
        }
      
        $.ender({
          parents: function (selector, closest) {
            if (!this.length) return this
            if (!selector) selector = '*'
            var collection = $(selector), j, k, p, r = []
            for (j = 0, k = this.length; j < k; j++) {
              p = this[j]
              while (p = p.parentNode) {
                if (~indexOf(collection, p)) {
                  r.push(p)
                  if (closest) break;
                }
              }
            }
            return $(uniq(r))
          }
      
        , parent: function() {
            return $(uniq(b(this).parent()))
          }
      
        , closest: function (selector) {
            return this.parents(selector, true)
          }
      
        , first: function () {
            return $(this.length ? this[0] : this)
          }
      
        , last: function () {
            return $(this.length ? this[this.length - 1] : [])
          }
      
        , next: function () {
            return $(b(this).next())
          }
      
        , previous: function () {
            return $(b(this).previous())
          }
      
        , related: function (t) {
            return $(b(this).related(t))
          }
      
        , appendTo: function (t) {
            return b(this.selector).appendTo(t, this)
          }
      
        , prependTo: function (t) {
            return b(this.selector).prependTo(t, this)
          }
      
        , insertAfter: function (t) {
            return b(this.selector).insertAfter(t, this)
          }
      
        , insertBefore: function (t) {
            return b(this.selector).insertBefore(t, this)
          }
      
        , clone: function () {
            return $(b(this).clone(this))
          }
      
        , siblings: function () {
            var i, l, p, r = []
            for (i = 0, l = this.length; i < l; i++) {
              p = this[i]
              while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
              p = this[i]
              while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
            }
            return $(r)
          }
      
        , children: function () {
            var i, l, el, r = []
            for (i = 0, l = this.length; i < l; i++) {
              if (!(el = b.firstChild(this[i]))) continue;
              r.push(el)
              while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
            }
            return $(uniq(r))
          }
      
        , height: function (v) {
            return dimension.call(this, 'height', v)
          }
      
        , width: function (v) {
            return dimension.call(this, 'width', v)
          }
        }, true)
      
        /**
         * @param {string} type either width or height
         * @param {number=} opt_v becomes a setter instead of a getter
         * @return {number}
         */
        function dimension(type, opt_v) {
          return typeof opt_v == 'undefined'
            ? b(this).dim()[type]
            : this.css(type, opt_v)
        }
      }(ender));
    }
  }, 'bonzo');

  Module.createPackage('placebo-js', {
    'placebo': function (module, exports, require, global) {
      (function(context) {      
          'use strict';      
          var parser = (function() {      
              /*      
               * Generated by PEG.js 0.8.0.      
               *      
               * http://pegjs.majda.cz/      
               */      
            
              function peg$subclass(child, parent) {      
                  function ctor() {      
                      this.constructor = child;      
                  }      
                  ctor.prototype = parent.prototype;      
                  child.prototype = new ctor();      
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
                      peg$c2 = function(e, extra) {      
                          return {      
                              "node": e.join("") || "div",      
                              "extra": extra      
                          }      
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
                      peg$c8 = function(node) {      
                          return node      
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
                      peg$c71 = function(p, extra) {      
                          var a = {};      
                          a.pseudo = p;      
                          a.extra = extra || {};      
                          return a      
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
                      peg$c88 = function(p, v, extra) {      
                          var a = {};      
                          a.pseudo = p;      
                          a.value = v.join("");      
                          a.extra = extra || {};      
                          return a      
                      },      
                      peg$c89 = "not",      
                      peg$c90 = {      
                          type: "literal",      
                          value: "not",      
                          description: "\"not\""      
                      },      
                      peg$c91 = function(p, e, v, extra) {      
                          var a = {};      
                          a.pseudo = p;      
                          a.value = {};      
                          a.value.node = e.join("") || "div";      
                          a.value.extra = v;      
                          a.extra = extra || {};      
                          return a      
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
                      peg$c96 = function(cond, extra) {      
                          cond.extra = extra || {};      
                          return cond      
                      },      
                      peg$c97 = ".",      
                      peg$c98 = {      
                          type: "literal",      
                          value: ".",      
                          description: "\".\""      
                      },      
                      peg$c99 = function(val, extra) {      
                          return {      
                              "class": val.join(""),      
                              "extra": extra || {}      
                          }      
                      },      
                      peg$c100 = "#",      
                      peg$c101 = {      
                          type: "literal",      
                          value: "#",      
                          description: "\"#\""      
                      },      
                      peg$c102 = function(val, extra) {      
                          return {      
                              "id": val.join(""),      
                              "extra": extra || {}      
                          }      
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
                      peg$c107 = function(e, extra) {      
                          return {      
                              "node": e.join(""),      
                              "extra": extra || {}      
                          }      
                      },      
                      peg$c108 = function(e, extra) {      
                          return {      
                              "contains": e.join(""),      
                              "extra": extra || {}      
                          }      
                      },      
                      peg$c109 = ">",      
                      peg$c110 = {      
                          type: "literal",      
                          value: ">",      
                          description: "\">\""      
                      },      
                      peg$c111 = function(e, extra) {      
                          return {      
                              "child": e.join(""),      
                              "extra": extra || {}      
                          }      
                      },      
                      peg$c112 = "+",      
                      peg$c113 = {      
                          type: "literal",      
                          value: "+",      
                          description: "\"+\""      
                      },      
                      peg$c114 = function(e, extra) {      
                          return {      
                              "immediate_child": e.join(""),      
                              "extra": extra || {}      
                          }      
                      },      
                      peg$c115 = "~",      
                      peg$c116 = {      
                          type: "literal",      
                          value: "~",      
                          description: "\"~\""      
                      },      
                      peg$c117 = function(e, extra) {      
                          return {      
                              "after": e.join(""),      
                              "extra": extra || {}      
                          }      
                      },      
                      peg$c118 = function(attr) {      
                          return {      
                              "attr": attr.join("")      
                          }      
                      },      
                      peg$c119 = "=",      
                      peg$c120 = {      
                          type: "literal",      
                          value: "=",      
                          description: "\"=\""      
                      },      
                      peg$c121 = function(attr, val) {      
                          return {      
                              "attr_is": attr.join(""),      
                              "value": val.join("")      
                          }      
                      },      
                      peg$c122 = "~=",      
                      peg$c123 = {      
                          type: "literal",      
                          value: "~=",      
                          description: "\"~=\""      
                      },      
                      peg$c124 = function(attr, val) {      
                          return {      
                              "attr_has_word": attr.join(""),      
                              "value": val.join("")      
                          }      
                      },      
                      peg$c125 = "|=",      
                      peg$c126 = {      
                          type: "literal",      
                          value: "|=",      
                          description: "\"|=\""      
                      },      
                      peg$c127 = function(attr, val) {      
                          return {      
                              "attr_starts_hyphen": attr.join(""),      
                              "value": val.join("")      
                          }      
                      },      
                      peg$c128 = "^=",      
                      peg$c129 = {      
                          type: "literal",      
                          value: "^=",      
                          description: "\"^=\""      
                      },      
                      peg$c130 = function(attr, val) {      
                          return {      
                              "attr_starts": attr.join(""),      
                              "value": val.join("")      
                          }      
                      },      
                      peg$c131 = "$=",      
                      peg$c132 = {      
                          type: "literal",      
                          value: "$=",      
                          description: "\"$=\""      
                      },      
                      peg$c133 = function(attr, val) {      
                          return {      
                              "attr_ends": attr.join(""),      
                              "value": val.join("")      
                          }      
                      },      
                      peg$c134 = "*=",      
                      peg$c135 = {      
                          type: "literal",      
                          value: "*=",      
                          description: "\"*=\""      
                      },      
                      peg$c136 = function(attr, val) {      
                          return {      
                              "attr_has": attr.join(""),      
                              "value": val.join("")      
                          }      
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
                          null, [{      
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
            
                          for (p = startPos; p < endPos; p++) {      
                              ch = input.charAt(p);      
                              if (ch === "\n") {      
                                  if (!details.seenCR) {      
                                      details.line++;      
                                  }      
                                  details.column = 1;      
                                  details.seenCR = false;      
                              } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {      
                                  details.line++;      
                                  details.column = 1;      
                                  details.seenCR = true;      
                              } else {      
                                  details.column++;      
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
            
                          expected.sort(function(a, b) {      
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
                                  i++;      
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
                                  .replace(/[\x00-\x07\x0B\x0E\x0F]/g, function(ch) {      
                                      return '\\x0' + hex(ch);      
                                  })      
                                  .replace(/[\x10-\x1F\x80-\xFF]/g, function(ch) {      
                                      return '\\x' + hex(ch);      
                                  })      
                                  .replace(/[\u0180-\u0FFF]/g, function(ch) {      
                                      return '\\u0' + hex(ch);      
                                  })      
                                  .replace(/[\u1080-\uFFFF]/g, function(ch) {      
                                      return '\\u' + hex(ch);      
                                  });      
                          }      
            
                          var expectedDescs = new Array(expected.length),      
                              expectedDesc, foundDesc, i;      
            
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
                          peg$currPos++;      
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
                              peg$currPos++;      
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
                                  peg$currPos++;      
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
                          peg$currPos++;      
                      } else {      
                          s1 = peg$FAILED;      
                          if (peg$silentFails === 0) {      
                              peg$fail(peg$c10);      
                          }      
                      }      
                      if (s1 !== peg$FAILED) {      
                          if (input.charCodeAt(peg$currPos) === 58) {      
                              s2 = peg$c9;      
                              peg$currPos++;      
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
                          peg$currPos++;      
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
                                  peg$currPos++;      
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
                                          peg$currPos++;      
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
                                              peg$currPos++;      
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
                                          peg$currPos++;      
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
                          peg$currPos++;      
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
                                  peg$currPos++;      
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
                                              peg$currPos++;      
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
                          peg$currPos++;      
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
                                  peg$currPos++;      
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
                              peg$currPos++;      
                          } else {      
                              s2 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c110);      
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
                          if (input.charCodeAt(peg$currPos) === 43) {      
                              s2 = peg$c112;      
                              peg$currPos++;      
                          } else {      
                              s2 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c113);      
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
                          if (input.charCodeAt(peg$currPos) === 126) {      
                              s2 = peg$c115;      
                              peg$currPos++;      
                          } else {      
                              s2 = peg$FAILED;      
                              if (peg$silentFails === 0) {      
                                  peg$fail(peg$c116);      
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
                              if (input.charCodeAt(peg$currPos) === 61) {      
                                  s3 = peg$c119;      
                                  peg$currPos++;      
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
          })();      
            
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
                  } else if (data.extra.contains) {      
                      if (!element.getAttribute("data-placebo-prevent-children")) {      
                          child = document.createElement(data.extra.contains);      
                          element.appendChild(child);      
                      }      
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
                  "export": function(map) {      
                      var i;      
                      for (i = 0; i < this.elements.length; i += 1) {      
                          map(this.elements[i]);      
                      }      
                      return this;      
                  },      
                  "loadOrder": loadOrder,      
                  "on": function(event, callback) {      
                      var i;      
                      for (i = 0; i < this.elements.length; i += 1) {      
                          this.elements[i].addEventListener(event, callback);      
                      }      
                      return this;      
                  },      
                  "place": function(parent) {      
                      var load = [],      
                          i,      
                          b,      
                          c,      
                          d;      
                      if (!parent) {      
                          if (document.body) {      
                              parent = [document.body];      
                          } else {      
                              throw "Placebo requires a document with a body!";      
                          }      
                      }      
                      if (typeof parent === "string") {      
                          parent = document.querySelectorAll(parent);      
                      } else if (parent.placebo) {      
                          parent = parent.elements;      
                      } else if (!parent.length) {      
                          parent = [parent];      
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
                          for (d = 0; d < parent.length; d += 1) {      
                              load[1][b](load[0][b], parent[d]);      
                          }      
                      }      
                      for (c = 0; c < this.done.length; c += 1) {      
                          this.done[c](parent);      
                      }      
                      return this;      
                  },      
                  "placebo": true,      
                  "special": special,      
                  "style": function(styles) {      
                      var keys = Object.getOwnPropertyNames(styles),      
                          i,      
                          a;      
                      for (i = 0; i < keys.length; i += 1) {      
                          for (a = 0; a < this.elements.length; a += 1) {      
                              this.elements[a].style[keys[i]] = styles[keys[i]];      
                          }      
                      }      
                      return this;      
                  },      
                  "text": function(text) {      
                      var i;      
                      for (i = 0; i < this.elements.length; i += 1) {      
                          this.elements[i].innerHTML = text;      
                      }      
                      return this;      
                  }      
              };      
          }      
          context.placebo = placebo;      
      }(this));
    },
    'ender': function (module, exports, require, global) {
      (function ($) {      
          'use strict';      
          $.ender(placebo);      
          $.ender({      
              placebo: placebo      
          });      
      }(ender));
    }
  }, 'placebo');

  require('bonzo');
  require('bonzo/src\ender');
  require('placebo-js');
  require('placebo-js/ender');

}.call(window));
//# sourceMappingURL=ender.js.map
