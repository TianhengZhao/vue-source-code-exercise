import patchVnode from "./patchVnode.js";
import createDomElement from "./createDomElement.js";

function isSameVnode (nodeA, nodeB) {
    return nodeA.sel === nodeB.sel && nodeA.key === nodeB.key;
}

/*
四种命中查找：
    1.旧前 新前
    2.旧后 新后 
    3.旧前 新后（结点位置改变，新后【旧前】移到旧后之后，旧前变为undefined）
    4.旧后 新前（结点位置改变，新前【旧后】移到旧前之前，旧后变为undefined）
*/
export default function updateChildren(parentElm, oldCh, newCh) {
    // 新前
    let newStartIdx = 0;
    // 旧前
    let oldStartIdx = 0;
    // 新后
    let newEndIdx = newCh.length - 1;
    // 旧后
    let oldEndIdx = oldCh.length - 1;
    let newStartVnode = newCh[0];
    let oldStartVnode = oldCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldEndVnode = oldCh[oldEndIdx];
    // 旧子节点key和index的缓存map
    let keyMap = {};

    while (newStartIdx <= newEndIdx && oldStartIdx <= oldEndIdx) {
        console.log("☆");
        if (oldStartVnode === null || oldCh[oldStartIdx] === undefined) {
            oldStartVnode = oldCh[++oldStartIdx];
            continue;
        } else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined) {
            oldEndVnode = oldCh[--oldEndIdx];
            continue;
        } else if (newStartVnode === null || newCh[newStartIdx] === undefined) {
            newStartVnode = newCh[++newStartIdx];
            continue;
        } else if (newEndVnode === null || newCh[newEndIdx] === undefined) {
            newEndVnode = newCh[--newEndIdx];
            continue;
        }
        // 1.新前与旧前命中
        if (isSameVnode(newStartVnode, oldStartVnode)) {
            // 精细化比较两子节点
            console.log('111111');
            patchVnode(oldStartVnode, newStartVnode);
            newStartVnode = newCh[++newStartIdx];
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (isSameVnode(newEndVnode, oldEndVnode)) {
            // 2.新后与旧后命中
            console.log('22222');
            patchVnode(oldEndVnode, newEndVnode);
            newEndVnode = newCh[--newEndIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        }  else if (isSameVnode(newEndVnode, oldStartVnode)) {
            // 3.新后与旧前命中
            console.log('333333');
            patchVnode(oldStartVnode, newEndVnode);
            parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling);
            newEndVnode = newCh[--newEndIdx];
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (isSameVnode(newStartVnode, oldEndVnode)) {
            // 3.新前与旧后命中
            console.log('444444');
            patchVnode(newStartVnode, oldEndVnode);
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        } else {
            // 都没有匹配
            if (!keyMap.length) {
                // 对每个未处理的旧子节点遍历，存储对应的key和index值（相对于未处理的结点的index）
                for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                    const key = oldCh[i].key;
                    if (key) {
                        keyMap[key] = i;
                    }
                }
            }
            // 得到当前新子节点在旧节点中对应的index
            const idxInOld = keyMap[newStartVnode.key];
            if (idxInOld) {
                // 新子节点在旧结点中就有，只是位置不同，找出其在旧结点中位置，移到旧前之前
                const nodeToMove = oldCh[idxInOld];
                patchVnode(nodeToMove, newStartVnode);
                oldCh[idxInOld] = undefined;
                parentElm.insertBefore(nodeToMove.elm, oldStartVnode.elm);

            } else {
                // 当前新子节点是全新的结点，直接插入即可，插到旧前之前
                parentElm.insertBefore(createDomElement(newStartVnode), oldStartVnode.elm);
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }
    if (newEndIdx >= newStartIdx) {
        // 说明新子节点还有剩余，需要插入 ?
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            parentElm.insertBefore(createDomElement(newCh[i]), oldCh[oldStartIdx].elm);
        }
    } else if (oldEndIdx >= oldStartIdx) {
        // 说明旧子节点还有剩余，需要删除
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (oldCh[i]) {
                parentElm.removeChild(oldCh[i].elm);
            }
        }
    }

}