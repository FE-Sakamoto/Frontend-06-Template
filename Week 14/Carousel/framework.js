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

  for (let child of children) {
    if (typeof child === 'string') {
      element.appendChild(new TextWrapper(child))
    } else {
      element.appendChild(child)
    }
  }
  return element
}

export class Component {
  mountTo(parent) {
    parent.appendChild(this.root)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(child) {
    child.mountTo(this.root)
  }
}

class ElementWrapper extends Component {
  constructor(type) {
    super()
    this.root = document.createElement(type)
  }
}

class TextWrapper extends Component  {
  constructor(content) {
    super()
    this.root = document.createTextNode(content)
  }
}