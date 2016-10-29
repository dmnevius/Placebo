import placebo from './main';

export default function () {
  placebo.addPseudoBehavior('empty', (e) => {
    if (e.children.length > 0) {
      for (let c = 0; c < e.children.length; c += 1) {
        e.children[c].parentNode.removeChild(e.children[c]);
      }
    }
  });
  placebo.addPseudoBehavior('first-of-type', (e) => {
    const parent = e.parentNode;
    const ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    parent.insertBefore(e, ofType[0]);
  });
  placebo.addPseudoBehavior('last-child', (e) => {
    const parent = e.parentNode;
    parent.removeChild(e);
    parent.appendChild(e);
  });
  placebo.addPseudoBehavior('last-of-type', (e) => {
    const parent = e.parentNode;
    const ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    parent.insertBefore(e, ofType[ofType.length - 1].nextSibling);
  });
  placebo.addPseudoBehavior('nth-child', (e, v) => {
    const parent = e.parentNode;
    parent.removeChild(e);
    if (parent.children[Number(v) - 1]) {
      parent.insertBefore(e, parent.children[Number(v) - 1]);
    } else {
      parent.appendChild(e);
    }
  });
  placebo.addPseudoBehavior('nth-last-child', (e, v) => {
    const parent = e.parentNode;
    parent.removeChild(e);
    if (parent.children[parent.children.length - (Number(v) - 1)]) {
      parent.insertBefore(e, parent.children[parent.children.length - (Number(v) - 1)]);
    } else {
      parent.insertBefore(e, parent.children[0]);
    }
  });
  placebo.addPseudoBehavior('nth-last-of-type', (e, v) => {
    const parent = e.parentNode;
    const ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    if (ofType[ofType.length - (Number(v) - 1)]) {
      parent.insertBefore(e, ofType[ofType.length - (Number(v) - 1)]);
    } else {
      parent.appendChild(e);
    }
  });
  placebo.addPseudoBehavior('nth-of-type', (e, v) => {
    const parent = e.parentNode;
    const ofType = parent.getElementsByTagName(e.nodeName);
    parent.removeChild(e);
    if (ofType[Number(v) - 1]) {
      if (ofType[Number(v) - 1].nextSibling) {
        parent.insertBefore(e, ofType[Number(v) - 1].nextSibling);
      } else {
        parent.appendChild(e);
      }
    } else {
      parent.insertBefore(e, ofType[ofType.length - 1].nextSibling);
    }
  });
  placebo.addPseudoBehavior('only-of-type', (e) => {
    const parent = e.parentNode;
    const ofType = parent.getElementsByTagName(e.nodeName);
    for (let i = 0; i < ofType.length; i += 1) {
      if (ofType[i].nodeID !== e.nodeID) {
        parent.removeChild(ofType[i]);
      }
    }
  });
  placebo.addPseudoBehavior('only-child', (e) => {
    const parent = e.parentNode;
    while (parent.children.length > 0) {
      parent.removeChild(parent.children[0]);
    }
    parent.appendChild(e);
  });
}
