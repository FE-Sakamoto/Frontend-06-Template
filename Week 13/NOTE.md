#Week 13

## addEventListener

```js
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
```

事件触发顺序为 先捕获/后冒泡.用options.useCapture/useCapture来控制(默认false, 监听冒泡).

## Range Api

```js
let range = new Range()
let range = document.getSelection().getRangeAt(0)
range.setStart()
range.setEnd()
range.setStartBefore()
range.setEndBefore()
range.setStartAfter()
range.setEndAfter()
range.selectNode()
renge.selectNodeContents()
range.insertNode()

let fragment = range.extractContents() // fragment脱离dom可以对fragment进行多次操作然后添加进dom,这样只会触发一次dom重排
```



## CSSOM
`document.styleSheets`可以获取当前样式列表并进行编辑

`getComputedStyle`可以获取元素计算后的样式属性,也可以获取伪元素信息

```js
getComputedStyle(element, '::after')
```



## CSSOM View
`getClientRects` `getBoundingClientRect`这两个api可以用以获取`盒`尺寸

## 标准化组织
- khronos
  - WebGL
- ECMA
  - ECMAScript
- WHATWG
  - HTML
- W3C
  - webaudio
  - CG/WG