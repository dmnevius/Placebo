/**
 * Integration for various environments
 */

if (typeof module !== "undefined" && module.exports) {
  module.exports = placebo.main;
} else if (typeof define == "function" && define.amd) {
  define('placebo', function () {
    return placebo.main;
  });
} else {
  context.placebo = placebo.main;
}
