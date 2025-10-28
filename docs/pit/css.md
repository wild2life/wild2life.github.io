---
outline: 2
---

# CSS 踩坑记录

记录个人遇到过或他人分享的 CSS 相关踩坑记录

## `flex` 项目上设置 `width` 无效

在使用 `flex` 布局时，给项目设置 `width` 无效

**解决方法**：

1.  使用 `flex-basis` 代替 `width`
2.  使用 `min-width` 代替 `width`
3.  设置 `flex-shrink: 0` 禁止项目缩小，再设置 `width`

`:visited` 不支持 `animation`

在本博客站点中，整了花里胡哨的颜色动画，但是发现 `:visited` 伪类不支持 `animation`，导致无法实现效果（各种访问过的链接颜色错乱）

::: tip `:visited` 选择器知识点
`:visited` 伪类表示用户已访问过的链接，它只支持下列 CSS 属性，其他属性无效

*   `color`
*   `background-color`
*   `border-color`
*   `outline-color`
*   `fill` 和 `stroke` 属性的颜色部分

* * *

> 相关资料

*   [`:visited` 选择器 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:visited)
*   [隐私与 `:visited` 选择器 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Privacy_and_the_:visited_selector)

:::