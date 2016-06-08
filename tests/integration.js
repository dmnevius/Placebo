QUnit.test("amd", function(assert) {
    var loaded = assert.async();

    requirejs(['../dist/placebo.js', '../plugins/text.js', '../plugins/family.js', '../plugins/input.js'], function(placeboAMD, textAMD, familyAMD, inputAMD) {
        assert.ok(placeboAMD("div p").html() == "<div><p></p></div>");
        placeboAMD.plugin(textAMD);
        placeboAMD.plugin(familyAMD);
        placeboAMD.plugin(inputAMD);
        assert.ok(placeboAMD("div:text(foo)").html() == "<div>foo</div>");
        assert.ok(placeboAMD("div p:only-child, p").html() == "<div><p></p></div>");
        assert.ok(placeboAMD("input[type=checkbox]:checked").html() == "<input checked=\"\" type=\"checkbox\">");
        loaded();
    });

});

QUnit.test("cjs", function(assert) {
    var loaded = assert.async();

    System.import("../dist/placebo.js").then(function(placeboCJS) {
        assert.ok(placeboCJS("div p").html() == "<div><p></p></div>");

        // Plugins
        System.import("../plugins/text.js").then(function(textCJS) {
            placeboCJS.plugin(textCJS);
            assert.ok(placeboCJS("div:text(foo)").html() == "<div>foo</div>");
            System.import("../plugins/family.js").then(function(familyCJS) {
                placeboCJS.plugin(familyCJS);
                assert.ok(placeboCJS("div p:only-child, p").html() == "<div><p></p></div>");
                System.import("../plugins/input.js").then(function(inputCJS) {
                    placeboCJS.plugin(inputCJS);
                    assert.ok(placeboCJS("input[type=checkbox]:checked").html() == "<input checked=\"\" type=\"checkbox\">");
                    loaded();
                });
            });
        });
    });
});
