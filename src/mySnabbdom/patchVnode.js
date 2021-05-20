import createDomElement from "./createDomElement";

export default function patchVnode(oldVnode, newVnode) {
    // 1.新旧虚拟节点根本就是同一个对象，不用替换
    if (oldVnode === newVnode) {
        return;
    }
    // 2.新虚拟节点无子节点，有文字text
    if (newVnode.text && (!newVnode.children || !newVnode.children.length)) {
        if (newVnode.text === oldVnode.text) {
            reutrn;
        } else {
            // 用新虚拟节点文字代替旧虚拟节点sel内容，无论旧虚拟节点里是文字还是子节点，都会被innerText替换
            oldVnode.elm.innerText = newVnode.text;
        }
    } else {
        // 3.新虚拟节点有子节点，无文字text,旧虚拟节点有子节点
        if (newVnode.children || newVnode.children.length) {
            // 新插入的结点插在未处理的结点之前 A-B  ===> A-C-D-B  C、D要依次插在未处理的B之前，不是A之后（要加key）
            // 旧结点未经处理的子节点位置（未和新子节点进行比较的）
            let un = 0;
            // 遍历新结点的子节点
            for (let i = 0; i < newVnode.children.length; i++) {
                let newOne = newVnode.children[i]
                // 该子节点之前是否存在
                let isExisted = false;
                for (let j = 0; j < oldVnode.children.length; j++) {
                    let oldOne = oldVnode.children[j];
                    // 判断新旧子节点是否相同
                    if (newOne.sel === oldOne.sel && newOne.key === oldOne.key) {
                        isExisted = true;
                    }
                }
                // 有不相同的新子节点，即应插入的
                if (!isExisted) {
                    // 创建新结点dom
                    let dom = createDomElement(newOne);
                    newOne.elm = dom;
                    // 旧结点还有未处理的子节点，新子节点插到未处理的旧un之前
                    if (un < oldVnode.children.length) {
                        oldVnode.elm.insertBefore(dom, oldVnode.children[un].elm);
                    } else {
                        // 旧结点无未处理的子节点 
                        oldVnode.elm.appendChild(dom, oldVnode.children[un - 1].elm);
                    }
                } else {
                    // 新旧子节点相同，旧结点未处理子节点-1，处理过的子节点+1
                    un++;
                }
            }
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