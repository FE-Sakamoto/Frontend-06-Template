import {TimeLine, Animation} from './animation'
import {ease} from './ease'

const timeline = new TimeLine()
timeline.add(new Animation(document.querySelector('#el').style, 'transform', 0, 500, 2000, 0, ease, v => `translateX(${v}px)`))
timeline.start()

document.querySelector('#pause-btn').addEventListener('click', ()=>{timeline.pause()})
document.querySelector('#resume-btn').addEventListener('click', ()=>{timeline.resume()})