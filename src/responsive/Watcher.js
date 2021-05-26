// Watcher就是订阅者,当数据发生变化，就要告诉Watcher
// 这里代码是vue1.x的写法，data+expression更新，实例化一个watcher，粒度较细
// vue2.x里每个组件对应一个watcher实例，中等粒度
export default class Watcher {
    constructor(data, expression, cb) {
        // data: 数据对象，如obj
        // expression：表达式，如b.c，根据data和expression就可以获取watcher依赖的数据
        // cb：依赖变化时触发的回调
        this.data = data;
        this.expression = expression;
        this.cb = cb;
        // 初始化watcher实例时订阅数据
        this.value = this.get();
    }

    get() {
        // 将watcher实例存到全局变量中，方便其他类访问
        pushTarget(this);
        const value = parsePath(this.data, this.expression);
        // 因为在变量getter中添加依赖，因此每次访问变量都要添加一次订阅者到dep中，这是不对的
        // 添加依赖是判断window.target是否为null，是，不添加依赖，普通访问；否，添加依赖。为当前实例化的watcher
        popTarget();
        return value;
    }

    // 当收到数据变化的消息时执行该方法，然后调用cb
    update() {
        const oldValue = this.value;
        // 更新数据
        this.value = parsePath(this.data, this.expression);
        this.cb.call(this.data, this.value, oldValue);
    }

}

function parsePath(obj, expression) {
    const segments = expression.split('.');
    for (let key of segments) {
        if (!obj) {
            return;
        }
        obj = obj[key];
    }
    return obj;
}

// 当组件嵌套时，window.target的值会有多个，为防止嵌套返回找不到之前的window.target，用数组来存
const targetStack = [];

function pushTarget(_target) {
    targetStack.push(window.target);
    window.target = _target;
}

function popTarget() {
    window.target = targetStack.pop();
}

