/* @TODO: Fix so parameters are not assigned values */
/* eslint no-param-reassign: ['off'] */
import placebo from './main';

export default function () {
  placebo.addPseudoBehavior('checked', (e) => {
    e.checked = true;
    e.setAttribute('checked', '');
  });
  placebo.addPseudoBehavior('disabled', (e) => {
    e.disabled = true;
    e.setAttribute('disabled', '');
  });
  placebo.addPseudoBehavior('enabled', (e) => {
    e.disabled = false;
    e.removeAttribute('disabled');
  });
  placebo.addPseudoBehavior('in-range', (e) => {
    let min = 0;
    let max = 100;
    let value = 50;
    if (e.attributes.min) {
      min = Number(e.attributes.min);
    }
    if (e.attributes.max) {
      max = Number(e.attributes.max);
    }
    value = Math.floor((Math.random() * ((max - min) + 1)) + min);
    e.value = value;
    e.setAttribute('value', value);
  });
  placebo.addPseudoBehavior('optional', (e) => {
    e.required = false;
    e.removeAttribute('required');
  });
  placebo.addPseudoBehavior('out-of-range', (e) => {
    let min = 0;
    let max = 100;
    let value = 101;
    if (e.min) {
      min = Number(e.min);
    }
    if (e.max) {
      max = Number(e.max);
    }
    if ((Math.floor((Math.random() * (max - min - 1)) + min)) % 2 === 0) {
      value = Math.floor((Math.random() * ((min * -1) - min - 1)) + (max * -1));
    } else {
      value = Math.floor((Math.random() * ((max * 2) - max - 1)) + (max * 2));
    }
    e.value = value;
    e.setAttribute('value', value);
  });
  placebo.addPseudoBehavior('read-only', (e) => {
    e.readonly = true;
    e.setAttribute('read-only', '');
  });
  placebo.addPseudoBehavior('read-write', (e) => {
    e.readonly = false;
    e.removeAttribute('read-only');
  });
  placebo.addPseudoBehavior('required', (e) => {
    e.required = true;
    e.setAttribute('required', '');
  });
}
