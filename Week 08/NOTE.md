# Week 08
## Why [FSM](https://zh.wikipedia.org/wiki/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)

有限状态机

- 每一个状态都是一个机器
  - 在每一个机器里，我们可以做计算、存储、输出…...
  - 所有的这些机器接受的输入是一致的
  - 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数（无副作用）
- 每一个机器知道下一个状态
  - 每个机器都有确定的下一个状态（Moore）
  - 每个机器根据输入决定下一个状态（Mealy）

私以为在编程领域中有限状态机(FSM)主要作用是作为一种编码方式去优化代码结构.

比如早期JS中使用`callback`实现异步操作, 在ES6中引入了`Promise`之后可以异步代码可以有更强的逻辑表现能力和更高的安全性,而Promise中`Pending`,`Resolve`,`Reject`就是一种状态机.



## HTTP

`Transfer-Encoding`: chunked

这是node.js 默认的response的编码形式,此种编码形式会用16进制对body进行分块,每个16进制表示本块的内容长度,以一个长度为0的子块标志结束.

此种编码形式中 ` Content-Length`可以无需发送





`TrunkedBodyParser`.`receiveChar` 中的`READING_TRUNK`分支中的状态转移依赖了内部变量this.length违反了`Mealy`状态机的定义

```js
class TrunkedBodyParser {
	...
  receiveChar(char) {
    ...
    } else if (this.status === READING_TRUNK) {
      this.content.push(char)
      this.length--
      if (this.length === 0) {
        this.status = WAITING_NEW_LINE
      }
    }
    ...
  }
}

```











