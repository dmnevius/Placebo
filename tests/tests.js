QUnit.test("attributes", function (assert) {

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

QUnit.test("children", function (assert) {

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

QUnit.test("class", function (assert) {

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

QUnit.test("element", function (assert) {

  // Empty string
  assert.ok(placebo("").html() == "<div></div>");

  // Using a defined element
  assert.ok(placebo("p").html() == "<p></p>");

  // Using custom elements
  assert.ok(placebo("custom-element").html() == "<custom-element></custom-element>");

});

QUnit.test("id", function (assert) {

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

QUnit.test("siblings", function (assert) {

  // Basic usage
  assert.ok(placebo("div, p").html() == "<div></div><p></p>");

  // With IDs and classes
  assert.ok(placebo("div#id1.class, p#id2.class").html() == "<div class=\"class\" id=\"id1\"></div><p class=\"class\" id=\"id2\"></p>");

  // Four siblings
  assert.ok(placebo("div, p, span, h1").html() == "<div></div><p></p><span></span><h1></h1>");

  // With children
  assert.ok(placebo("div, p p").html() == "<div></div><p><p></p></p>");

  // Alternate notation
  assert.ok(placebo("div + p").html() == "<div></div><p></p>");
  assert.ok(placebo("div#id1.class + p#id2.class").html() == "<div class=\"class\" id=\"id1\"></div><p class=\"class\" id=\"id2\"></p>");
  assert.ok(placebo("div + p + span + h1").html() == "<div></div><p></p><span></span><h1></h1>");
  assert.ok(placebo("div + p p").html() == "<div></div><p><p></p></p>");

  // Alternate notation 2
  assert.ok(placebo("div ~ p").html() == "<div></div><p></p>");
  assert.ok(placebo("div#id1.class ~ p#id2.class").html() == "<div class=\"class\" id=\"id1\"></div><p class=\"class\" id=\"id2\"></p>");
  assert.ok(placebo("div ~ p ~ span ~ h1").html() == "<div></div><p></p><span></span><h1></h1>");
  assert.ok(placebo("div ~ p p").html() == "<div></div><p><p></p></p>");

});

QUnit.test("place", function (assert) {

  // Example .place
  placebo("div#foo").place(document.body);
  assert.ok(document.getElementById("foo") !== null);

});

QUnit.test("pseudo", function (assert) {

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

QUnit.test("unsupported", function (assert) {

  // "*" is not supported, and should be replaced with a <div>
  assert.ok(placebo("*").html() == "<div></div>");

});
