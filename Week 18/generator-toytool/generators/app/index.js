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
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha",
        "build": "webpack",
      },
      "keywords": [],
      "author": "ycy2077 <bugmaker.yu@gmail.com> (https://github.com/ycy2077)",
      "license": "MIT",
      "devDependencies": {},
      "dependencies": {}
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
    this.npmInstall(['vue'], {'save-dev': false})
    this.npmInstall([
      'webpack', 'webpack-cli', 
      'vue-loader', 'babel-loader', 'vue-template-compiler', 'vue-style-loader', 'css-loader', 'copy-webpack-plugin', 
      "mocha", "nyc",
      "@babel/core", "@babel/preset-env", "@babel/register", "@istanbuljs/nyc-config-babel", "babel-plugin-istanbul"], {'save-dev': true})

    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
    )
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
    )
    this.fs.copyTpl(
      this.templatePath('test.js'),
      this.destinationPath('test/test.js'),
    )
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