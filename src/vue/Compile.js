import Watcher from '../responsive/Watcher.js';

export default class Compile {
    constructor(el, vue) {
        // 使得用户可以访问
        this.$vue = vue;
        this.$el = document.querySelector(el);
        if (this.$el) {
            // 让结点变为片段（tokens）
            let $fragment = this.node2Fragment(this.$el);
            // 编译
            this.compile($fragment);
            // 将替换好的内容上树
            this.$el.appendChild($fragment);
        }
    }
    node2Fragment(el) {
        let fragment = document.createDocumentFragment();
        let child;
        while (child = el.firstChild) {
            // 将el的孩子们依次上到fragment，上去之后就不在el的真实dom中了
            fragment.appendChild(child);
        }
        return fragment;
    }
    compile(fra) {
        let childNodes = fra.childNodes;
        let self = this;
        let reg = /\{\{(.*)\}\}/;
        // 对每一个结点进行编译
        childNodes.forEach(node => {
            // 获得文本结点的文本
            let text = node.textContent;
            if (node.nodeType === 1) {
                self.compileElement(node);
            } else if (node.nodeType === 3 && reg.test(text)) {
                // 找到插值变量，并且剥离出变量名
                let name = text.match(reg)[1];
                self.compileText(node, name.trim());
            }

        });
    }
    compileElement(node) {
        let nodeAttrs = node.attributes;
        // 类数组对象变为数组
        [].slice.call(nodeAttrs).forEach(attr => {
            let attrName = attr.name;
            let value = attr.value;
            let dir = attrName.substring(2);
            // 是指令
            if (attrName.indexOf('v-') === 0) {
                if (dir === 'if') {
                    console.log(value)
                } else if (dir === 'model') {
                    new Watcher(this.$vue, value, value => {
                        node.value = value;
                    });
                    let v = this.getVueVal(this.$vue, value);
                    node.value = v;
                    node.addEventListener('input', e => {
                        let newVal = e.target.value;
                        this.setVueVal(this.$vue, value, newVal);
                    });

                }
            }
        })
    }
    compileText(node, name) {
        // 将变量值添加到dom上
        node.textContent = this.getVueVal(this.$vue, name);
        // 监听该变量
        new Watcher(this.$vue, name, value => {
            node.textContent = value;
        });
    }

    // 根据变量表达式exp在vue数据中找到变量对应的值
    getVueVal(vue, exp) {
        let val = vue;
        exp = exp.split('.');
        exp.forEach(k => {
            val = val[k];
        });
        return val;
    }

    setVueVal(vue, exp, value) {
        let val = vue;
        exp = exp.split('.');
        exp.forEach((k, i) => {
            if (i < exp.length - 1) {
                value = val[k];
            } else {
                val[k] = value
            }
        });
    }
}