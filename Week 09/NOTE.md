# Week 09

## 0x00 OverView

新建`parser.js`负责html文件的解析并输出. `parser.js`的主要逻辑如下

1. 使用FSM来处理html文本(并已EOF来标记文件结束), 状态迁移参考[whatwg](https://html.spec.whatwg.org/multipage/parsing.html#tokenization), 实现了以下几个状态.

   - [13.2.5.1 Data state](https://html.spec.whatwg.org/multipage/parsing.html#data-state)

   - [13.2.5.6 Tag open state](https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state)
   - [13.2.5.7 End tag open state](https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state)
   - [13.2.5.8 Tag name state](https://html.spec.whatwg.org/multipage/parsing.html#tag-name-state)
   - [13.2.5.32 Before attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state)
   - [13.2.5.33 Attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state)
   - [13.2.5.34 After attribute name state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-name-state)
   - [13.2.5.35 Before attribute value state](https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-value-state)
   - [13.2.5.36 Attribute value (double-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state)
   - [13.2.5.37 Attribute value (single-quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state)
   - [13.2.5.38 Attribute value (unquoted) state](https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state)
   - [13.2.5.39 After attribute value (quoted) state](https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-value-(quoted)-state)
   - [13.2.5.40 Self-closing start tag state](https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state)



2. 使用全局变量`currentToken`和`currentAttribute`存储FSM处理结果, 并在对应`state`
   - create token(startTag/endTag)
   - append tagName
   - create attribute
   - append attribute name
   - append attribute value
   - append attribute to token.attributes
   - emit(token)
   - emit(text)
   - emit(EOF)

3. `emit`函数通过维护一个`stack`来实现dom的树形关系, 并通过`currentTextNode`使`emit(text)`合并为一个`TextNode`
4. 通过[css库](https://www.npmjs.com/package/css)处理<style></style>里的content,生成css ast,并进行存储
5. 通过`match`函数进行element和selector匹配计算(stack的数据结构能实现父级查找).
6. 通过`specificity`,`compare`函数计算和比较css优先级,判断element在遇到重复的css属性时是否覆盖value.





## 0x01 总结

在本周`toy- browser`课程中学到了浏览器解析html的实现原理,对于浏览器的工作方式有了新的认识.

1.	css selector的匹配计算是从又往左进行的因此,最右侧的选择器的高筛选率对于css性能的提升会由于左侧的选择器.
2.	css的计算是每个element创建之后立即进行的,此时stack的结构保留了当前element的parent信息.
3.	css specificity的四维度计算





