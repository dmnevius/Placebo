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
placebo.main.addPseudoBehavior = function (selector, callback) {
  placebo.builder.pseudoSelectors[selector] = callback;
  return callback;
};

/**
 * Adds a selector-unrelated function to be run when all selectors have been applied
 * @param  {Function} callback The function to run
 * @return {Function}          The callback function
 */
placebo.main.onPseudoDone = function (callback) {
  placebo.builder.pseudoSelectorsDone.push(callback);
  return callback;
};

/**
 * Injects plugins into the main Placebo object in AMD environments
 * @param  {Function} plugin The plugin returned by your AMD loader
 * @return {Function}        The plugin
 */
placebo.main.plugin = function (plugin) {
  plugin(placebo.main);
  return plugin;
};

/**
 * Globally visible version number, for identifying if the global Placebo is in fact the one you want
 * @type {String}
 */
placebo.main.version = version;
