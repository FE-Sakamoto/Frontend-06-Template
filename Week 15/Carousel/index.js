import { createElement } from "./framework";
import { Carousel } from './carousel'
import { TimeLine, Animation } from './animation'

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

const timeline = new TimeLine()
timeline.add(new Animation({}, 'a', 100, 300, 3000, undefined))
timeline.start()

