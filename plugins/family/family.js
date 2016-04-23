/**
 * Family plugin for Placebo
 * Large assortment of tools for modifying element's position in the DOM
 *
 * Includes :empty, :first-of-type, :last-child, :last-of-type, :nth-child(n), :nth-last-child(n), :nth-last-of-type(n),
 * 					:nth-of-type(n), :only-of-type, :only-child
 */

(function (context) {

  /**
   * Removes all children from the element
   * @param  {Object} e The target element
   * @return {Object}   The element
   */
  var empty = function (e) {
    var i;
    if (e.children.length > 0) {
      for (i = 0; i < e.children.length; i += 1) {
        e.children[i].parentNode.removeChild(e.children[i]);
      }
    }
    return e;
  },
    /**
     * Inserts the element as the first of its node type
     * @param  {Object} e The target element
     * @return {Object}   The element
     */
    firstOfType = function (e) {
      var parent = e.parentNode,
        ofType = parent.getElementsByTagName(e.nodeName);
      parent.removeChild(e);
      parent.insertBefore(e, ofType[0]);
      return e;
    },
    /**
     * Insert the element as the last child of its parent
     * @param  {Object} e The target element
     * @return {Object}   The element
     */
    lastChild = function (e) {
      var parent = e.parentNode;
      parent.removeChild(e);
      parent.appendChild(e);
      return e;
    },
    /**
     * Insert the element as the last of its type
     * @param  {Object} e The target element
     * @return {Object}   The element
     */
    lastOfType = function (e) {
      var parent = e.parentNode,
        ofType = parent.getElementsByTagName(e.nodeName);
      parent.removeChild(e);
      parent.insertBefore(e, ofType[ofType.length - 1].nextSibling);
      return e;
    },
    /**
     * Insert the element as the nth child of its parent
     * @param  {Object} e The target element
     * @param  {String} v "n"
     * @return {Object}   The element
     */
    nthChild = function (e, v) {
      var parent = e.parentNode;
      parent.removeChild(e);
      if (parent.children[Number(v) - 1]) {
        parent.insertBefore(e, parent.children[Number(v) - 1]);
      } else {
        parent.appendChild(e);
      }
      return e;
    },
    /**
     * Insert the element as the child nth from the last child of its parent
     * @param  {Object} e The target element
     * @param  {String} v "n"
     * @return {Object}   The element
     */
    nthLastChild = function (e, v) {
      var parent = e.parentNode;
      parent.removeChild(e);
      if (parent.children[parent.children.length - Number(v) + 1]) {
        parent.insertBefore(e, parent.children[parent.children.length - Number(v) + 1]);
      } else {
        parent.insertBefore(e, parent.children[0]);
      }
      return e;
    },
    /**
     * Insert the element as the child nth from the last child of the same type of its parent
     * @param  {Object} e The target element
     * @param  {String} v "n"
     * @return {Object}   The element
     */
    nthLastOfType = function (e, v) {
      var parent = e.parentNode,
        ofType = parent.getElementsByTagName(e.nodeName);
      parent.removeChild(e);
      if (ofType[ofType.length - Number(v) + 1]) {
        parent.insertBefore(e, ofType[ofType.length - Number(v) + 1]);
      } else {
        parent.appendChild(e);
      }
      return e;
    },
    /**
     * Insert the element as the ntn child of its type
     * @param  {Object} e The target element
     * @param  {String} v "n"
     * @return {Object}   The element
     */
    nthOfType = function (e, v) {
      var parent = e.parentNode,
        ofType = parent.getElementsByTagName(e.nodeName);
      parent.removeChild(e);
      if (ofType[Number(v) - 1]) {
        parent.insertBefore(e, ofType[Number(v) - 1]);
      } else {
        parent.insertBefore(e, ofType[ofType.length - 1].nextSibling);
      }
      return e;
    },
    /**
     * Removes all elements of the same type
     * @param  {Object} e The target element
     * @return {Object}   The target element
     */
    onlyOfType = function (e) {
      var parent = e.parentNode,
        ofType = parent.getElementsByTagName(e.nodeName),
        next,
        i;
      while (ofType.length > 0) {
        next = ofType[0].nextSibling;
        parent.removeChild(ofType[0]);
      }
      parent.insertBefore(e, next);
      return e;
    },
    /**
     * Removes all children except the target element
     * @param  {Object} e The target element
     * @return {Object}   The target element
     */
    onlyChild = function (e) {
      var parent = e.parentNode;
      while (parent.children.length > 0) {
        parent.removeChild(parent.children[0]);
      }
      parent.appendChild(e);
      return e;
    },
    /**
     * Registers the pseudo selectors in any environment
     * @param  {Object} placebo The placebo object
     * @return {Object}         The placebo object
     */
    register = function (placebo) {
      placebo.addPseudoBehavior("empty", empty, true);
      placebo.addPseudoBehavior("first-of-type", firstOfType, true);
      placebo.addPseudoBehavior("last-child", lastChild, true);
      placebo.addPseudoBehavior("last-of-type", lastOfType, true);
      placebo.addPseudoBehavior("nth-child", nthChild, true);
      placebo.addPseudoBehavior("nth-last-child", nthLastChild, true);
      placebo.addPseudoBehavior("nth-last-of-type", nthLastOfType, true);
      placebo.addPseudoBehavior("nth-of-type", nthOfType, true);
      placebo.addPseudoBehavior("only-of-type", onlyOfType, true);
      placebo.addPseudoBehavior("only-child", onlyChild, true);
      return placebo;
    };

  if (context.placebo) {
    register(context.placebo);
  } else if (typeof define === "function" && define.amd) {
    define(['placebo'], function (placebo) {
      return register(placebo);
    });
  } else if (typeof require === "function") {
    register(require("placebo-js"));
  } else {
    throw "family.js requires placebo!";
  }

}(this));
