# Week 11

## [CSS语法](https://www.w3.org/TR/CSS21/grammar.html#q25.0)

CSS总体结构

```css
@charset?
@import*
@rules*
```



## CSS规则

### [Selector](https://www.w3.org/TR/selectors-3/)

#### 选择器类型

##### 1. 简单选择器

- `*` // universal选择器
- `div` // type选择器,存在namespace
- `.cls` // class选择器
- `#id` // HASH选择器
- `[att=value]` // attrib选择器可以代替 class选择器和 HASH选择器
  - [attr] // 存在attr属性
  - [attr=value] // attr属性准确匹配
  - [attr~=value] // 以空格作为分隔的值列表，其中至少有一个值为 value
  - [attr|=value] // 以value-为前缀
  - [attr^=value] // 以value开头
  - [attr$=value] // 以value结尾
  - [attr*=value] // match 匹配
  - [attr operator value i] // 忽略大消息匹配
- `:hover` // pseudo-class选择器,匹配元素的特殊状态,无HTML无关
- `::before` // pseudo-element选择器 匹配部分子元素

##### 2. 复合选择器

- <简单选择器><简单选择器><简单选择器>
- *或者div必须卸载前面

##### 3. 复杂选择器

<复合选择器><sp><复合选择器> // 后代元素

<复合选择器>">"<复合选择器> // 子元素

<复合选择器>"~"<复合选择器> // 同级选择器

<复合选择器>"+"<复合选择器> // 邻接选择器

<复合选择器>"||"<复合选择器>



#### 选择器优先级

specificity: [a(!importent), b(inline), c(hash), d(cls), e(type)] ->  a * N^4 + b * N^3 + c * N^2 + d * N + e



#### pseudo-class

> 伪类选择器不宜过于复杂,如果写出了过于复杂的伪类选择器,需要思考是否自己的html结构存在问题.

- :any-link // 匹配任意link
- :link  :visited //  :link未访问的link, visited未访问过的link(存在安全问题,仅能设置color相关属性,且用window.getComputedStyle返回的颜色始终未:link状态下的颜色值)
- :hover // 鼠标悬浮
- :active // 激活状态
- :forcus // 焦点状态
- :target // hash匹配的link
- :empty // 匹配无子元素的元素(无法在startTag时知道有无子元素,破坏回溯原则, week09)
- :nth-child() // 子元素下标匹配
- :nth-last-child() // 子元素下标倒序匹配(无法在startTag时知道是父元素的倒数第几个子元素,破坏回溯原则,week09)
- :first-child // nth-child(1)
- :last-child // nth-last-child(1) 同样存在nth-last-child的问题
- :only-child // :nth-child(1):nth-last-child(1) 同样存在nth-last-child的问题
- :not() // 不匹配选择器,不支持嵌套如:not(:not(...))
- :where :has // level-4 支持度不高

### [Key](https://www.w3.org/TR/css-variables/)

- properties
- variables

### [Value](https://www.w3.org/TR/css-values-4/)

- clac
- number
- length
- ...



## 课后作业

支持简单选择器(如下):

- `div` // type选择器,存在namespace
- `.cls` // class选择器
- `#id` // HASH选择器

支持复合选择器

支持复杂选择器(如下):

- <复合选择器><sp><复合选择器> // 后代元素

```js
function match(selector, element) {
  let curElement = element
  const selectors = selector.split(' ').reverse()
  let isMatch = true
  outer: for (let selector of selectors) {
    if (!curElement) {
      isMatch = false
      break
    }
    while(!matchCurrentElemet(selector, curElement)) {
      if (curElement.parentElement) {
        curElement = curElement.parentElement
      } else {
        isMatch = false
        break outer
      }
    }
    curElement = curElement.parentElement
  }
  return isMatch;
}

function matchCurrentElemet(selector, element) {
  const simpleSelectors = selector.match(/([#\.]?[a-z]+)/g)
  for (simpleSelector of simpleSelectors) {
    if (simpleSelector.indexOf('#') === 0) {
      if ('#' + element.id !== simpleSelector) return false
    } else if (simpleSelector.indexOf('.') === 0) {
      if ('.' + element.class !== simpleSelector) return false
    } else {
      if (element.tagName.toLowerCase() !== simpleSelector) return false
    }
  }
  return true
}
```



## 思考题

为什么 first-letter 可以设置 float 之类的，而 first-line 不行呢？

```
不同于::first-letter可以从dom结构就知道其内容,
::first-line必须要在layout之后才能知道第一行中有哪些内容. 如果这时候再对::first-line设置诸如float之类的会引起重排的属性变回再次layout.然后first-line中的内容有存在改变的可能,然后又要重新layout无限死循环.
```



