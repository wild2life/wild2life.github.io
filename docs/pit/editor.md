---
outline: 2
---

# 编辑器踩坑记录

## 在 VSCode 使用 GUI 时提示 `xxx: command not found`

> 以 `husky` 为例

在 VSCode 中使用 GUI（`源代码管理` - `输入框`）进行 `git commit` 时，提示 `Git: .husky/commit-msg: line 4: npx: command not found`
::: warning 原因
1.  使用了 `fnm` 或 `nvm` 存在了多个版本的 Node.js
2.  在终端外部启动的 GUI 不会初始化 Node.js，导致 `$PATH` 中没有 Node.js
3.  当使用 VSCode GUI 时，就会导致 Node.js 相关的命令丢失
:::
**解决方法**：

> 一共有如下几种方案

1.  通过 VSCode 的 `code` 命令打开编辑器（使用命令行进入到项目目录 `code .`）
2.  添加 `~/.config/husky/init.sh` 或 `~/.huskyrc` 文件（内容如下）

> `~/.huskyrc` 高版本已弃用

fnmnvm

```bash
    eval "$(fnm env --use-on-cd)"

```

```bash
    export NVM_DIR="$HOME/.nvm" [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

```

当 `shell` 启动文件快速且轻量级时可直接在 `~/.config/husky/init.sh` 或 `~/.huskyrc` 配置如下

> Oh My ZSH: 你们针对我？

```sh
    . ~/.zshrc

```  
::: info 相关资料

*   [Node Version Managers and GUIs | Husky](https://typicode.github.io/husky/how-to.html#node-version-managers-and-guis)
*   [Bug commit from vscode](https://github.com/typicode/husky/issues/912)
*   [VSCODE & GitHub Desktop pre-commit hook: npx: command not found | Stack Overflow](https://stackoverflow.com/questions/67115897/vscode-github-desktop-pre-commit-hook-npx-command-not-found)
:::
