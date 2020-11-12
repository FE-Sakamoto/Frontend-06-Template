# Week 02

## UI

使用`e.which === 3`来判断鼠标按键

使用如下代码阻止右键事件

```js
document.addEventListener('contextmenu', e=> e.preventDefault())
```



### BFS

BFS搜索可以用来解决最短路径问题,除了本例常见的最短路径问题还有[单词接龙](https://leetcode-cn.com/classic/problems/word-ladder/description/).



### 启发式搜索

启发式搜索就是使用带权重的queue可以加快搜索速度,但是这样会导致所找的的路径可能并非最短路径如下图:

![image-20201109091858890](https://tva1.sinaimg.cn/large/0081Kckwly1gkinormjvfj30qh0n40t7.jpg)



如图在使用启发搜索后红框内有明显的折返现象导致路径长于最小路径.



解决方法在每次执行insert方法的时候如果当前节点以及是已访问则比较此次insert中的pre和之前被访问时所寸的pre里起点的距离,更新为最小值并将该点重新push进最小堆.



关键代码如下

```js
async function path(map, start, end) {
  ...
  const queue = new MinHeap((a, b) => getDistanceToEnd(a) - getDistanceToEnd(b))
	start.distanceToStart = 0 // 给每个点添加distanceToStart属性表示离起点的距离
	queue.push(start)
  ...
}
```



```js
async function insert(point, pre) {
  ...
  if (tmp[index] === 1) return // 墙			
  if (typeof tmp[index] === 'object') { // 更新pre
    if (pre.distanceToStart < tmp[index].distanceToStart) {
      tmp[index] = pre
      point.distanceToStart = pre.distanceToStart + 1
      queue.push(point)
    }
    return
  }
  tmp[index] = pre
  point.distanceToStart = pre.distanceToStart + 1
  queue.push(point)
  ...
}
```



完整代码+执行效果如下

![image-20201106150358541](https://tva1.sinaimg.cn/large/0081Kckwly1gkfgstix0mj30n40nawev.jpg)

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      #container {
        font-size: 0;
        width: 800px;
      }
      .cell {
        width: 8px;
        height: 8px;
        outline: 1px solid gray;
        display: inline-block;
        background-color: lightgray;
      }
    </style>
  </head>
  <body>
    <div id="container"></div>
    <button onclick="save()">save</button>
    <button onclick="reset()">reset</button>
    <script>
      const SIZE = 100
      let mousedown = false
      let clear = false
      const map = localStorage.getItem('map') ? JSON.parse(localStorage.getItem('map')) : Array(SIZE * SIZE).fill(0)
      const container = document.getElementById('container')

      class MinHeap {
        constructor(compare) {
          this.compare = compare || ((a, b)=>a - b)
          this.data = [null]
        }

        get length() {
          return this.data.length - 1
        }

        exchange(a, b) {
          [this.data[a], this.data[b]] = [this.data[b], this.data[a]]
        }
        getParentIndex(index) {
          return Math.floor(index / 2)
        }
        getLeftIndex(index) {
          return index * 2
        }
        getRightIndex(index) {
          return index * 2 + 1
        }
        push(val) {
          let index = this.data.length
          this.data.push(val)
          while (index > 1) {
            const parentIndex = this.getParentIndex(index)
            if (this.compare(this.data[index], this.data[parentIndex]) < 0) {
              this.exchange(index, parentIndex)
              index = parentIndex
            } else {
              break
            }
          }
        }

        pop() {
          if (this.data.length === 1) return
          this.exchange(1, this.data.length - 1)
          const val = this.data.pop()

          let index = 1
          while (index < this.data.length) {
            let minIndex = -1
            const leftIndex = this.getLeftIndex(index)
            const rightIndex = this.getRightIndex(index)
            if (rightIndex < this.data.length) {
              minIndex = this.compare(this.data[leftIndex], this.data[rightIndex]) < 0? leftIndex : rightIndex
            } else if (leftIndex < this.data.length) {
              minIndex = leftIndex
            }
            if (minIndex === -1) {
              break
            } else {
              this.exchange(minIndex, index)
              index = minIndex
            }
          }
          return val
        }
      }

      function init() {
        for (let i = 0; i < SIZE; i++) {
          for (let j = 0; j < SIZE; j++) {
            const index = i * SIZE + j
            const cell = document.createElement('div')
            cell.classList.add('cell')
            if (map[index]) cell.style.backgroundColor = 'black'
            cell.addEventListener('mousemove', ()=>{
              if (mousedown) {
                if (clear) {
                  cell.style.backgroundColor = 'lightgray'
                  map[index] = 0
                } else {
                  cell.style.backgroundColor = 'black'
                  map[index] = 1
                }
              }
            })
            container.appendChild(cell)
          }
        }
      }

      async function path(map, start, end) {
        const tmp = Object.create(map)
        const queue = new MinHeap((a, b) => getDistanceToEnd(a) - getDistanceToEnd(b))
        start.distanceToStart = 0
        queue.push(start)
        function getDistanceToEnd(point) {
          return (point[0] - end[0]) ** 2 + (point[1] - end[1]) ** 2
        }

        async function insert(point, pre) {
          const [x, y] = point
          const index = x + SIZE * y
          if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return
          if (tmp[index] === 1) return // 墙
          if (typeof tmp[index] === 'object') { // 更新pre
            if (pre.distanceToStart < tmp[index].distanceToStart) {
              tmp[index] = pre
              point.distanceToStart = pre.distanceToStart + 1
              queue.push(point)
            }
            return
          }
          tmp[index] = pre
          point.distanceToStart = pre.distanceToStart + 1
          queue.push(point)

          container.children[index].style.backgroundColor = 'lightgreen'
        }

        while (queue.length) {
          const point = queue.pop()
          const [x, y] = point
          if (x === end[0] && y === end[1]) {
            let way = end
            while (!(way[0] === start[0] && way[1] === start[1])) {
              const index = way[0] + way[1] * SIZE
              container.childNodes[way[0] + way[1] * SIZE].style.backgroundColor = 'red'
              way = tmp[index]
              await sleep(30)
            }
            container.childNodes[start[0] + start[1] * SIZE].style.backgroundColor = 'red'
            return [x, y]
          }
          await insert([x + 1, y], point)
          await insert([x - 1, y], point)
          await insert([x, y + 1], point)
          await insert([x, y - 1], point)

          await insert([x + 1, y + 1], point)
          await insert([x + 1, y - 1], point)
          await insert([x - 1, y + 1], point)
          await insert([x - 1, y - 1], point)
        }
        return null
      }

      async function sleep(time) {
        return new Promise(resolve => {
          setTimeout(resolve, time)
        })
      }

      function save() {
        localStorage.setItem('map', JSON.stringify(map))
      }

      function reset() {
        localStorage.removeItem('map')
        alert('请刷新页面')
      }


      document.addEventListener('mousedown', e=>{
        mousedown = true
        clear = e.which === 3
      })
      document.addEventListener('mouseup', ()=>{
        mousedown = false
      })
      document.addEventListener('contextmenu', e=> e.preventDefault())
      init()
    </script>
  </body>
</html>
```



