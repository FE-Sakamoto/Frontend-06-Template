import { Component } from './framework'
import {enableGusture} from './gesture'
import {TimeLine, Animation} from './animation'
import {ease} from './ease'

const ANIMATION_TIME = 1500
const CAROUSEL_WIDTH = 500

export class Carousel extends Component {
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
    let t = Date.now()
    let dx = 0
    let handler = null
    let children = this.root.children
    let pos = 0
    let timeline = new TimeLine()
    timeline.start()
    enableGusture(this.root)

    this.root.addEventListener('start', ()=>{
      timeline.pause()
      clearInterval(handler)
      const progress = t ? (Date.now() - t) / ANIMATION_TIME : 0
      dx = ease(progress) * CAROUSEL_WIDTH - CAROUSEL_WIDTH
    })


    this.root.addEventListener('pan', event => {
      const diffX =  event.clientX - event.startX - dx
      const current = pos - ((diffX - diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH)
      console.log(event.clientX, event.startX, dx)
      for (let offset of [-1, 0, 1]) {
        const index = ((current + offset) % src.length + src.length) % src.length
        const child = children[index]
        child.style.transition = 'none'
        child.style.transform = `translateX(${-index * CAROUSEL_WIDTH + (diffX % CAROUSEL_WIDTH) + offset * CAROUSEL_WIDTH}px)`
      }
    })

    this.root.addEventListener('end', event => {
      timeline.reset()
      timeline.start()
      handler = setInterval(nextPicture, 3000)
      const diffX =  event.clientX - event.startX - dx
      const current = pos - ((diffX - diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH)
      let direction = (diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH
      if (event.isFlick) {
        direction = Math.ceil(direction)
      } else {
        direction = Math.round(direction)
      }

      pos = pos - (diffX - diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH - direction
      pos = (pos % src.length + src.length) % src.length
      pos++
      t = null
      for (let offset of [-1, 0, 1]) {
        const index = ((current + offset) % src.length + src.length) % src.length
        timeline.add(new Animation(
          children[index].style, 
          'transform', 
          - index * CAROUSEL_WIDTH + offset * CAROUSEL_WIDTH + diffX % CAROUSEL_WIDTH, 
          - index * CAROUSEL_WIDTH + offset * CAROUSEL_WIDTH + direction * CAROUSEL_WIDTH, 
          ANIMATION_TIME, 
          0, 
          ease, 
          v=>`translateX(${v}px)`))
      }
    })

    const nextPicture = () => {
      t = Date.now()
      const nextIndex = (pos + 1) % src.length
      const current = children[pos]
      const next = children[nextIndex]
      timeline.add(new Animation(current.style, 'transform', - pos * CAROUSEL_WIDTH, - CAROUSEL_WIDTH - pos * CAROUSEL_WIDTH, ANIMATION_TIME, 0, ease, v=>`translateX(${v}px)`))
      timeline.add(new Animation(next.style, 'transform', CAROUSEL_WIDTH - nextIndex * CAROUSEL_WIDTH, - nextIndex * CAROUSEL_WIDTH, ANIMATION_TIME, 0, ease, v=>`translateX(${v}px)`))
      pos = nextIndex 
    }

    handler = setInterval(nextPicture, 3000)

    return this.root;
  }
  mountTo(parent) {
    parent.appendChild(this.render());
  }
}


