# Week 10
## 0x00 OverView

本周学习内容为toyBrowser的`layout`与`render`部分.



## 0x01 [layout](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Introduction#%E6%AD%A3%E5%B8%B8%E5%B8%83%E5%B1%80%E6%B5%81Normal_flow)

首先回顾了css的几种[layout](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Introduction#%E6%AD%A3%E5%B8%B8%E5%B8%83%E5%B1%80%E6%B5%81Normal_flow)技术方案,并确定了以[Flexbox](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/CSS_layout/Introduction#%E5%BC%B9%E6%80%A7%E7%9B%92%E5%AD%90Flexbox)的方案实现toyBrowser的layout.

![img](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071004.png)



layout是流程如下(详见layout.js)

1. 新建layout.js模块进行业务拆分
2. parse.js中引入layout.js,并在**token.type === 'endTag'**时调用layout,保证子元素先处理完成.
3. layout.js模块中,使用`getStyle`函数对element style信息进行格式化
4. `layout`函数中对style默认参数进行补全
5. 初始化并赋值变量`mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase`
6. 依次进行主轴/交叉轴计算
7. 记录element的`left`,`top`, `right`,`bottom`,`width`,`height`



## 0x02 Render

使用[images](https://www.npmjs.com/package/images)将将dom渲染成bitmap,流程如下(详见render.js)

1. 创建viewport  `const viewport =  images(width, height)`

2. 调用render函数 `render(viewport, element)`

   1. 根据element创建img实例`images(element.style.width, element.style.height)`

   2. 获取element的背景色对img填充

      ```js
      element.style['background-color'].match(/rgb\((\d+),(\d+),(\d+)\)/)
      img.fill(Number(RegExp.$1), Number(RegExp.$2), Number(RegExp.$3))
      ```

   3. 根据element.left, element.right将img绘制在父element对应img的对应位置

      ```js
      viewport.draw(img, element.style.left || 0, element.style.top || 0)
      ```

   4. 遍历children,递归调用render函数

3. 使用viewport生成图片并保存



## 0x03 总结

此次课程让我对浏览器的layout流程及flexbox的layout原理有了全新的认识获益匪浅.

另外让我知道了[Houdini](https://developer.mozilla.org/zh-CN/docs/Web/Houdini)这个方案,并进行了学习.

