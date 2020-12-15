# Week 07

## [表达式优先级](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence)

运算符存在优先级,运算符的优先级会影响语法树的结构.运算符优先级从高到低如下.MDN上的汇总表中的优先级和老师课上讲的存在出入(函数调用优先级高于无参数的new).

![image-20201214190039047](https://tva1.sinaimg.cn/large/0081Kckwly1glnl6selxvj30uy0e6jt3.jpg)



## 幂运算的右结合

幂运算在JS中确实是右结合,但是这个好像不是js的特性.正常的数学表达式中![[公式]](https://www.zhihu.com/equation?tex=x%5E%7By%5Ez%7D) 就是右结合.

```js
2 ** 3 ** 2 // 512
2 ** (3 ** 2) // 512
(2 ** 3) ** 2 // 64
```



## Left Handside & Right Handside

JavaScript中其实只定义了`Left Handside` 所以表达式只有是否是`Left Handside`的判断,只有`Left Handside`可以放在`=`左边.



## 类型转换

![img](https://camo.githubusercontent.com/5a71f6ddb06c418ace8f01c0c79eed141063d0e0acbcc5118fec941d37235b53/68747470733a2f2f7374617469633030312e6765656b62616e672e6f72672f7265736f757263652f696d6167652f37312f32302f37316261666264323430346463336666613563636635643062613037373732302e6a7067)



### 装箱转换

所谓装箱转换，正是把基本类型转换为对应的对象，它是类型转换中一种相当重要的种类。

我们定义一个函数，函数里面只有 return this，然后我们调用函数的 call 方法到一个 Symbol 类型的值上，这样就会产生一个 symbolObject。

```
var symbolObject = (function(){ return this; }).call(Symbol("a"));

console.log(typeof symbolObject); //object
console.log(symbolObject instanceof Symbol); //true
console.log(symbolObject.constructor == Symbol); //true
```

使用内置的 Object 函数，我们可以在 JavaScript 代码中显式调用装箱能力。

```
Object('a') // String {"a"}
Object(true) // Boolean {true}
Object(1) // Number {1}
Object(Symbol('s')) // Symbol {Symbol(s)}
```



### 拆箱转换

对象到 String 和 Number 的转换都遵循“先拆箱再转换”的规则。通过拆箱转换，把对象变成基本类型，再从基本类型转换为对应的 String 或者 Number。拆箱转换会尝试调用 valueOf 和 toString 来获得拆箱后的基本类型。如果 valueOf 和 toString 都不存在，或者没有返回基本类型，则会产生类型错误 TypeError。

```
var o = {
    valueOf : () => {console.log("valueOf"); return {}},
    toString : () => {console.log("toString"); return {}}
}

o * 2
// valueOf
// toString
// TypeError
```

在 ES6 之后，还允许对象通过显式指定 `toPrimitive Symbol` 来覆盖原有的行为。

```
var o = {
    valueOf : () => {console.log("valueOf"); return {}},
    toString : () => {console.log("toString"); return {}}
}

o[Symbol.toPrimitive] = () => {console.log("toPrimitive"); return "hello"}


console.log(o + "")
// toPrimitive
// hello
```



## Runtime

###  Reference

在`runtime`中取值表达式a.b得到的其实不是直接的值,而是一个`Reference`,其中包含a(Object),b(key)的信息.

在一些需要取值的操作会自动将引用转化为值,但是在需要引用的操作能`Refrence`保证操作能正常实现.

```js
let a = {b: 42, c: 33}
let d = a.b // 等同于 let d = a.b, Reference被转化为值
a.c = 0 // 不同于 33 = 0
delete a.b // 不同于 delete 42
```



### Complete Record

在`runtime`记录语句完成状态的类型, 结构如下, value 为 return 和 thorw后跟的值, target为 break和countinue后跟的代码标识

```js
type: normal | break | countinue | return | throw
value: 基本类型
target: label
```



```js
for (let i = 0; i < 3; i++) {
  for (let j = 0; j < 3; j++) {
    if (i === 1) {
      break
    }
    console.log(i, j)
  }
}
0 0
0 1
0 2
2 0
2 1
2 2


outer: for (let i = 0; i < 3; i++) {
  inner: for (let j = 0; j < 3; j++) {
    if (i === 1) {
      break outer
    }
    console.log(i, j)
  }
}

0 0
0 1
0 2
```



## 变量提升

```js
expression1
expression2
var a = 42
function foo(){
	console.log('foo')
}
var bar = function() {
  console.log('bar')
}

--- pre-process ---
    
var a
function foo(){
	console.log('foo')
}
var bar
expression1
expression2
a = 42
bar = function() {
  console.log('bar')
}
```



ES6中的let和const其实也会参与预处理产生变量提升,但是他们是块级作用域

```js
var a = 2;
void function(){
  a = 1;
  return;
  let a;
}()
console.log(a)
// Uncaught ReferenceError: Cannot access 'a' before initialization
```



## 作用域链?

参考[浏览器工作原理与实践](https://time.geekbang.org/column/intro/100033601) Lesson10

![下载](https://tva1.sinaimg.cn/large/0081Kckwly1glohl1hcvgj30vq0fhq72.jpg)

![下载 (1)](https://tva1.sinaimg.cn/large/0081Kckwly1glohons5lcj30vq0hmdl9.jpg)



## 宏任务&微任务

参考[浏览器工作原理与实践](https://time.geekbang.org/column/intro/100033601) Lesson19

![下载 (2)](https://tva1.sinaimg.cn/large/0081Kckwly1glohx8egqhj30vq0cygse.jpg)

![下载 (3)](https://tva1.sinaimg.cn/large/0081Kckwly1glohxcd9lnj30vq0d8n3f.jpg)

