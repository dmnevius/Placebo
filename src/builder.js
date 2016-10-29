import Element from './element';

const builder = {

  /**
   * Creates a tree of elements from a parsed selector
   * @param  {Object}  parsed Result of parser.parse
   * @return {Element}        The container element
   */
  build(input) {
    /**
     * A temporary holding place for all constructed elements
     * @type {Element}
     */
    const container = new Element('div');

    /**
     * Contains a possibly modified form of input
     * @type {Object}
     */
    let parsed = input;

    // Make sure parsed is an array
    if (typeof parsed.length !== 'number') {
      parsed = [parsed];
    }

    for (let i = 0; i < parsed.length; i += 1) {
      const element = parsed[i];
      // The * selector dosen't really make sense in the context of Placebo,
      // so if encountered, just change it to a <div>
      if (element.node === '*') {
        element.node = 'div';
      }
      /**
       * The current element
       * @type {Element}
       */
      const target = new Element(element.node);

      // Apply rules
      for (let r = 0; r < element.extra.length; r += 1) {
        this.rules[element.extra[r].name](target, element.extra[r].value);
      }

      // Add new element to the container
      container.appendChild(target);
    }
    return container;
  },
  rules: {
    attribute(element, values) {
      element.setAttribute(values[0], values[1]);
    },
    child(element, value) {
      const children = builder.build(value).children;
      for (let i = 0; i < children.length; i += 1) {
        element.appendChild(children[i]);
      }
    },
    class(element, value) {
      element.appendToAttribute('class', value);
    },
    id(element, value) {
      element.appendToAttribute('id', value);
    },
    pseudo(element, values) {
      // If there is a pseudo selector match, append it to the queue
      if (typeof builder.pseudoSelectors[values[0]] === 'function') {
        builder.pseudoSelectorsQueue.push([values[0], element, values[1]]);
      }
      // If not, do nothing
    },
  },
  pseudoSelectors: {},
  pseudoSelectorsQueue: [],
  pseudoSelectorsDone: [],
};

export default builder;
