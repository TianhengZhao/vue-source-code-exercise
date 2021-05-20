import vnode from './vnode.js';
import createDomElement from './createDomElement.js';
import patchVnode from './patchVnode.js';

export default function patch (oldVnode, newVnode) {
    // 判断oldVnode是否为虚拟节点，否，将该节点变为虚拟节点
    if (oldVnode.sel === '' || oldVnode.sel === undefined) {
        oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode);
    }
    // 判断oldVnode newVnode是不是同一个虚拟节点，是，精细化比较两节点
    if(oldVnode.key === newVnode.key && oldVnode.sel === newVnode.sel) {
        patchVnode(oldVnode, newVnode);
    } else {
        // 不是同一虚拟节点，直接先插入新的dom，删除旧dom
        // 创建新虚拟节点的dom
        let newNodeDom = createDomElement(newVnode);
        // 将新dom插入到旧dom之前
        if (newNodeDom) {
            oldVnode.elm.parentNode.insertBefore(newNodeDom, oldVnode.elm);
        }
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
}