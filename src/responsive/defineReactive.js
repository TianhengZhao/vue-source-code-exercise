import Dep from './Dep.js';
import observe from './observe.js';
/**
 * 
 * 给对象data的key属性添加响应
 * 提供闭包环境
 * 参数val相当于一个中间临时变量
 * 存放初始设置值及每次set后的最新设置值
 * 每次get时即可return最新的data[key]
 *  
 */
export default function defineReactive(data, key, val) {
    // 给属性key添加一个存放订阅者的实例dep
    const dep = new Dep();
    if (arguments.length === 2) {
        val = data[key];
    }
    // 对子元素进行监听
    let childOb = observe(val);
    Object.defineProperty(data, key, {
        // 可枚举
        enumerable: true,
        // 可被配置，如delete
        configurable: true,
        // get默认return undefined，即console.log(data.key)为undefined
        // 若想data.key不为undefined，给get设置个固定return，但这样set新值后，再次get不会返回最新设置的值
        get() {
            // 实例化Watcher后执行Watcher的get方法，访问某个插值变量，从而用到此处的get方法
            // 添加依赖
            dep.depend();
            return val;
        },
        // 参数为调用此次set时被赋予的新值
        set(newValue) {
            if (val === newValue) {
                return;
            }
            val = newValue;
            // 当设置了新值，新值也要被observe
            childOb = observe(newValue);
            console.log('设置新值' + newValue);
            // 发布订阅模式，值发生改变，通知dep中的订阅者们；派发更新
            dep.notify();
        }

    });
}
