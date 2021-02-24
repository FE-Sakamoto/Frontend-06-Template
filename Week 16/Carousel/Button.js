import {Component, createElement} from './framework'

export class Button extends Component {
  render() {
    this.child = <span>content1</span>
    this.root = (<div>{this.child}</div>).render()
    return this.root
  }
}