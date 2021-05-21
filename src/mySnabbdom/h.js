import vnode from './vnode.js';

// 本手写函数无重载功能，要求必须有3个参数
// 第三个参数可能是字符串、数组、h函数
export default function (sel, data, c) {
    // 检验参数个数
    if (arguments.length !== 3) {
        throw new Error('h函数必须有3个参数！');
    }
    // 检查参数c的类型 1字符串、数字 2数组 3h函数
    if (typeof c === 'string' || typeof c === 'number') {
        return vnode(sel, data, undefined, c, undefined);
    } else if (Array.isArray(c)) {
        // 第三个参数是数组，说明该节点有子节点，将子节点的vnode存入childrenVnode
        let childrenVnode = [];
        for (let item of c) {
            if (!(typeof item === 'object' && item.hasOwnProperty('sel'))) {
                throw new Error('传入的第三个数组参数有项不是h函数！')
            } else {
                childrenVnode.push(item);
            }
        }
        return vnode(sel, data, childrenVnode, undefined, undefined);
    } else if (typeof c === 'object' && c.hasOwnProperty('sel')) {
        // 第三个参数是h函数
        let childrenVnode = [c];
        return vnode(sel, data, childrenVnode, undefined, undefined);
    } else {
        throw new Error('传入的第三个参数类型不正确！')
    }
};