/**
 * {{Name}} plugin for Placebo
 * {{Description}}
 *
 * Includes {{Includes}}
 */

(function (context) {

  var bar = function (e, v) {
    // Pseudo logic goes here
  }

  if (context.placebo) {
    // Pseudo registration goes here
    // context.placebo.addPseudoBehavior('foo', bar);
  } else {
    throw "{{File Name}}.js requires placebo!";
  }

}(this));
