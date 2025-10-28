---
outline: 2
---

# TypeScript 踩坑记录

记录个人遇到或他人分享的 TypeScript 相关踩坑记录

`@` 别名冲突
-------------------

在 TypeScript 中，路径别名 `@` 会和 `npm` 组织库的 `@` 冲突，导致类型无法正确加载

**解决方法**：

修改 `tsconfig.json` 配置中的 `@` 别名为其他名称，如 `~` 或 `src` 等

```jsonc {5,6,8,9}
    {
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          // 使用 ~ 别名
          "~/*": ["src/*"],
    
          // 使用 src 别名
          "src/*": ["src/*"]
        }
      }
    }

```
