import Compile from "./Compile.js";
import observe from "../responsive/observe.js";
import Watcher from "../responsive/Watcher.js";

export default class Vue {
    constructor(options) {
        this.$options = options || {};
        this._data = options.data || undefined;
        // 数据要变为响应式的
        observe(this._data);
        // 相当于生命周期,created()前
        this._initData();
        this._initWatch();
        // 模板编译,将挂载的el和此vue实例中的数据绑定，将数据渲染到模板中
        new Compile(options.el, this);
    }
    _initData() {
        let self = this;
        Object.keys(this._data).forEach(key => {
            Object.defineProperty(self, key, {
                get() {
                    return self._data[key];
                },
                set(newVal) {
                    self._data[key] = newVal;
                }
            });
        });
    }
    _initWatch() {
        let self = this;
        let watch = self.$options.watch;
        Object.keys(watch).forEach(key => {
            new Watcher(self, key, watch[key]);
        });
    }
}