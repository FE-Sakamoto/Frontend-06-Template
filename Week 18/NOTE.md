# Week 18

高复用组件/库的，单元测试收益非常高。

## [mocha](https://mochajs.org/)

mocha是一个功能丰富的javascript测试框架，运行在[node.js](https://nodejs.org/)和浏览器中，使异步测试变得简单有趣。Mocha测试连续运行，允许灵活和准确的报告，同时将未捕获的异常映射到正确的测试用例。在[Github](https://github.com/mochajs/mocha)上托管。



测试用例如下，这里采用了`Node.js`的`assert`做断言

```js
// src/index.js
function add(a, b) {
  return a + b
}

module.exports = add

// test/index.js
const assert = require('assert')
const add = require('../src/index')

describe('add function testing', () => {
  it('1+2 shoule be 3', function(){
    assert.equal(add(1, 2), 3)
  })
  it('-5+2 shoule be 3', function(){
    assert.equal(add(-5, 2), -3)
  })

  it('-5*2 shoule be -10', function(){
    assert.equal(mul(-5, 2), -10)
  })
});
```



安装并运行测试用例

```shell
$ npm install --save-dev mocha
$ ./node_modules/.bin/mocha 
```





兼容ES6 import语法

安装`@babel/register` ` @babel/core`

```shell
$ npm i --save-dev @babel/register @babel/core
```

修改代码

```js
// src/index.js
export function add(a, b) {
  return a + b
}


// test/index.js
const assert = require('assert')
import {add} from '../src/index'

describe('add function testing', () => {
  it('1+2 shoule be 3', function(){
    assert.equal(add(1, 2), 3)
  })
  it('-5+2 shoule be 3', function(){
    assert.equal(add(-5, 2), -3)
  })

  it('-5*2 shoule be -10', function(){
    assert.equal(mul(-5, 2), -10)
  })
});
```



```shell
$ ./node_modules/.bin/mocha @babel/register
```



## [nyc](https://github.com/istanbuljs/nyc)

一款code coverage工具

```shell
$ npm install --save-dev nyc babel-plugin-istanbul @istanbuljs/nyc-config-babel
```



新增`.nycrc`, `.babelrc`文件

```json
// .nycrc
{
  "extends": "@istanbuljs/nyc-config-babel"
}
```



```json
// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": ["istanbul"],
  "sourceMaps": "inline"
}
```



```diff
{
  "name": "mocha-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
-   "test": "echo \"Error: no test specified\" && exit 1",
+		"test": "mocha --require @babel/register",
+   "coverage": "nyc mocha"
  },
  "keywords": [],
  "author": "ycy2077 <bugmaker.yu@gmail.com> (https://github.com/ycy2077)",
  "license": "MIT",
  "devDependencies": {
    "@babel/core": "^7.13.8",
    "@babel/preset-env": "^7.13.8",
    "@babel/register": "^7.13.8",
    "@istanbuljs/nyc-config-babel": "^3.0.0",
    "babel-plugin-istanbul": "^6.0.0",
    "mocha": "^8.3.0",
    "nyc": "^15.1.0"
  },
  "dependencies": {
    "css": "^3.0.0",
    "images": "^3.2.3"
  }
}

```



```shell
$ npm run test // 代码测试
$ npm run coverage // 查看测试覆盖率
```



对Week09 `parser.js`进行单测覆盖率测试结果如下。可以根据`Uncovered Line`查看对应业务然后编写对应case提高覆盖率。

![image-20210301153315394](https://tva1.sinaimg.cn/large/e6c9d24ely1go4fwpo71oj21p20cy75q.jpg)

