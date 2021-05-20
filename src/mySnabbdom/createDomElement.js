// 创建真正的dom节点。将vnode创建为dom,为孤儿节点
export default function createDomElement (vnode) {
    // 新dom节点
    let domNode = document.createElement(vnode.sel);
    if (vnode.text !== '' && (!vnode.children || !vnode.children.length)) {
        // vnode无子节点，有文字内容
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        // vnode有子节点，递归创建子节点
        for (let node of vnode.children) {
            let nodeDom = createDomElement(node);
            domNode.appendChild(nodeDom);
        }
    } 
    // 指定虚拟节点vnode上树后的结点
    vnode.elm = domNode;
    return vnode.elm;      
};

