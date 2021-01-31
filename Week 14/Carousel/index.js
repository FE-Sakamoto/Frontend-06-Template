import { createElement, Component } from "./framework";

class Carousel extends Component {
  constructor() {
    super();
    this.attributes = {};
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
  }
  render() {
    const src = this.attributes.src
    this.root = document.createElement('div')
    this.root.classList.add('carousel')

    for (let uri of src) {
      const item = document.createElement('div')
      item.style.backgroundImage = `url('${uri}')`
      item.src = uri
      this.root.appendChild(item)
    }

    let pos = 0
    this.root.addEventListener('mousedown', event=>{
      const startX = event.clientX
      const {children} = this.root
      function mouseMove(event) {
        const diffX = event.clientX - startX
        const current = pos - ((diffX - diffX % 500) / 500)
        for (let offset of [-1, 0, 1]) {
          const index = (current + offset + src.length) % src.length
          const child = children[index]
          child.style.transition = 'none'
          child.style.transform = `translateX(${-index * 500 + (diffX % 500) + offset * 500}px)`
        }
      }
      function mouseUp(event) {
        const diffX = event.clientX - startX
        pos -= Math.round(diffX / 500)
        for (let offset of [0, -Math.sign(Math.round(diffX / 500) - diffX + 250 * Math.sign(diffX))]) {
          const index = (pos + offset + src.length) % src.length
          const child = children[index]
          child.style.transition = ''
          child.style.transform = `translateX(${-index * 500 + offset * 500}px)`
        }
        document.removeEventListener('mousemove', mouseMove)
        document.removeEventListener('mouseup', mouseUp)
      }
      document.addEventListener('mousemove', mouseMove)
      document.addEventListener('mouseup', mouseUp)
    })

    // let currentIndex = 0
    // setInterval(()=>{
    //   const nextIndex = (currentIndex + 1) % src.length
    //   const {children} = this.root
    //   const current = children[currentIndex]
    //   const next = children[nextIndex]
    //   next.style.transition = 'none'
    //   next.style.transform = `translateX(${100 - nextIndex * 100}%)`
    //   setTimeout(()=>{
    //     next.style.transition = ''
    //     current.style.transform = `translateX(${-100 - currentIndex * 100}%)`
    //     next.style.transform = `translateX(${- nextIndex * 100}%)`
    //     currentIndex = nextIndex
    //   }, 16)
    // }, 3000)

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}

(
  <Carousel
    src={[
      "https://dummyimage.com/500x300/dbf3a3/fff&text=1",
      "https://dummyimage.com/500x300/f9bc2d/fff&text=2",
      "https://dummyimage.com/500x300/f05930/fff&text=3",
      "https://dummyimage.com/500x300/b32431/fff&text=4",
      "https://dummyimage.com/500x300/491c3b/fff&text=5",
    ]}
  />
).mountTo(document.body);
