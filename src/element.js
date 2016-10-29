export default class Element {
  constructor(tag, parent) {
    this.nodeName = tag.toUpperCase();
    this.children = [];
    this.attributes = {};
    this.innerText = '';
    this.parentNode = parent;
    this.nextSibling = null;
    this.lang = '';
    if (this.nodeName === 'INPUT') {
      this.checked = false;
      this.disabled = false;
      this.required = false;
      this.readonly = false;
      this.min = '';
      this.max = '';
      this.value = '';
      this.required = '';
    }
  }
  asDOM() {
    if (typeof document !== 'undefined') {
      if (this.nodeName === '#TEXT') {
        return document.createTextNode(this.innerText);
      }
      const element = document.createElement(this.nodeName);
      const attributes = Object.getOwnPropertyNames(this.attributes);
      for (let a = 0; a < attributes.length; a += 1) {
        element.setAttribute(attributes[a], this.attributes[attributes[a]]);
      }
      for (let i = 0; i < this.children.length; i += 1) {
        element.appendChild(this.children[i].asDOM());
      }
      return element;
    }
    throw new Error('Element could not be converted to DOM - No document was found!');
  }
  asHTML() {
    if (this.nodeName === '#TEXT') {
      return this.innerText;
    }
    const selfClosing = ['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'MENUITEM', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR'];
    let string = `<${this.nodeName.toLowerCase()}`;
    const attributes = Object.getOwnPropertyNames(this.attributes);
    for (let i = 0; i < attributes.length; i += 1) {
      string += ` ${attributes[i]}="${this.attributes[attributes[i]]}"`;
    }
    if (selfClosing.indexOf(this.nodeName) > -1 && this.children.length < 1) {
      string += ' />';
    } else {
      string += '>';
      for (let i = 0; i < this.children.length; i += 1) {
        string += this.children[i].asHTML();
      }
      string += `</${this.nodeName.toLowerCase()}>`;
    }
    return string;
  }
  appendChild(child) {
    const node = child;
    node.parentNode = this;
    node.nodeID = this.children.length;
    this.children.push(node);
    this.rebuildTree();
  }
  appendToAttribute(attribute, value) {
    // Ensure attribute exists and is a string
    if (typeof this.attributes[attribute] !== 'string') {
      this.attributes[attribute] = value;
    } else {
      this.attributes[attribute] += ` ${value}`;
    }
  }
  getElementsByTagName(tag) {
    const result = [];
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].nodeName === tag.toUpperCase()) {
        result.push(this.children[i]);
      }
      result.concat(this.children[i].getElementsByTagName(tag));
    }
    return result;
  }
  getChildIDs() {
    // For debugging
    const output = [];
    for (let i = 0; i < this.children.length; i += 1) {
      output.push(this.children[i].nodeID);
    }
    return output;
  }
  insertBefore(newChild, target) {
    for (let i = 0; i < this.children.length; i += 1) {
      if (typeof this.children[i] !== 'undefined' && this.children[i].nodeID === target.nodeID) {
        this.children.splice(i, 0, newChild);
        break;
      }
    }
    this.rebuildTree();
  }
  rebuildTree() {
    for (let i = 0; i < this.children.length; i += 1) {
      this.children[i].nextSibling = this.children[i + 1];
    }
  }
  removeChild(child) {
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].nodeID === child.nodeID) {
        this.children.splice(i, 1);
        break;
      }
    }
    this.rebuildTree();
  }
  removeAttribute(attribute) {
    delete this.attributes[attribute];
  }
  setAttribute(attribute, value) {
    this.attributes[attribute] = value;
  }
}
