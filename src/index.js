import h from './mySnabbdom/h.js';
import patch from './mySnabbdom/patch.js';

const old = h('ul', {}, [
    h('li', {key: 'a'}, 'aaa'),
    h('li', {key: 'b'}, 'bbb'),
    h('li', {key: 'c'}, 'ccc'),
]);
const new1 = h('ul', {}, [
    h('li', {key: 'a'}, 'aaa'),
    h('li', {key: 'b'}, 'bbb'),
    h('li', {key: 'x'}, 'xxx'),
    h('li', {key: 'y'}, 'yyy'),
    h('li', {key: 'c'}, 'ccc'),
    h('li', {key: 'y'}, 'yyy')
]);
const container = document.getElementById("container");
const btn = document.getElementById("btn");

patch(container, old);
btn.onclick = function () {
    patch(old, new1);
}
  