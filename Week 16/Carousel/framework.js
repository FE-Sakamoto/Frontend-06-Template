export function createElement(type, props, ...children) {
  let element
  if (typeof type === 'string') {
    element = new ElementWrapper(type)
  } else {
    element = new type()
  }

  for (let name in props) {
    element.setAttribute(name, props[name])
  }

  function processChildren (children) {
    for (let child of children) {
      if (Array.isArray(child)) {
        processChildren(child)
        continue
      }
      if (typeof child === 'string') {
        element.appendChild(new TextWrapper(child))
      } else {
        element.appendChild(child)
      }
    }
  }
  
  processChildren(children)

  return element
}

export const STATE = Symbol('state')
export const ATTRIBUTE = Symbol('attribute')

export class Component {
  constructor() {
    this[ATTRIBUTE] = Object.create(null)
    this[STATE] = Object.create(null)
  }
  render() {
    return this.root
  }
  mountTo(parent) {
    if (!this.root) {
      this.render()
    }
    parent.appendChild(this.root)
  }
  setAttribute(name, value) {
    this[ATTRIBUTE][name] = value
  }
  appendChild(child) {
    if (!this.root) this.render()
    child.mountTo(this.root)
  }
  triggerEvent(type, args) {
    this[ATTRIBUTE]['on' + type.replace(/^[\s\S]/, s => s.toUpperCase())](new CustomEvent(type, {detail: args}))
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super()
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value);
}
}

class TextWrapper extends Component  {
  constructor(content) {
    super()
    this.root = document.createTextNode(content)
  }
}