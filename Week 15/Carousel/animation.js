const TICK = Symbol('tick')
const TICK_HANDLER = Symbol('tick-handler')
const ANIMATIONS = Symbol('animation')
const ADD_TIME = Symbol('add-time')
const START_TIME = Symbol('start-time')
const PAUSE_TIME = Symbol('pause-time')
const PAUSE_DURATION = Symbol('pause-duration')

const INITED = 'inited'
const STARTED = 'started'
const PAUSED = 'paused'


export class TimeLine {
  constructor() {
    this.state = INITED
    this[ADD_TIME] = new Map()
    this[START_TIME] = null
    this[PAUSE_DURATION] = 0
    this[TICK] = () => {
      for (let animation of this[ANIMATIONS]) {
        let t
        if (this[ADD_TIME].get(animation) < this[START_TIME]) {
          t = Date.now() - this[START_TIME] - this[PAUSE_DURATION] - animation.delay
        } else {
          t = Date.now() - this[ADD_TIME].get(animation) - this[PAUSE_DURATION] - animation.delay
        }
        if (t > animation.duration) {
          this[ANIMATIONS].delete(animation)
          this[ADD_TIME].delete(animation)
          t = animation.duration
        } 
        if (t > 0) {
          animation.receive(t)
        }
      }
      this[TICK_HANDLER] = requestAnimationFrame(this[TICK])
    }
    this[ANIMATIONS] = new Set()
  }

  start() {
    if (this.state !== INITED) return
    this.state = STARTED
    this[START_TIME] = Date.now()
    this[TICK]()
  }

  pause() {
    if (this.state !== STARTED) return
    this.state = PAUSED
    this[PAUSE_TIME] = Date.now()
    cancelAnimationFrame(this[TICK_HANDLER])
  }

  resume() {
    if (this.state !== PAUSED) return
    this.state = STARTED
    this[PAUSE_DURATION] += Date.now() - this[PAUSE_TIME]
    this[TICK]()
  }

  reset() {
    this.state = INITED
    this.pause()
    this[PAUSE_TIME] = 0
    this[PAUSE_DURATION] = 0
    this[ANIMATIONS] = new Set()
    this[ADD_TIME] = new Map()
    this[START_TIME] = 0
    this[TICK_HANDLER] = null
  }

  add(animation, addTime = Date.now()) {
    this[ANIMATIONS].add(animation)
    this[ADD_TIME].set(animation, addTime)
  }
}

export class Animation {
  constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
    this.object = object
    this.property = property
    this.startValue = startValue
    this.endValue = endValue
    this.duration = duration
    this.delay = delay
    this.timingFunction = timingFunction || (v => v)
    this.template = template || (v => v)
  }

  receive(time) {
    const range = this.endValue - this.startValue
    const progress = this.timingFunction(time / this.duration)
    this.object[this.property] = this.template(this.startValue + range * progress)
  }
}