# Week 11

## 0x00 [盒](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/Building_blocks/The_box_model)

盒模型是排班和渲染的基本单位，由`content`,` padding`,` border`,` margin`组成。

`box-sizing`属性有`content-box`，` border-box`两个值。前者代表content尺寸，后者代表content + padding + border的尺寸



![Diagram of the box model](https://mdn.mozillademos.org/files/16558/box-model.png)

## 0x01 正常流

正常流的排版就是印刷行业的排版。

- 从左到右书写
- 满一行就换行
- 大图(display:block)独占一行
- 每行内容对齐，行高度为行内元素最高的高度。



## 0x02 Free Type

![freeType中对文字的定义](https://github.com/guopeng1129972/Frontend-05-Template/raw/master/Week%2012/img/3.jpg)

行模型

- line-top
  - 如果行高大于文字的高度就表示行的最高的线
- text-top
  - 字体混排时，一行中最大的字决定
- base-line
- text-bottom
  - 字体混排时，一行中最大的字决定
- line-bottom
  - 如果行高大于文字的高度就表示行的最低的线

## 0x03 BFC

### Block
- Block Container:里面有BFC的block
  - 能容纳正常流的盒，里面就有BFC的block
- Block-level Box:外边有BFC的block
- Block Box=Block Container+Block-level Box
  - 里外都有BFC的block
### Block Container
- 所有能够容纳里边不是特殊的display的模式的，默认就是正常流
- Block Container
  - block
  - inline-block
  - table-cell
  - flex item
    - flex 不是,但是里边的子元素可以放
  - grid cell
  - table-caption
###  Block-level Box
- 大多数的display的值都是对应的，一个是Block level ，一个是 Inline level

| Block level    | Inline level          |
| -------------- | --------------------- |
| display:block  | display: inline-block |
| display: flex  | display: inline-flex  |
| display: table | display: inline-table |
| display: grid  | display: inline-grid  |
| ......         | ......                |
display: run-in (没见用过)
### 如何产生一个BFC（css2.1标准）
- floats（浮动）
- absolutely positioned elements（绝对定位）
- block containers (such as inline-blocks, table-cells, and table-captions) that are not block boxes,
  - flex items
  - grid cell
  - ......
- and block boxes with 'overflow' other than 'visible'

### 反这来说，什么情况下不会产生BFC
- 默认情况都会发生BFC，但是有种请款会发生BFC合并，那么就只有这种情况下不会有BFC
### 何时会发生BFC合并
- block box && overflow:visible
  - 里外都是BFC，并且overflow:visible
###### overflow:visible 超出不会被修剪
### BFC合并的影响
- BFC合并与float
  - 设置overflow:visible的元素，会与float元素合并(bfc1.html）
  - 设置overflow不为visible的元素，会产生新的BFC结构(bfc1.html）
- BFC合并与边距折叠
  - 设置overflow:visible的元素，相邻的两个元素会发生边距折叠(bfc2.html)
  - 设置overflow不为visible的元素，相邻的两个元素会产生新的BFC结构(bfc2.html)



## 0x04 Flex

- 收集盒进行
  - 分行
    - 根据主轴尺寸，把元素分进行
    - 若设置了no-wrap,则强行分配到第一行
- 计算盒在主轴方向的排布
  - 计算主轴方向
    - 找出所有flex元素
    - 把主轴方向的剩余尺寸按比例分配给这些元素
    - 若剩余空间为负数，所有flex元素为0，等比压缩剩余元素
- 计算盒在交叉轴方向的排布
  - 计算交叉轴方向
    - 根据每一行中最大元素尺寸计算行高
    - 根据行高flex-align和item-align，确定元素具体位置



## 0x05 动画

### Animation 

@keyframes定义

- 使用keyframes和@rule定义关键帧
- from 相当于0%;to 相当于100%

```css
@keyframes mykf {
	from {background: red;} 
	to {background: yellow;} 
}

div {
	animation:mykf 5s infinite; 
}
```

### Animation 属性

- animation-name 时间曲线
- animation-duration 动画的时长
- animation-timing-function 动画的时间曲线
- animation-delay 动画开始前的延时
- animation-iteration-count 动画的播放次数
- animation-direction 动画的方向

```css
@keyframes mykf {
	0% { top: 0; transition:top ease}
	50% { top: 30px;transition:top ease-in } 
	75% { top: 10px;transition:top ease-out } 
	100% { top: 0; transition:top linear}
}
```



### Transition

- transition-property 要变换的属性
- transition-duration 变换的时长
- transition-timing-function 时间曲线
- transition-delay 延迟

### 

## 0x06 颜色

## HSL与HSV

- CSS语义化颜色
- W3C主要支持HSL，但是可以转换两者
- hsv.html的例子主要是说方便管理，改变颜色只需要设置色相值