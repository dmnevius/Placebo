QUnit.test("attributes", function(assert) {

    // Default element
    assert.ok(placebo("[foo=bar]").html() == "<div foo=\"bar\"></div>");

    // Empty attribute
    assert.ok(placebo("div[foo]").html() == "<div foo=\"\"></div>");
    assert.ok(placebo("div[foo=]").html() == "<div foo=\"\"></div>");

    // Basic usage
    assert.ok(placebo("div[foo=bar]").html() == "<div foo=\"bar\"></div>");

    // Alternate notations
    assert.ok(placebo("div[foo~=bar]").html() == "<div foo=\"bar\"></div>");
    assert.ok(placebo("div[foo|=bar]").html() == "<div foo=\"bar\"></div>");
    assert.ok(placebo("div[foo^=bar]").html() == "<div foo=\"bar\"></div>");
    assert.ok(placebo("div[foo$=bar]").html() == "<div foo=\"bar\"></div>");
    assert.ok(placebo("div[foo*=bar]").html() == "<div foo=\"bar\"></div>");

    // Attributes with complex values
    assert.ok(placebo("link[href=http://example.com/styles.css]").html() == "<link href=\"http://example.com/styles.css\">");
});

QUnit.test("children", function(assert) {

    // Basic usage
    assert.ok(placebo("div p").html() == "<div><p></p></div>");

    // With attributes
    assert.ok(placebo("div#top p#middle span#bottom").html() == "<div id=\"top\"><p id=\"middle\"><span id=\"bottom\"></span></p></div>");

    // Four deep
    assert.ok(placebo("div p span h1").html() == "<div><p><span><h1></h1></span></p></div>");

    // With siblings
    assert.ok(placebo("div p, p").html() == "<div><p></p><p></p></div>");

    // Alternate notation
    assert.ok(placebo("div > p").html() == "<div><p></p></div>");
    assert.ok(placebo("div#top > p#middle > span#bottom").html() == "<div id=\"top\"><p id=\"middle\"><span id=\"bottom\"></span></p></div>");
    assert.ok(placebo("div > p > span > h1").html() == "<div><p><span><h1></h1></span></p></div>");
    assert.ok(placebo("div > p, p").html() == "<div><p></p><p></p></div>");

});

QUnit.test("class", function(assert) {

    // Empty element
    assert.ok(placebo(".class").html() == "<div class=\"class\"></div>");

    // Simple usage on a <p>
    assert.ok(placebo("p.class").html() == "<p class=\"class\"></p>");

    // Multiple classes
    assert.ok(placebo("p.foo.bar").html() == "<p class=\"foo bar\"></p>");

    // 100 classes
    var classList = "",
        classHTML = "",
        i;
    for (i = 0; i < 100; i += 1) {
        classList += ".class" + i;
        classHTML += " class" + i;
    }
    assert.ok(placebo("p" + classList).html() == "<p class=\"" + classHTML.replace(/^\s/, "") + "\"></p>");

});

QUnit.test("element", function(assert) {

    // Empty string
    assert.ok(placebo("").html() == "<div></div>");

    // Using a defined element
    assert.ok(placebo("p").html() == "<p></p>");

    // Using custom elements
    assert.ok(placebo("custom-element").html() == "<custom-element></custom-element>");

});

QUnit.test("family", function(assert) {

    // :first-of-type
    assert.ok(placebo("div p:text(1), div:text(2), p:text(3):first-of-type").html() == "<div><p>3</p><p>1</p><div>2</div></div>");

    // :last-child
    assert.ok(placebo("div p:text(1), div:text(2):last-child, p:text(3)").html() == "<div><p>1</p><p>3</p><div>2</div></div>");

    // :nth-child
    assert.ok(placebo("div p:text(1):nth-child(2), div:text(2), p:text(3)").html() == "<div><div>2</div><p>1</p><p>3</p></div>");

    // :nth-last-child
    assert.ok(placebo("div p:text(1), div:text(2), p:text(3):nth-last-child(2)").html() == "<div><p>1</p><p>3</p><div>2</div></div>");

    // :nth-last-of-type
    assert.ok(placebo("div p:text(1):nth-last-of-type(3), div:text(2), p:text(3), div:text(4), p:text(5)").html() == "<div><div>2</div><p>1</p><p>3</p><div>4</div><p>5</p></div>");

    // :nth-of-type
    assert.ok(placebo("div p:text(1):nth-of-type(3), div:text(2), p:text(3), div:text(4), p:text(5)").html() == "<div><div>2</div><p>3</p><div>4</div><p>5</p><p>1</p></div>");

    // :only-of-type
    assert.ok(placebo("div p:text(1):only-of-type, div:text(2), p:text(3), div:text(4), p:text(5)").html() == "<div><p>1</p><div>2</div><div>4</div></div>");

    // :only-child
    assert.ok(placebo("div p:text(1):only-child, div:text(2), p:text(3), div:text(4), p:text(5)").html() == "<div><p>1</p></div>");

});

