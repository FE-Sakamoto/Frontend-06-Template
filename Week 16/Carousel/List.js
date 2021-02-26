import {ATTRIBUTE, Component, createElement} from './framework'

export class List extends Component {
  render() {
    this.children = this[ATTRIBUTE].data.map((item)=>this.template(item))
    this.root = (<div>{this.children}</div>).render()
    return this.root
  }

  appendChild(child) {
    this.template = child
    this.render()
  }
}