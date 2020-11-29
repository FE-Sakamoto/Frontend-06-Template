# Week05

## [Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)

**Proxy** 对象用于定义基本操作的自定义行为（如属性查找、赋值、枚举、函数调用等）。

> const p = new Proxy(target, handler)

Vue双向绑定就是使用Proxy将data变成一个observer

![数据响应原理图](https://camo.githubusercontent.com/32e11e429ddfb824665af2c4a3852e2d4d23a1691360e44b6a44bb287f557709/68747470733a2f2f757374626875616e6779692e6769746875622e696f2f7675652d616e616c797369732f6173736574732f72656163746976652e706e67)

## reactive

#### 原理

1. 通过`effect`函数对需要记录下每个`callback`和其关联的`属性`的映射关系.
2. 通过Proxy.handler.set 在对应`属性`更新的时候执行与其关联的callback

#### 问题

1. 如何知道`callback`关联的属性?

   > 1. 维护一个数组usedReactivties
   > 2. 每次执行effect清空usedReactivties数组
   > 3. 执行一次callback()
   > 4. 在Proxy.handler.get内监听callback()中触发的属性记录进usedReactivties
   > 5. 遍历usedReactivties数组将属性与callback映射关系记录下来

   关键代码如下

   ```js
   let usedReactivties = []
   
   function effect(callback) {
     usedReactivties = []
     callback()
     for (reactivity of usedReactivties) {
       ...
       // 存储映射关系
     }
   }
     
   ...
   
   function reactive(object) {
     return new Proxy(object, {
       ...
       get(object, prop) {
         usedReactivties.push([object, prop])
         return object[prop]
       }
     })
   }
   ```

   

2. 如何处理多层级属性(data.a.b)

   > 如果prop是object类型在`Proxy.handler.get`中返回Proxy,并用Map接口进行Proxy Cache.

   关键代码如下

   ```js
   const reactivties = new Map()
   
   ...
   
   function reactive(object) {
     if (reactivties.has(object)) return reactivties.get(object)
     return new Proxy(object, {
       get(object, prop) {
         usedReactivties.push([object, prop])
         if (object[prop] !== null && typeof object[prop] === 'object') {
           return reactive(object[prop])
         }
         return object[prop]
       }
     })
   }
   ```



## Dragable

关键代码和注释如下:

```js
const dragable = document.getElementById('dragable')
let baseX = 0 // 用baseX 和 baseY 来缓存上次up时dragable的位置
let baseY = 0 // 用baseX 和 baseY 来缓存上次up时dragable的位置
dragable.addEventListener('mousedown', event=>{
  let startX = event.clientX
  let startY = event.clientY
  let up = event => {
    baseX += event.clientX - startX // 计算此次拓转偏移量
    baseY += event.clientY - startY // 计算此次拓转偏移量
    document.removeEventListener('mousemove', move)
    document.removeEventListener('mouseup', up)
  }
  let move = event => {
    const range = getNearest(event.clientX, event.clientY)
    range.insertNode(dragable)
  }
  document.addEventListener('mousemove', move)  // 在mousedown内才注册减少非mousedown情况下的事件触发
  document.addEventListener('mouseup', up) // 在mousedown内才注册减少非mousedown情况下的事件触发
})
```



对`Dragable`的dom元素注册`mousedown` 监听,并在此监听内



## [Range](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)

**`Range`** 接口表示一个包含节点与文本节点的一部分的文档片段。

创建range

> document.createRange()

设置起点:如果起始节点类型是 `Text`， `Comment`, or `CDATASection`之一, 那么 `startOffset指的是`从起始节点算起字符的偏移量。

> range.setStart(startNode, startOffset)

插入节点: 是在[`Range`](https://developer.mozilla.org/zh-CN/docs/Web/API/Range)的起始位置插入节点的方法。

> range.insertNode(newNode)



关键代码和注释如下:

```js
const container = document.getElementById('container')
const ranges = []
for (let i = 0; i < container.childNodes[0].length; i++) {
  const range = document.createRange()
  range.setStart(container.childNodes[0], i)
  // range.setEnd(container.childNodes[0], i) // insertNode只与start有关 此行代码是否有必要?
  ranges.push(range)
}

function getNearest(x, y) {
  let min = Infinity
  let nearest = null
  for (let range of ranges) {
    const rect = range.getBoundingClientRect()
    const distance = (rect.x - x) ** 2 + (rect.y - y) ** 2
    if (distance < min) {
      min = distance
      nearest = range
    }
  }
  return nearest
}
```



使用document.addEventListener('selectstart', *event* => *event*.preventDefault())禁用拖拽时发生的文本选择.