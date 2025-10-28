# 文字显示动画

## 相关知识点：

1. 行内元素 `background` 显示特性  
2. `linear-gradient`、`animation`  
3. 使用 CSS Houdini API 自定义属性  

---

```vue preview
<script setup>
const text =
  '一边喝咖啡一边看报错，一边修 bug 一边记笔记。写着写着就变成生活随笔了。一边喝咖啡一边看报错，一边修 bug 一边记笔记。写着写着就变成生活随笔了一边喝咖啡一边看报错，一边修 bug 一边记笔记。写着写着就变成生活随笔了一边喝咖啡一边看报错，一边修 bug 一边记笔记。写着写着就变成生活随笔了'
</script>

<template>
  <div class="rounded p-2.5 text-white bg-black">
    <div>
      <span class="bg-blue-400">
        {{ text }}
      </span>
    </div>
    <div class="relative mt-3">
      <div>
        {{ text }}
      </div>
      <div class="absolute inset-0">
        <span class="reveal">
          {{ text }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.reveal {
  color: transparent;
  background: linear-gradient(to right, transparent var(--p), #000 calc(var(--p) + 3em));
  animation: reveal 6s linear infinite forwards;
}

/* Houdini API */
@property --p {
  syntax: '<percentage>';
  initial-value: 0%;
  inherits: false;
}

@keyframes reveal {
  to {
    --p: 100%;
  }
}
</style>
```