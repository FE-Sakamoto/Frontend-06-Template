# Week 04

### Trie

![字典树](https://tva1.sinaimg.cn/large/0081Kckwly1gky8suc777j31hc0u0anu.jpg)

这种数据结构还是比较简单的.这种数据结构的特点在于利用公用前缀以节省空间和时间.

空间: `3499, 0015, 0002, 0007`这组数据中一共出现了8次0但是Trie树种只出现了3次0相对于`Map\Object`这种key-val存储可以节省空间

时间: 如果想要进行前缀匹配比如查询所有为`000`开头的数据(常见于搜索引擎的关键字联系),key-val结果必须依次匹配,而Trie树只需返回指定的树即可.



### KMP

![image-20201122220036595](https://tva1.sinaimg.cn/large/0081Kckwly1gkyar8vpy2j31hc0u07dr.jpg)

KMP实际上是利用pattern的特征和未匹配中的信息跳过一些不可能的步骤以加快匹配O(m+n)

关键在于利用pattern生成next特征表

next[i] = v的含义位

> pattern[0] ~ pattern[i] 这个字字符串subStr中 最多有subStr[0...v] ===  subStr[i - v, i]



如下图第一次匹配j=6是发生了不匹配 next[6] = 4, 指针i不变 j指向4即可.

![img](https://pic2.zhimg.com/80/v2-40b4885aace7b31499da9b90b7c46ed3_720w.jpg?source=1940ef5c)



![img](https://pic1.zhimg.com/80/v2-03a0d005badd0b8e7116d8d07947681c_720w.jpg?source=1940ef5c)



leetcode28代码和执行效果

```js
var strStr = function(haystack, needle) {
  if (needle.length === 0) return 0
  return kmp(haystack, needle)
};

function kmp(source, pattern) {
  const table = Array(pattern.length).fill(0)
  {
    let i = 1, j = 0
    while(i < pattern.length) {
      if (pattern[i] === pattern[j]) {
        i++, j++
        table[i] = j
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          i++
        }
      }
    }
  }

  {
    let i = 0, j = 0
    while(i < source.length) {
      if (pattern[j] === source[i]) {
        i++, j++
      } else {
        if (j > 0) {
          j = table[j]
        } else {
          i++
        }
      }
      if (j === pattern.length) {
        return i - pattern.length
      }
    }
    return -1
  }
}
```



![image-20201122220617236](https://tva1.sinaimg.cn/large/0081Kckwly1gkyax6j63rj31e20u0kb7.jpg)



### Wildcard

一种类正则表达式:

`*`表示匹配零个或任意个字符 最后一位`*`做贪婪匹配,其他`*`不做贪婪匹配

`?`表示匹配一个任意字符



将`pattern`根据`*`进行split,然后根据`*`数量分别进行判断

1. 0个

   逐位匹配,pattern是问号则跳过

2. 1个

   从`*`左右两侧向中心进行

3. 2个及以上

   最后一个还是反向匹配,其余的都转化为正则进行匹配

