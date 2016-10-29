export default class Factory {
  constructor(tree) {
    this.tree = tree;
    this.elements = [];

    // Only populate this.elements if there is a DOM
    if (typeof document !== 'undefined' && typeof document.createElement === 'function') {
      for (let i = 0; i < tree.children.length; i += 1) {
        this.elements.push(tree.children[i].asDOM());
      }
    }
  }
  /**
   * Converts the tree into an HTML string
   * @return {String} The HTML
   */
  html() {
    let html = '';
    for (let i = 0; i < this.tree.children.length; i += 1) {
      html += this.tree.children[i].asHTML();
    }
    return html;
  }
  /**
   * Places the elements in the DOM
   * @param  {Object} target The element to append to, defaults to document.body
   * @return {Object}        The target element, with the new nodes appended
   */
  place(target) {
    let parent = target;
    if (typeof document !== 'undefined') {
      if (typeof parent === 'undefined') {
        // If target is undefined, default to document.body
        if (typeof document.body !== 'undefined') {
          parent = document.body;
        } else {
          throw new Error('No parent element supplied to placebo.place()!');
        }
      }
      for (let i = 0; i < this.elements.length; i += 1) {
        parent.appendChild(this.elements[i]);
      }
      return parent;
    }
    throw new Error('placebo.place() requires a document!');
  }
}
