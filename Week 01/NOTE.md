学习笔记

## 0x00 直播

参加了26日winter老师的开课直播,收获颇多.

其中晋升 -> 成长 -> 成绩 -> 晋升 的螺旋上升方式和应聘过程中简历的决定性都是我所没有意识到的.

从新审视自己的职业生涯确实走过了不少的弯路. 



## 0x01TicTacToe

TicTacToe的课程中学习到了用递归的方式模拟双方交替落子来寻找最优解的思路.

同时学到了几个编程上的小技巧

- 使用 n =  3 - n 可以实现 n在 1,2之间的toggle
- 使用Object.create()代替JSON.parse()可以减少复制棋盘的开销

发现几个不足之处

- show方法每次都清空`board.innerHTML = ""`重新绘制, 是否可以保留所有cell仅更新cell的innerText
- check可以添加前一步落子的位置提高运行效率



## 0x02 异步编程

结合[重学前端-Promise里的代码为什么比setTimeout先执行？](https://time.geekbang.org/column/article/82764)写了篇[博客](https://github.com/ycy2077/blog/issues/8)



## 0x03 面向对象

博客如下:

[重学前端-JS-类型](https://github.com/ycy2077/blog/issues/4)

[重学前端-JS-你知道全部的对象分类吗](https://github.com/ycy2077/blog/issues/7)

[重学前端-JS-我们真的需要模拟类吗？](https://github.com/ycy2077/blog/issues/6)

[https://github.com/ycy2077/blog/issues/5](https://github.com/ycy2077/blog/issues/5)

## 0x04 五子棋

读了[五子棋AI教程](https://github.com/lihongxun945/myblog/issues/11)的文章学习AI编程思路,了解了`Max` `Min` 树和`alpha` `beta`剪枝方法,但是截至目前并不能自主实现编程,继续尝试.



