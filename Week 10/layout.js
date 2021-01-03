function getStyle(element) {
  if (!element.style) element.style = {}

  for (let prop in element.computedStyle) {
    let val = element.computedStyle[prop].value
    if (val.toString().match(/px$/)) {
      val = parseInt(val) 
    }
    if (val.toString().match(/^[0-9\.]+$/)) {
      val = parseInt(val)
    }
    element.style[prop] = val
  }
  return element.style
}

function layout(element) {
  if (!element.computedStyle) return

  const style = getStyle(element)

  if (style.display !== 'flex') return

  const items = element.children.filter(e => e.type === 'element')

  items.sort((a, b) => (a.order || 0) - (b.order || 0));

  // 添加默认样式
  (['width', 'height']).forEach(size => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] === null
    }
  })

  if (!style.filexDirection || style.filexDirection === 'auto') style.filexDirection = 'row'
  if (!style.alignItems || style.alignItems === 'auto') style.alignItems = 'stretch'
  if (!style.justifyContent || style.justifyContent === 'auto') style.justifyContent = 'flex-start'
  if (!style.flexWrap || style.flexWrap === 'auto') style.flexWrap = 'nowrap'
  if (!style.alignContent || style.alignContent === 'auto') style.alignContent = 'stretch'

  // 初始化辅助变量
  let mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase

  if (style.filexDirection === 'row') {
    mainSize = 'width'
    mainStart = 'left'
    mainEnd = 'right'
    mainSign = +1
    mainBase = 0

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
  if (style.filexDirection === 'row-reverse') {
    mainSize = 'width'
    mainStart = 'right'
    mainEnd = 'left'
    mainSign = -1
    mainBase = style.width

    crossSize = 'height'
    crossStart = 'top'
    crossEnd = 'bottom'
  }
  if (style.filexDirection === 'column') {
    mainSize = 'height'
    mainStart = 'top'
    mainEnd = 'bottom'
    mainSign = +1
    mainBase = 0

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.filexDirection === 'column-reverse') {
    mainSize = 'height'
    mainStart = 'bottom'
    mainEnd = 'top'
    mainSign = -1
    mainBase = style.height

    crossSize = 'width'
    crossStart = 'left'
    crossEnd = 'right'
  }

  if (style.flexWrap === 'wrap-reverse') {
    [crossStart, crossEnd] = [crossEnd, crossStart]
    crossSign = -1
  } else {
    crossBase = 0
    crossSign = 1
  }

  // 主轴计算
  let isAutoMainSize = false
  if (!style[mainSize]) {
    style[mainSize] = 0
    for (item of items) {
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] !== null || itemStyle[mainSiez] !== undefined) {
        style[mainSize] += itemStyle[mainSize]
      }
    }
    isAutoMainSize = true
  }

  let flexLine = []
  const flexLines = [flexLine]

  let mainSpace = style[mainSize]
  let crossSpace = 0

  for (let item of items) {
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] === null) itemStyle[mainSize] = 0

    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutoMainSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] !== null && itemStyle[crossBase] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }
      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainBase
        flexLine.crossSpace = crossSpace

        flexLine = []
        flexLines.push(flexLine)

        flexLine.push(item)
        mainSpace = style[mainSize]
        crossSpace = 0;
      } else {
        flexLine.push(item)
      }
      if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== undefined) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      mainSpace -= itemStyle[mainSize]
    }
  }
  flexLine.mainSpace = mainSpace

  if (style.flexWrap === 'nowrap' || isAutoMainSize) {
    flexLine.crossSpace = (style[crossSize] !== undefined)? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    for (let item of items) {
      const itemStyle = getStyle(item)

      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }

      itemStyle[mainSize] *= scale

      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    }
  } else {
    flexLines.forEach(items => {
      let mainSpace = items.mainSpace;
      let flexTotal = 0
      for (let item of items) {
        const itemStyle = getStyle(item)

        if (itemStyle.flex !== null && itemStyle.flex !== undefined) {
          flexTotal += itemStyle.flex
        }
      }

      if (flexTotal > 0) {
        let currentMain = mainBase
        for (let item of items) {
          const itemStyle = getStyle(item)

          if (itemStyle.flex) {
            itemStyle[mainSize] = mainSpace * (itemStyle.flex / flexTotal)
          }
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        }
      } else {
        let currentMain, step
        if (style.justifyContent === 'flex-start') {
          currentMain = mainBase
          step = 0
        }
        if (style.justifyContent === 'flex-end') {
          currentMain = mainSpace * mainSign + mainBase
          step = 0
        }
        if (style.justifyContent === 'center') {
          currentMain = mainSpace / 2 * mainSign + mainBase
          step = 0
        }
        if (style.justifyContent === 'space-between') {
          currentMain = mainBase
          step = mainSpace / (items.length - 1) * mainSign
        }
        if (style.justifyContent === 'space-around') {
          step = mainSpace / items.length * mainSign
          currentMain = step / 2 + mainBase
        }
        for (let item of items) {
          const itemStyle = getStyle(item)

          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        }
      }
    })
  }

  // 计算交叉轴
  if (!style[crossSize]) {
    crossSpace = 0
    style[crossSize] = 0
    for (let flexLine of flexLines) {
      style[crossSize] += flexLine.crossSpace
    }
  } else {
    crossSpace = style[crossSize]
    for (let flexLine of flexLines) {
      crossSpace -= flexLine.crossSpace
    }
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }

  let step
  if (style.alignContent === 'flex-start') {
    crossBase += 0
    step = 0
  }

  if (style.alignContent === 'flex-end') {
    crossBase += crossSign * crossSpace
    step = 0
  }

  if (style.alignContent == 'center') {
    crossBase += crossSign * crossSpace / 2
    step = 0
  }

  if (style.alignContent === 'space-between') {
    crossBase += 0
    step = crossSpace / (flexLines.length - 1)
  }

  if (style.alignContent === 'space-around') {
    step = crossSpace / flexLines.length
    crossBase += crossSign * step / 2
  }

  if (style.alignContent === 'stretch') {
    crossBase += 0
    step = 0
  }

  flexLines.forEach(items => {
    const lineCrossSize = style.alignContent === 'stretch'
      ? items.crossSpace + crossSpace / flexLines.length
      : items.crossSpace;
    
    for (let item of items) {
      const itemStyle = getStyle(item)

      const align = itemStyle.alignSelf || style.alignItems

      if (!itemStyle[crossSize]) {
        itemStyle[crossSize] = (align === 'stretch' ? lineCrossSize : 0)
      }

      if (align === 'felx-start') {
        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }

      if (align === 'flex-end') {
        itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
        itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
      }

      if (align === 'center') {
        itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize]
      }

      if (align === 'stretch') {
        const axisSize = itemStyle[crossSize] !== null && itemStyle[crossSize] !== 0
        ? itemStyle[crossSize] 
        : lineCrossSize

        itemStyle[crossStart] = crossBase
        itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * axisSize
        itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
      }
    }

    crossBase += crossSign * (lineCrossSize + step)
  })

}

module.exports = layout