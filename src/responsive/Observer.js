import { def } from './utils.js';
import defineReactive from './defineReactive.js';
import { arrayMethods } from './array.js';
import observe from './observe.js';
import Dep from './Dep.js';

/*
Observer类将一个正常的对象转换为每个层级的属性都是响应式的对象
*/
export default class Observer {
    constructor(value) {
        this.dep = new Dep();
        // 给value对象添加__ob__属性，属性值为this，即该类的实例，即本次new Observer的实例，该__ob__属性不可枚举
        def(value, '__ob__', this, false);
        if (Array.isArray(value)) {
            console.log(`Observer 是数组`);
            Object.setPrototypeOf(value, arrayMethods);
            this.observeArray(value);
        } else {
            console.log(`Observer 是对象`);
            this.walk(value);
        }
    }
    // 遍历对象value的每一个属性，为每个属性添加响应
    walk(value) {
        console.log(value);
        for (let k in value) {
            defineReactive(value, k);
        }
    }
    // 监听数组
    observeArray(arr) {
        for (let i = 0, l = arr.length; i < l; i++) {
            observe(arr[i]);
        }
    }
}