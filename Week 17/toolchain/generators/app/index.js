const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }
  // async method1() {
  //   const answer = await this.prompt([
  //     {
  //       type: 'input',
  //       name: 'name',
  //       message: 'Your project name',
  //       default: this.appname
  //     },
  //     {
  //       type: 'confirm',
  //       name: 'cool',
  //       message: 'Would you like this cool feature?'
  //     }
  //   ])
  // }

  initPackage() {
    const pkgJson = {
      devDependencies: {
        eslint: '^3.15.0'
      },
      dependencies: {
        react: '^16.2.0'
      }
    }
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
  }

  install() {
    // this.npmInstall()
    this.yarnInstall()
  }

  async copyTpl() {
    this.fs.copyTpl(
      this.templatePath('t.html'),
      this.destinationPath('public/index.html'),
      {title: 'Templating with Yeoman'}
    )
  }
}