学习笔记

![image-20201105094731510](/Users/magic-yu/Library/Application Support/typora-user-images/image-20201105094731510.png)



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

