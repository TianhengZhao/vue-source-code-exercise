/**
 * object.defineProperty(obj, key, {get(){}, set(){}})
 * 1.前提是知道对象名称及属性名，才能对属性监听；
 * 这导致新增的属性，之前并不知道属性名，不能进行监听；
 * 2.对象每个属性值需要逐个遍历才能加监听
 * 3.对数组操作不便
 */

// const obj = {
//     a: 1,
//     b: 2
// }
function reactive(obj) {
    const handler = {
        get(target, key, receiver) {
            // 收集依赖
            track(target, key);
            console.log('proxy get:', key);
            let value = Reflect.get(...arguments);
            // 如果对象的key属性为对象，递归监听
            if (value && typeof value === 'object') {
                return reactive(value);
            } else {
                return value;
            }
        },
        set(target, key, value, receiver) {
            // 派发更新
            trigger(target, key, value);
            console.log('proxy set:', key);
            return Reflect.set(...arguments);
        }
    }
    return new Proxy(obj, handler);
}

// const proxy = reactive(obj);
// console.log(proxy.a);
// proxy.c = [];
// proxy.c.push(1);