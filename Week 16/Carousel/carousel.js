import { Component, STATE, ATTRIBUTE } from './framework'
import {enableGusture} from './gesture'
import {TimeLine, Animation} from './animation'
import {ease} from './ease'

const ANIMATION_TIME = 500
const CAROUSEL_WIDTH = 500

export class Carousel extends Component {
  render() {
    const src = this[ATTRIBUTE].src
    this.root = document.createElement('div')
    this.root.classList.add('carousel')

    for (let data of src) {
      const item = document.createElement('div')
      item.style.backgroundImage = `url('${data.img}')`
      this.root.appendChild(item)
    }

    this[STATE].position = 0
    let t = Date.now()
    let dx = 0
    let handler = null
    let children = this.root.children
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
      const current = this[STATE].position - ((diffX - diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH)
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
      const {clientX, startX} = event
      const diffX =  clientX - startX - dx
      const current = this[STATE].position - ((diffX - diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH)
      let direction = Math.round((diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH)

      this.triggerEvent('click', this[ATTRIBUTE].src[this[STATE].position])

      // if (event.isFlick) {
      //   direction = Math.ceil(direction)
      // } else {
      //   direction = Math.round(direction)
      // }

      this[STATE].position = this[STATE].position - (diffX - diffX % CAROUSEL_WIDTH) / CAROUSEL_WIDTH - direction
      this[STATE].position = (this[STATE].position % src.length + src.length) % src.length
      this[STATE].position++
      this.triggerEvent('change', {position: this[STATE].position})
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
      const nextIndex = (this[STATE].position + 1) % src.length
      const current = children[this[STATE].position]
      const next = children[nextIndex]
      timeline.add(new Animation(current.style, 'transform', - this[STATE].position * CAROUSEL_WIDTH, - CAROUSEL_WIDTH - this[STATE].position * CAROUSEL_WIDTH, ANIMATION_TIME, 0, ease, v=>`translateX(${v}px)`))
      timeline.add(new Animation(next.style, 'transform', CAROUSEL_WIDTH - nextIndex * CAROUSEL_WIDTH, - nextIndex * CAROUSEL_WIDTH, ANIMATION_TIME, 0, ease, v=>`translateX(${v}px)`))
      this[STATE].position = nextIndex 
      this.triggerEvent('change', {position: this[STATE].position})
    }

    handler = setInterval(nextPicture, 3000)

    return this.root;
  }
}


