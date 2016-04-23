QUnit.test("ender", function (assert) {
  var placebo = require("placebo-js");

  assert.ok(placebo("div p").html() == "<div><p></p></div>");
});

QUnit.test("requirejs", function (assert) {
  var loaded = assert.async();

  // Basic usage
  requirejs(["placebo"], function (placebo) {
    assert.ok(placebo("div p").html() == "<div><p></p></div>");

    // Right now, plugins require a global "placebo" definition
    requirejs.config({
      paths: {
        placebo: '../placebo'
      }
    });

    // With plugins
    requirejs(['../plugins/family/family', '../plugins/input/input', '../plugins/text/text'], function (family, input, text) {
      assert.ok(placebo("div:text(foo)").html() === "<div>foo</div>");

      loaded();
    });

  });
});
