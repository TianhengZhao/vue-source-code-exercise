/*
 给obj的key属性添加value值
 */
export const def = function (obj, key, value, enumerable) {
    console.log(`def 添加${key}属性`)
    Object.defineProperty(obj, key, {
        value,
        enumerable,
        writable: true,
        configurable: true
    })
};