/**
 * Input plugin for placebo
 * A collection of selectors for <input>; elements
 *
 * Includes :checked, :disabled, :enabled, :in-range, :optional, :out-of-range, :read-only, :read-write
 */

(function (context) {

  /**
   * Checks a checkbox
   * @param  {Object} e The target element
   * @return {Object}   The modified element
   */
  var checked = function (e) {
    e.checked = true;
    return e;
  },
    /**
     * Disables any input
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    disabled = function (e) {
      e.disabled = true;
      return e;
    },
    /**
     * Enables any input
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    enabled = function (e) {
      e.disabled = false;
      return e;
    },
    /**
     * Seeds the input with a random number within its valid range
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    inRange = function (e) {
      var min = 0,
        max = 100;
      if (e.min) {
        min = Number(e.min);
      }
      if (e.max) {
        max = Number(e.max);
      }
      e.value = Math.floor(Math.random() * (max - min + 1) + min);
      return e;
    },
    /**
     * Sets the input as optional
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    optional = function (e) {
      e.required = false;
      return e;
    },
    /**
     * Seeds the input with a random number outside of its specified range
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    outOfRange = function (e) {
      var min = 0,
        max = 100;
      if (e.min) {
        min = Number(e.min);
      }
      if (e.max) {
        max = Number(e.max);
      }
      if ((Math.floor(Math.random() * (max - min - 1)) + min) % 2 == 0) {
        e.value = Math.floor(Math.random() * ((min * -1) - min - 1) + (min * -1));
      } else {
        e.value = Math.floor(Math.random() * ((max * 2) - max - 1) + (max * 2));
      }
      return e;
    },
    /**
     * Set the element as read-only
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    readOnly = function (e) {
      e.readonly = true;
      return e;
    },
    /**
     * Set the element as read-write
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    readWrite = function (e) {
      e.readonly = false;
      return e;
    },
    /**
     * Set the input as required
     * @param  {Object} e The target element
     * @return {Object}   The modified element
     */
    required = function (e) {
      e.required = true;
      return e;
    };

  if (context.placebo) {
    context.placebo.addPseudoBehavior("checked", checked);
    context.placebo.addPseudoBehavior("disabled", disabled);
    context.placebo.addPseudoBehavior("enabled", enabled);
    context.placebo.addPseudoBehavior("in-range", inRange);
    context.placebo.addPseudoBehavior("optional", optional);
    context.placebo.addPseudoBehavior("out-of-range", outOfRange);
    context.placebo.addPseudoBehavior("read-only", readOnly);
    context.placebo.addPseudoBehavior("read-write", readWrite);
    context.placebo.addPseudoBehavior("required", required);
  } else {
    throw "input.js requires placebo!";
  }

}(this));
