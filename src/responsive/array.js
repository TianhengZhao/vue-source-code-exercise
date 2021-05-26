import { def } from './utils.js';

const arrayPrototype = Array.prototype;
// 以Array.prototype为原型创建arrayMethods对象
export const arrayMethods = Object.create(arrayPrototype);
// 要改写的7个数组方法
const methodsNeedChange = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse',
];
methodsNeedChange.forEach(methodName => {
    // 备份原来的方法
    const origin = arrayPrototype[methodName];
    // 定义新的方法
    def(arrayMethods, methodName, function () {
        // 调用push等methodName的一定是数组
        const ob = this.__ob__;
        let inserted = [];
        // 插入新的数据，监控新的数据
        switch (methodName) {
            case 'push':
            case 'unshift':
                inserted = arguments;
                break;
            case 'splice':
                // inserted = arguments.slice(2); arguments是类数组对象，没有数组的一些方法
                inserted = [...arguments].slice(2);
                break;
        }
        if (inserted.length) {
            console.log(inserted);
            ob.observeArray(inserted);
        }
        // 为方法添加新功能
        console.log(`arrayMethods 给${this}数组添加新功能`);
        // 若直接用origin()，上下文为window；用apply改变调用其的对象
        const res = origin.apply(this, arguments);
        // 数组中值发生变化，通知dep
        ob.dep.notify();
        return res;
    }, false);
});