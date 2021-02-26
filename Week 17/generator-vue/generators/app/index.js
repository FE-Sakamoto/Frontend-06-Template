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