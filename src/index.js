import h from './mySnabbdom/h.js';
import patch from './mySnabbdom/patch.js';

const old = h('ul', {}, [
    h('li', {key: 'a'}, 'aaa'),
    h('li', {key: 'b'}, 'bbb'),
    h('li', {key: 'c'}, 'ccc'),
    h('li', {key: 'd'}, 'ddd')
]);
const new1 = h('ul', {}, [
    h('li', {key: 'd'}, 'ddd'),
    h('li', {key: 'c'}, 'ccc'),
    h('li', {key: 'e'}, 'eee'),
    h('li', {key: 'a'}, 'aaa'),
    h('li', {key: 'b'}, 'bbb'),
    h('li', {key: 'f'}, 'fff')
]);
const container = document.getElementById("container");
const btn = document.getElementById("btn");

patch(container, old);
btn.onclick = function () {
    patch(old, new1);
}
  