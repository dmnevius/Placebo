import { addPseudoBehavior, onPseudoDone, version } from './api';
import builder from './builder';
import Factory from './factory';
import parser from './parser';
import family from './family';
import input from './input';
import text from './text';

/**
 * The main placebo interface
 * @param  {String} selector A valid CSS selector
 *
 * @TODO Determine return type
 * @return {[type]}          [description]
 */
function placebo(selector) {
  // Parse the selector
  const parsed = parser.parse(selector);

  // Pass the parsed information to the builder
  const built = builder.build(parsed);

  // Apply psuedo selectors
  for (let i = 0; i < builder.pseudoSelectorsQueue.length; i += 1) {
    const item = builder.pseudoSelectorsQueue[i];
    builder.pseudoSelectors[item[0]](item[1], item[2]);
  }

  // Run pseudoSelectorsDone callbacks
  for (let a = 0; a < builder.pseudoSelectorsDone.length; a += 1) {
    builder.pseudoSelectorsDone[a]();
  }

  // Return a new factory using the constructed tree
  return new Factory(built);
}

// Add API endpoints to the main object
placebo.addPseudoBehavior = addPseudoBehavior;
placebo.onPseudoDone = onPseudoDone;
placebo.version = version;

/**
 * Helper for initializing plugins
 * @param  {Function} factory A function accepting placebo as its input
 * @return {Object}           Placebo
 */
placebo.plugin = function plugin(factory) {
  factory(placebo);
  return placebo;
};

// Load plugins
family();
input();
text();

export default placebo;
