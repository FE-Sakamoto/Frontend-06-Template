# Week17

### [Webpack](https://webpack.js.org/)

本质上，*webpack* 是一个现代 JavaScript 应用程序的*静态模块打包器(module bundler)*。当 webpack 处理应用程序时，它会递归地构建一个*依赖关系图(dependency graph)*，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 *bundle*

`webpack`: 核心模块

`webpack-cli`: 命令行工具

`loader`: loader 用于对模块的源代码进行转换，常见的loader 有`vue-loader`, `css-loader`,`ts-loader`,`babel-loader`

`plugin`: 插件是 webpack 的[支柱](https://github.com/webpack/tapable)功能。webpack 自身也是构建于，你在 webpack 配置中用到的**相同的插件系统**之上！

插件目的在于解决 [loader](https://www.webpackjs.com/concepts/loaders) 无法实现的**其他事**。

```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')


module.exports = {
  entry: './src/main.js', // 入口文件
  module: {
    rules: [  // loader配置
      { 
        test: /\.vue$/, // 匹配规则
       	use: 'vue-loader'  // 加载的loader
      },
      { 
        test: /\.css$/, 
        use: [
        'vue-style-loader',
        'css-loader'
      ] }
    ],
  },
  plugins: [ // 插件列表
    new VueLoaderPlugin(),
    new CopyPlugin({
      patterns: [
        {form: 'src/*.html', to: '[name].[ext]'}
      ]
    })
  ],
}
```



### [Babel](https://babeljs.io/)

Babel 是一个工具链，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法，以便能够运行在当前和旧版本的浏览器或其他环境中

虽然能独立使用但是更多的场景是作为loader处理js文件提高兼容性。



### [Yeoman](https://yeoman.io/)

`yoman`号称`generator of generator`可以帮我们快速构建脚手架项目。

全局安装yo库

```shell
npm install -g yo
```



创建generator项目`name`必须以`generator-`开头，例子如下：

```shell
mkdir generator-vue
cd generator-vue
npm init -y
npm link // 将此项目添加到本地全局环境，可以用 $yo vue 调用
```



```
.
├── generators
│   └── app
│       ├── index.js // 主程序
│       └── templates // 模板文件目录
└── package.json
```



主程序`index.js`结构如下，其内部方法会依次被执行

```js
// index.js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
	
  method1() {
    console.log(1)
  }
  
  method2() {
    console.log(2)
  }
}
```



使用this.prompt读取用户输入，异步IO使用async/await

```js
// index.js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  async prompt() {
    const answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.name,
      },
    ])
    console.log(answer) // {name: 'xxx'}
  }
}
```



使用`copyTpl`复制模板文件（/templates目录下）

```js
// index.js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  copyTpl() {
  	this.fs.copyTpl(
      this.templatePath('index.html'), // 模板文件路径，templates目录下
      this.destinationPath('src/index.html'), // 目标路径
      {title: 'vue'}, // 模板文本替换
    )  
  }
}
```



使用fs.extendJSON和npmInstall进行package.json创建和npm包安装

```js
// index.js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  npmInstall() {
    const pkgJson = {
      "name": answer.name,
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "ycy2077 <bugmaker.yu@gmail.com> (https://github.com/ycy2077)",
      "license": "MIT",
      "devDependencies": {},
      "dependencies": {}
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
  	this.npmInstall(['vue'], {'save-dev': false})
    this.npmInstall(['webpack', 'webpack-cli', 'vue-loader', 'vue-template-compiler', 'vue-style-loader', 'css-loader', 'copy-webpack-plugin'], {'save-dev': true}) 
  }
}
```



完整的`generator-vue`代码

```js
const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  async initPackage() {
    const answer = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.name,
      },
    ])
    const pkgJson = {
      "name": answer.name,
      "version": "1.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1"
      },
      "keywords": [],
      "author": "ycy2077 <bugmaker.yu@gmail.com> (https://github.com/ycy2077)",
      "license": "MIT",
      "devDependencies": {},
      "dependencies": {}
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
    this.npmInstall(['vue'], {'save-dev': false})
    this.npmInstall(['webpack', 'webpack-cli', 'vue-loader', 'vue-template-compiler', 'vue-style-loader', 'css-loader', 'copy-webpack-plugin'], {'save-dev': true})

    this.fs.copyTpl(
      this.templatePath('App.vue'),
      this.destinationPath('src/App.vue'),
    )
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
    )
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
    )
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {title: answer.name}
    )
  }
}
```

