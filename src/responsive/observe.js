import Observer from './Observer.js';

/*
observe(obj) => 看obj有没有__ob__属性 =>(没有) new Observer() => 对每个属性，逐个defineReactive
 */
export default function observe (value) {
    // observe只针对对象
    if (typeof value !== 'object' || value === null) {
        return;
    }
    let ob;
    if (typeof value.__ob__ !== 'undefined') {
        ob = value.__ob__;
        console.log(`observe 有__ob__属性`);
    } else {
        console.log('observe 无__ob__属性');
        ob = new Observer(value);
    }
    return ob;
}