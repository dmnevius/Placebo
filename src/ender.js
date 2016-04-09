/**
 * Integration for Ender
 *
 * This file is excluded from the main build and is instead loaded from the package.json
 */

(function ($) {
  var placebo = require("placebo-js");

  $.ender(placebo);
  $.ender({
    "placebo": placebo
  });
}(ender));
