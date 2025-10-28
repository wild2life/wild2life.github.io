---
outline: 2
---

# JavaScript 踩坑记录

## 字符串长度统计不正确

JavaScript 引擎使用 UTF-16 编码来存储字符串，而 UTF-16 编码中的大部分字符都是用一个或多个 UTF-16 单元表示，而字符串的 `length` 属性返回的是字符串中包含的 16 位值的数量，而不是字符的实际数量

```js
    // 直接计算长度
    '𠮷'.length         // 2
    '😀'.length         // 2
    '👩‍👩‍👧‍👧'.length         // 11
    
    // 转为数组计算
    [...'𠮷'].length    // 1
    [...'😀'].length    // 1
    [...'👩‍👩‍👧‍👧'].length    // 7

```
::: warning
在 `html` 中，`input` 和 `textarea` 的 `maxlength` 属性也会计算错误
:::

**解决方法**：

使用 [lodash](https://github.com/lodash/lodash) 提供的 [size](https://www.lodashjs.com/docs/lodash.size) 方法来计算字符串的长度

```js
    import { size } from 'lodash'
    
    size('𠮷') // 1
    size('😀') // 1
    size('👩‍👩‍👧‍👧') // 1

``` 

相关资料

*   [探索 emoji 字符串长度之谜](https://mp.weixin.qq.com/s/YuGPfaDpak-TO8vt20LAyA)
*   [lodash | GitHub](https://github.com/lodash/lodash)
