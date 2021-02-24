import { createElement } from "./framework";
import { Carousel } from './Carousel'
import { Button } from './Button'
import { List } from './List'
import { TimeLine, Animation } from './animation'


const src = [
  {
    img: "https://dummyimage.com/500x300/dbf3a3/fff&text=1",
    url: 'https://baidu.com'
  },
  {
    img: "https://dummyimage.com/500x300/f9bc2d/fff&text=2",
    url: 'https://baidu.com'
  },
  {
    img: "https://dummyimage.com/500x300/f05930/fff&text=3",
    url: 'https://baidu.com'
  },
  {
    img: "https://dummyimage.com/500x300/b32431/fff&text=4",
    url: ''
  },
  {
    img: "https://dummyimage.com/500x300/491c3b/fff&text=5",
    url: 'https://baidu.com'
  }
];

// (
//   <Carousel
//     onChange={event=>console.log(event.detail.position)}
//     onClick={event => window.location.href = event.detail.url}
//     src={src}
//   />
// ).mountTo(document.body);

// (<Button>
//   <div>content2</div>
// </Button>).mountTo(document.body)



(<List data={src}>
  {(record)=> (
     <div>
       <img src={record.img}></img>
       <a href={record.url}></a>
     </div>
   )} 
</List>).mountTo(document.body)

