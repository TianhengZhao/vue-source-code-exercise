export default function (templateStr) {
    let index = 0, rest = '';
    // 开始标签的正则
    let startReg = /^\<([a-z]+[1-6]?)\>/;
    // 结束标签的正则
    let endReg = /^\<\/([a-z]+[1-6]?)\>/;
    // 检测文字
    let wordReg = /^([^\<]+)\<\/[a-z]+[1-6]?\>/;
    let stackTag = [];
    let stackText = [{ children: [] }];
    while (index < templateStr.length - 1) {
        rest = templateStr.slice(index);
        // 检查是否是开始标签
        if (startReg.test(rest)) {
            let tag = rest.match(startReg)[1];
            // 将开始标签入栈
            stackTag.push(tag);
            stackText.push({ tag: tag, children: [] });
            index += tag.length + 2;
        } else if (endReg.test(rest)) {
            // 检查是否是结束标签
            let tag = rest.match(endReg)[1];
            // 弹栈，弹出的是结束标签对应的开始标签
            stackTag.pop();
            let popText = stackText.pop();
            if (stackText.length) {
                stackText[stackText.length - 1].children.push(popText);
            }
            index += tag.length + 3;
        } else if (wordReg.test(rest)) {
            let word = rest.match(wordReg)[1];
            // 去掉全是空格的情况
            if (!/^\s+$/.test(word)) {
                stackText[stackText.length - 1].children.push({ text: word, type: 3 });
            }
            index += word.length;
        } else {
            index++;
        }
    }
    // 输出抽象语法树
    console.log(stackText[0].children);
}