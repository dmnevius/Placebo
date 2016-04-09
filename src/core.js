/**
 * Core Placebo
 *
 * Contains the placebo object and keeps the mess out of the global scope
 */

/**
 * The internal Placebo object
 * @type {Object}
 */
var placebo = {
  /**
   * Check if Placebo is running in an environment with a document
   * @return {bool} True if Placebo finds a document.
   */
  "checkEnvironment": function () {
    if (typeof document === "undefined") {
      throw "Placebo requires a document!";
    }
    return true;
  }
};

placebo.checkEnvironment();
