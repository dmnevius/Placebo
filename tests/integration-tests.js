QUnit.test("ender", function (assert) {
  var placebo = require("placebo-js");

  assert.ok(placebo("div p").html() == "<div><p></p></div>");
});

QUnit.test("requirejs", function (assert) {
  var loaded = assert.async();

  // Basic usage
  requirejs(["placebo"], function (placebo) {
    assert.ok(placebo("div p").html() == "<div><p></p></div>");

    // With plugins
    requirejs(['placebo/family', 'placebo/input', 'placebo/text'], function (family, input, text) {
      assert.ok(placebo("div:text(foo)").html() === "<div>foo</div>");

      loaded();
    });

  });
});
