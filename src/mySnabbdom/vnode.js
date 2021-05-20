// 将传入的参数合进一个对象并返回
export default function(sel, data, children, text, elm) {
    const key = data.key;
    return {
        sel, data, children, text, elm, key
    };
};