
/**
 * 每个Observer实例中都会有个Dep实例
 * 即每个被监控的对象或数组的__ob__中都会有个Dep实例
*/
export default class Dep {
    constructor() {
        // 用数组存储订阅者,存放的是Watcher的实例
        this.subs = [];
    }
    addSub(sub) {
        this.subs.push(sub);
    }
    // 这里将watcher加入到某变量对应的订阅者数组中，watcher实例此时存在window.target实例中
    depend() {
        if (window.target) {
            this.addSub(window.target);
        }
    }
    notify() {
        const subs = this.subs.slice();
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }
};