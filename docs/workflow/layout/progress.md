# 进度条布局与样式

## PK 投票进度条
利用 `linear-gradient` 和 `-webkit-mask` 实现的投票进度条

---

```vue preview
<script setup>
import { ref, computed } from 'vue'

const value = ref(50)

// 进度条最大值为 80，最小值为 10，以此计算出左右两边的百分比
const left = computed(() => {
  return (((value.value - 10) / 80) * 100).toFixed(1)
})
const right = computed(() => {
  return (100 - left.value).toFixed(1)
})
</script>

<template>
  <div class="flex-col-center gap-6">
    <div class="pk whitespace-nowrap">
      <div class="pk-item pk-left flex items-center" :style="{ width: `${value}%` }">
        <div class="px-4">支持 {{ left }}%</div>
      </div>
      <div class="pk-item pk-right flex items-center justify-end">
        <div class="px-4">反对 {{ right }}%</div>
      </div>
    </div>
    <input type="range" min="10" max="90" v-model="value" />
  </div>
</template>

<style>
.pk {
  overflow: hidden;
  display: flex;
  border-radius: 40px;
  width: 100%;
}
.pk-item {
  min-width: min-content;
  height: 40px;
}
.pk-left {
  background: linear-gradient(85deg, #ff9078 7.57%, #fa3440 80.06%);
  -webkit-mask: linear-gradient(red, red),
    url("data:image/svg+xml,%3Csvg width='16' height='40' viewBox='0 0 16 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M16 0h-2.344a1 1 0 0 1 .957 1.287L3.855 37.148A4 4 0 0 1 .023 40H16V0z' fill='%23C6F'/%3E%3C/svg%3E")
      right/auto 100% no-repeat;
  -webkit-mask-composite: source-out;
}
.pk-right {
  flex: 1;
  background: linear-gradient(274deg, #5fb6f5 -3.81%, #4b80ee 62.98%);
  -webkit-mask: linear-gradient(red, red),
    url("data:image/svg+xml,%3Csvg width='16' height='40' viewBox='0 0 16 40' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M0 40h2.344a1 1 0 0 1-.957-1.287L12.145 2.85A4 4 0 0 1 15.977 0H0v40z' fill='%23C6F'/%3E%3C/svg%3E")
      left/auto 100% no-repeat;
  -webkit-mask-composite: source-out;
}
</style>
```

::: info 相关资料

- [CSS mask 与 切图艺术](https://mp.weixin.qq.com/s/QrXlbuSKyq8uQId5tT4_9A?poc_token=HDsL_2ijQ_91VBTFCOFLlsWOsNsuXDfo-I_Iot0v)
- [CSS PK | codepen](https://codepen.io/xboxyan/pen/oNJeoYv)
- [CSS PK | 码上掘金](https://code.juejin.cn/pen/7281253921112621097)

:::
