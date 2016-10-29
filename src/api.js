import builder from './builder';

export const version = '2.3.0';

/**
 * Adds a new pseudo selector
 * @param  {String}   selector The ::pseudo selector to search for
 * @param  {Function} callback A function that takes two arguments,
 *                             the first being the element and the
 *                             second being the user's supplied value,
 */
export function addPseudoBehavior(selector, callback) {
  builder.pseudoSelectors[selector] = callback;
}

/**
 * Adds a function that will be run when all the selectors have finished
 * @param  {Function} callback The function to run
 */
export function onPseudoDone(callback) {
  builder.pseudoSelectorsDone.push(callback);
}
