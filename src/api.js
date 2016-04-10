/**
 * API
 *
 * API for creating ::pseudo plugins
 */

/**
 * Adds a new pseudo selector
 * @param  {String}   selector The ::pseudo selector to search for
 * @param  {Function} callback A function that takes two arguments, the first being the element and the second being the user
 *                            supplied value, that is called when the selector is applied
 * @param  {Boolean} done      If true, the callback function will not be applied until all other pseudo selectors have
 *                            been applied
 * @return {Function}          The callback function
 */
placebo.main.addPseudoBehavior = function (selector, callback, done) {
  if (done) {
    placebo.builder.pseudoSelectorsDone[selector] = callback;
  } else {
    placebo.builder.pseudoSelectors[selector] = callback;
  }
  return callback;
};

/**
 * Adds a selector-unrelated function to be run when all selectors have been applied
 * @param  {Function} callback The function to run
 * @return {Function}          The callback function
 */
placebo.main.onPseudoDone = function (callback) {
  placebo.builder.pseudoSelectorsQueue.push(callback);
  return callback;
};
