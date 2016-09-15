/**
 * Interface
 *
 * Provides a global method of accessing Placebo
*/

/**
 * Helpful methods and storage information for generated elements
 * @param  {Array} elements  An array of elements created by placebo.builder
 * @return {Object}          An object with methods for interacting with the elements
 */
placebo.interface = function (root) {
  /**
   * A collection of methods for interacting with the elements
   * @type {Object}
   */
  var _interface = {
    "root": root,
    "elements": Array.prototype.slice.call(root.children),
    /**
     * Get the HTML as text of the elements
     * @return {String} The HTML representation of the elements
     */
    "html": function () {
      var container = document.createElement("div"),
        i;
      for (i = 0; i < this.elements.length; i += 1) {
        container.appendChild(this.elements[i]);
      }
      return container.innerHTML;
    },
    "place": function (parent) {
      var i;
      for (i = 0; i < this.elements.length; i += 1) {
        parent.appendChild(this.elements[i]);
      }
      return parent;
    }
  };
  return _interface;
};

/**
 * Public access point for Placebo
 * @param  {String} selector The CSS selector to evaluate
 * @return {Object}          A placebo.interface object
 */
placebo.main = function (selector) {
  return placebo.interface(placebo.builder.build(placebo.parser.parse(selector), function () {
    var i;
    for (i = 0; i < placebo.builder.pseudoSelectorsQueue.length; i += 1) {
      var selector = placebo.builder.pseudoSelectorsQueue[i];
      placebo.builder.pseudoSelectors[selector[0]](selector[1], selector[2]);
    }
    for (i = 0; i < placebo.builder.pseudoSelectorsDone.length; i += 1) {
      placebo.builder.pseudoSelectorsDone[i]();
    }
  }));
};
