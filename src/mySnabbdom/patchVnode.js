import updateChildren from "./updateChildren.js";
import createDomElement from "./createDomElement.js";

// 精细化比较两个相同的虚拟节点
export default function patchVnode(oldVnode, newVnode) {
    // 1.新旧虚拟节点根本就是同一个对象，不用替换
    if (oldVnode === newVnode) {
        return;
    }
    // 2.新虚拟节点无子节点，有文字text
    if (newVnode.text && (!newVnode.children || !newVnode.children.length)) {
        if (newVnode.text === oldVnode.text) {
            return;
        } else {
            // 用新虚拟节点文字代替旧虚拟节点sel内容，无论旧虚拟节点里是文字还是子节点，都会被innerText替换
            oldVnode.elm.innerText = newVnode.text;
        }
    } else {
        // 3.新虚拟节点有子节点，无文字text,旧虚拟节点有子节点
        if (newVnode.children || newVnode.children.length) {
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else {
            // 4.新虚拟节点有子节点，无文字text，旧虚拟节点无子节点
            //oldVnode.elm.innerHTML = '';
            for (let node of newVnode.children) {
                let dom = createDomElement(node);
                oldVnode.elm.appendChild(dom);
            }
        }
    }
}