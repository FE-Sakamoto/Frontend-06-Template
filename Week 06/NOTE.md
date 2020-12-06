# Week 06

## JS类型

JS语言中规定了7语言类型：

1. Undefined
2. Null
3. Boolean
4. String
5. Number
6. Symbol(ES6)
7. Object



### [Undefined](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)

`Undefined`类型表示未定义且只有一个只`undefined`,任意变量在声明后未赋值的情况下其值均为`undefined`,用以表示该变量未被赋值过.所以开发中一般不会讲变量赋值为`undefined`.



许多编程规范使用`void 0`代替`undefined`, 如用[babel](https://www.babeljs.cn/repl#?browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABMOcAUBDRBeRAmASgG8AoRRCBAZzgBsBTAOlrgHNMCBuEgXyA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react%2Ces2015-loose&prettier=false&targets=&version=7.12.1&externalPlugins=)将代码转化为`es6-loose`.

![image-20201016154554104](https://tva1.sinaimg.cn/large/007S8ZIlly1gjr7zx0wc6j30ya069jrw.jpg)



不同于`null` 是一个`关键字`, `undefined`实际上是挂在在`window`的属性,因此`undefined`存在被重新赋值的可能,但是`void 0`是一种运算其结果始终为`undefined`.

![image-20201016154127458](https://tva1.sinaimg.cn/large/007S8ZIlly1gjr7va7sh7j306u054q30.jpg)



但是在现代浏览器中我们已经无法直接对`undefined`进行赋值了,因为现代浏览器中已经将`undefined`设置为`non-configurable`,`non-writable`了.参考[mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)

![image-20201016155944431](https://tva1.sinaimg.cn/large/007S8ZIlly1gjr8ebc2r6j30h504tjry.jpg)



### [Null](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)

`Null`类型也只有一个值,即为`null`,且`null`是JS中的关键字,可以放心使用.且可以用`null`来赋值变量表示变量为空值.



### [Boolean](https://developer.mozilla.org/zh-CN/docs/Glossary/Boolean)

`Boolean`类型只有2个值, `true`与`false`,且均为JS关键字.



### [Number](https://developer.mozilla.org/zh-CN/docs/Glossary/Number)

JS中没有int类型所有的`number`类型都是基于ieee754的标准以double float的形式存储的. 所以必须理解ieee754

首先看下浮点数的存储方式，64bits可以分为3个部分：

- 符号位S： 第一位是正负数符号位(sign), 0表示正数，1表示负数。这也是为什么会出现`+0`和`-0`的原因。
- 指数位E：中间的11位存储指数(exponent），用来表示次方数
- 尾数位M：最后的52位是尾数(mantissa), 超出的部分采用进1舍0.

![img](https://user-gold-cdn.xitu.io/2019/5/2/16a78fbe5910f586?imageslim)



转化公式如下

![img](https://user-gold-cdn.xitu.io/2019/5/2/16a78fc6f0a12141?imageslim)



#### 0.1 + 0.2 != 0.3?

以数字0.1为例

`0.1`转成二进制表示为`0.0001100110011001100(1100循环)`, 转成科学计数法为`1.100110011001100 * 2^-4`,因此`E= -4+1023 = 1019`;M舍去舍去首位的1，小数点后第53位为1，遵循进1舍0，得到最后的结果为:

![img](https://user-gold-cdn.xitu.io/2019/5/2/16a78fc97fe0f3ce?imageslim)

我们将上面的二进制数字在数学上转化成十进制为: `0.100000000000000005551115123126`, 即出现了经典的浮点数误差.

```js
// 0.1 和 0.2 都转化成二进制后再进行运算
0.00011001100110011001100110011001100110011001100110011010 +
0.0011001100110011001100110011001100110011001100110011010 =
0.0100110011001100110011001100110011001100110011001100111 // 0.30000000000000004
```



既然出现了精度丢失为什么能正确展示x的值

```js
const x = 0.1
x // 0.1
```

因为js在number进行10进制展示的时候最多展示16位有效数字

![image-20201206213257025](https://tva1.sinaimg.cn/large/0081Kckwly1glegmryxlhj308105omxc.jpg)



这也解释了为什么0.2+0.5===0.7

![image-20201206213427640](https://tva1.sinaimg.cn/large/0081Kckwly1glegoaucynj30a904t0t1.jpg)

### [String](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)



`String`用于表示文本数据,其理论最大长度为`2^53-1`,注意此处为编码(UTF-16)长度而非文本长度,原因是受`String`的下标所限制,下标最大值即`2^53-1`(即JS中的最大安全整数参见[安全整数](#安全整数)).

![image-20201016161448447](https://tva1.sinaimg.cn/large/007S8ZIlly1gjr8tzkimjj3080047aa6.jpg)

但实际上`2^53-1`约为9PB,无论从业务场景还是计算机硬件内存还是浏览器允许的heap上限角度看都应该不存在不够的情况.



>PS:
>
>为什么JS中字符串是用UTF-16进行编码而非在存储和传输过程中更为流行的`UTF-8`?
>
>个人猜测是由于`UTF-8`的字符编码长度是变长的特性导致无法实现O(1)时间复杂度的下标查询操作.



字符串转UTF8编码输出

```js
function UTF8_Encoding(string) {
  const res = []
  for (let char of string) {
    const codePoint = char.charCodeAt(0)
    let encoding = ''
    if (codePoint < 2 ** 7) {
      encoding = `0${(codePoint).toString(2).padStart(7, 0)}`
    } else if (codePoint < 2 ** 11) {
      const tmp = codePoint.toString(2).padStart(11, 0)
      encoding = `110${tmp.substr(0, 5)} 10${tmp.substr(5, 6)}`
    } else if (codePoint < 2 ** 16) {
      const tmp = codePoint.toString(2).padStart(16, 0)
      encoding = `1110${tmp.substr(0, 4)} 10${tmp.substr(4, 6)} 10${tmp.substr(10, 6)}`
    } else {
      const tmp = codePoint.toString(2).padStart(21, 0)
      encoding = `11110${tmp.substr(0, 3)} 10${tmp.substr(3, 6)} 10${tmp.substr(9, 6)} 10${tmp.substr(15, 6)}`
    }
    res.push(encoding)
  }
  return res
}
```





### [Symbol](https://developer.mozilla.org/zh-CN/docs/Glossary/Symbol)

`Symbol` 是 ES6 中引入的新类型，它是一切非字符串的对象 key 的集合，在 ES6 规范中，整个对象系统被用 `Symbol` 重塑。

我们创建 Symbol 的方式是使用全局的 Symbol 函数(无法用new调用)。例如：

```js
var mySymbol = Symbol("my symbol");
```

一些标准中提到的 Symbol，可以在全局的 Symbol 函数的属性中找到。例如，我们可以使用 Symbol.iterator 来自定义 for…of 在对象上的行为：

```js
var o = new Object

o[Symbol.iterator] = function() {
    var v = 0
    return {
        next: function() {
            return { value: v++, done: v > 10 }
        }
    }        
};

for(var v of o) 
    console.log(v); // 0 1 2 3 ... 9
```



### [Object](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

JS中的对象其本质就是**属性的集合**(key-value形式), key为字符串或Symbol, value为值或者访问器.



JS中的几个基本类型都有对应的对象类型:

- Number
- String
- Boolean
- Symbol

我们在一些基本类型上直接调用方法就是基本类型进行装箱操作

```js
'abc'.length // 3
42.toFixed(20) // Uncaught SyntaxError: Invalid or unexpected token .被认作小数点而不是属性访问
(42).toFixed(20) // 42.00000000000000000000
42..toFixed(20) // 42.00000000000000000000
```



狗咬人的Class设计

```js
class Dog {
  constructor(name, power, hasRabies) {
    this.name = name
    this.power = power
    this.hasRabies = hasRabies
  }

  bite() {
    return this.hasRabies? Infinity : this.power
  }
}

class Human {
  constructor(name, hp) {
    this.name = name
    this.hp = hp
  }

  hurt(damage) {
    this.hp = Math.max(this.hp - damage, 0)
  }
}

const Dobby = new Dog('Dobby', 42, true)
const Kenny = new Human('Kenny', 100)
Kenny.hurt(Dobby.bite())

if (Kenny.hp === 0) {
  console.log('Oh my God, they killed Kenny!')
  console.log('You bastards!')
}
```

