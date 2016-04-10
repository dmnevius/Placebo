/**
 * Text plugin for Placebo
 * Powerful selectors for adding text to elements
 *
 * Includes ::after, ::before, ::first-letter, ::first-line, :lang, :text
 */

(function (context) {

  /**
   * Contains three arrays of texts to be inserted at their respective positions
   * @type {Object}
   */
  var texts = {
    "before": [],
    "middle": [],
    "after": []
  },
    /**
     * Adds text to be appended to the end of the element's text
     * @param  {Object} e The target element
     * @param  {String} v The text to append
     * @return {Object}   The modified element
     */
    after = function (e, v) {
      texts.after.push([e, v]);
      return e;
    },
    /**
     * Applies the texts stored in the "texts" object in the correct order
     * @return {Object} The texts object
     */
    applyTexts = function () {
      var i;
      for (i = 0; i < texts.before.length; i += 1) {
        texts.before[i][0].innerText += texts.before[i][1];
      }
      for (i = 0; i < texts.middle.length; i += 1) {
        texts.middle[i][0].innerText += texts.middle[i][1];
      }
      for (i = 0; i < texts.after.length; i += 1) {
        texts.after[i][0].innerText += texts.after[i][1];
      }
      texts.before = [];
      texts.middle = [];
      texts.after = [];
      return texts;
    },
    /**
     * Adds text to be appened to the beginning of the element's text
     * @param  {Object} e The target element
     * @param  {String} v The text to append
     * @return {Object}   The modified element
     */
    before = function (e, v) {
      texts.before.push([e, v]);
      return e;
    },
    /**
     * Sets the first letter of the element's text
     * @param  {Object} e The target element
     * @param  {String} v The text to replace
     * @return {Object}   The modified element
     */
    firstLetter = function (e, v) {
      e.innerText = v[0] + e.innerText.substr(1);
      return e;
    },
    /**
     * Replaces the first line (until a \n character) of text
     * @param  {Object} e The target element
     * @param  {String} v The text to replace
     * @return {Object}   The modified element
     */
    firstLine = function (e, v) {
      var lines = e.innerHTML.split(/\n/);
      e.innerText = v + e.innerText.substr(lines[0].length);
      return e;
    },
    /**
     * Sets the language of the element
     * @param  {Object} e The target element
     * @param  {String} v The language code
     * @return {Object}   The modified element
     */
    lang = function (e, v) {
      e.lang = v;
      return e;
    },
    /**
     * Adds text to be appened to the middle of the element's text
     * @param  {Object} e The target element
     * @param  {String} v The text to append
     * @return {Object}   The modified element
     */
    text = function (e, v) {
      texts.middle.push([e, v]);
      return e;
    }

  if (context.placebo) {
    context.placebo.addPseudoBehavior("after", after);
    context.placebo.addPseudoBehavior("before", before);
    context.placebo.addPseudoBehavior("first-letter", firstLetter, true);
    context.placebo.addPseudoBehavior("first-line", firstLine, true);
    context.placebo.addPseudoBehavior("lang", lang);
    context.placebo.addPseudoBehavior("text", text);
    context.placebo.onPseudoDone(applyTexts);
  } else {
    throw "after.js requires placebo!";
  }

}(this));
