/* @TODO: Fix so parameters are not assigned values */
/* eslint no-param-reassign: ['off'] */
import placebo from './main';
import Element from './element';

export default function () {
  const texts = {
    before: [],
    middle: [],
    after: [],
  };
  placebo.addPseudoBehavior('after', (e, v) => {
    texts.after.push([e, v]);
  });
  placebo.addPseudoBehavior('before', (e, v) => {
    texts.before.splice(0, 0, [e, v]);
  });
  placebo.addPseudoBehavior('first-letter', (e, v) => {
    const text = new Element('#TEXT');
    text.innerText = v[0] + e.innerText.substr(1);
    e.appendChild(text);
  });
  placebo.addPseudoBehavior('lang', (e, v) => {
    e.lang = v;
    e.setAttribute('lang', v);
  });
  placebo.addPseudoBehavior('text', (e, v) => {
    texts.middle.push([e, v]);
  });
  placebo.onPseudoDone(() => {
    let text;
    for (let b = 0; b < texts.before.length; b += 1) {
      text = new Element('#TEXT');
      text.innerText = texts.before[b][1];
      texts.before[b][0].appendChild(text);
    }
    for (let m = 0; m < texts.middle.length; m += 1) {
      text = new Element('#TEXT');
      text.innerText = texts.middle[m][1];
      texts.middle[m][0].appendChild(text);
    }
    for (let a = 0; a < texts.after.length; a += 1) {
      text = new Element('#TEXT');
      text.innerText = texts.after[a][1];
      texts.after[a][0].appendChild(text);
    }
    texts.before = [];
    texts.middle = [];
    texts.after = [];
  });
}