QUnit.test("id", function(assert) {

    // Empty element
    assert.ok(placebo("#id").html() == "<div id=\"id\"></div>");

    // Basic usage
    assert.ok(placebo("div#id").html() == "<div id=\"id\"></div>");

    // Multiple IDs
    assert.ok(placebo("div#foo#bar").html() == "<div id=\"foo bar\"></div>");

    // 100 IDs
    var idList = "",
        idHTML = "",
        i;
    for (i = 0; i < 100; i += 1) {
        idList += "#id" + i;
        idHTML += " id" + i;
    }
    assert.ok(placebo("p" + idList).html() == "<p id=\"" + idHTML.replace(/^\s/, "") + "\"></p>");

});

QUnit.test("input", function(assert) {
    var elements,
        i,
        ok = true;

    // :checked
    elements = placebo("input[type=checkbox]:checked").elements;
    assert.ok(elements[0].checked && elements[0].type === "checkbox");

    // :disabled
    assert.ok(placebo("input:disabled").html() == "<input disabled=\"\">");

    // :enabled
    assert.ok(placebo("input:disabled:enabled").html() == "<input>");

    // :in-range
    // Uses 100 values
    for (i = 0; i < 100; i += 1) {
        elements = placebo("input[min=5][max=95]:in-range").elements;
        if (Number(elements[0].value) < 5 || Number(elements[0].value) > 95) {
            ok = false;
        }
    }
    assert.ok(ok);

    // :optinal
    assert.ok(placebo("input:required:optional").html() == "<input>");

    // :out-of-range
    ok = true;
    for (i = 0; i < 100; i += 1) {
        elements = placebo("input[min=5][max=95]:out-of-range").elements;
        if (Number(elements[0].value) >= 5 && Number(elements[0].value) <= 95) {
            ok = false;
        }
    }
    assert.ok(ok);

    // :read-only
    assert.ok(placebo("textarea:read-only").html() == "<textarea read-only=\"\"></textarea>");

    // :read-write
    assert.ok(placebo("textarea:read-only:read-write").html() == "<textarea></textarea>");

});

QUnit.test("siblings", function(assert) {
    var elements;

    // Basic usage
    assert.ok(placebo("div, p").html() == "<div></div><p></p>");

    // With IDs and classes
    elements = placebo("div#id1.class + p#id2.class").elements;
    assert.ok(elements[0].id == "id1" && elements[0].className == "class" && elements[1].id == "id2" && elements[1].className == "class");

    // Four siblings
    assert.ok(placebo("div, p, span, h1").html() == "<div></div><p></p><span></span><h1></h1>");

    // With children
    assert.ok(placebo("div, p p").html() == "<div></div><p><p></p></p>");

    // Alternate notation
    assert.ok(placebo("div + p").html() == "<div></div><p></p>");
    elements = placebo("div#id1.class + p#id2.class").elements;
    assert.ok(elements[0].id == "id1" && elements[0].className == "class" && elements[1].id == "id2" && elements[1].className == "class");
    assert.ok(placebo("div + p + span + h1").html() == "<div></div><p></p><span></span><h1></h1>");
    assert.ok(placebo("div + p p").html() == "<div></div><p><p></p></p>");

    // Alternate notation 2
    assert.ok(placebo("div ~ p").html() == "<div></div><p></p>");
    elements = placebo("div#id1.class ~ p#id2.class").elements;
    assert.ok(elements[0].id == "id1" && elements[0].className == "class" && elements[1].id == "id2" && elements[1].className == "class");
    assert.ok(placebo("div ~ p ~ span ~ h1").html() == "<div></div><p></p><span></span><h1></h1>");
    assert.ok(placebo("div ~ p p").html() == "<div></div><p><p></p></p>");

});

QUnit.test("text", function(assert) {

    // ::after, :text & ::before
    assert.ok(placebo("div::after(bar):text(foo )").html() == "<div>foo bar</div>");
    assert.ok(placebo("div::after(bar):text( )::before(foo)").html() == "<div>foo bar</div>");
    assert.ok(placebo("div::after(b)::after(ar):text( )::before(f)::before(oo)").html() == "<div>foo bar</div>");

    // ::first-letter
    assert.ok(placebo("div:text(foo)::first-letter(b)").html() == "<div>bfoo</div>");

    // ::lang
    assert.ok(placebo("div::lang(en-US)").html() == "<div lang=\"en-US\"></div>");

});

QUnit.test("place", function(assert) {

    // Example .place
    placebo("div#foo").place(document.body);
    assert.ok(document.getElementById("foo") !== null);

});

QUnit.test("pseudo", function(assert) {

    // Note: For tests on individual pseudo plugins, see their respective folder inside /plugins

    // Empty element
    assert.ok(placebo(":pseudo").html() == "<div></div>");

    // Basic pseudo
    assert.ok(placebo("div:pseudo").html() == "<div></div>");

    // Double pseudo
    assert.ok(placebo("div::pseudo").html() == "<div></div>");

    // Pseudo with input
    assert.ok(placebo("div:pseudo(Hello World!)").html() == "<div></div>");

});

QUnit.test("unsupported", function(assert) {

    // "*" is not supported, and should be replaced with a <div>
    assert.ok(placebo("*").html() == "<div></div>");

});
