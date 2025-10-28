# 边框布局与样式

## 相机聚焦框

```vue preview
<template>
  <div class="flex-row-center gap-8">
    <div class="focus-border"></div>
    <div class="focus-border" style="width: 200px"></div>
  </div>
</template>

<style>
.focus-border {
  overflow: hidden;
  width: 100px;
  height: 100px;
  border: 4px solid var(--vp-c-brand-1);
  border-radius: 10px;

  /* 核心代码 */
  -webkit-mask: conic-gradient(from -90deg at 40px 40px, red 90deg, transparent 0deg);
  -webkit-mask-position: -20px -20px;
}
</style>
```