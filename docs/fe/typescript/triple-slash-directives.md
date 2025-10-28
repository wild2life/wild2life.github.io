
三斜线指令 [​](#三斜线指令)
=================

`/// <reference>` 语法是一种特殊的 TypeScript 注释，用于在编译期间显式地引入其他文件中的类型信息，确保项目中的类型信息得到正确的引用和使用

*   这种注释通常出现在文件的顶部，用于声明文件之间的依赖关系
*   如果出现在一个语句或声明之后，那么其会被当做普通的单行注释，不再具有特殊含义

主要用途

1.  **引入类型声明文件**：常用于引入外部 `.d.ts` 类型声明文件，以便在当前工程中使用这些类型声明
2.  **声明文件之间的依赖**：在大型项目中，如果类型声明文件有依赖关系，`/// <reference>` 可以确保依赖文件先被加载
3.  **引用库文件**：可以声明对某个包的依赖（比如 `node` 库，这样 TypeScript 编译器会自动加载对应的类型声明文件）

语法说明 [​](#语法说明)
---------------

### `/// <reference path="..." />` [​](#reference-path)

引用一个本地的 TypeScript 类型声明文件 (`.d.ts` 文件)（其可以是相对路径或绝对路径）

```ts

    // 相对路径
    /// <reference path="./types/index.d.ts" />
    
    // 绝对路径
    /// <reference path="D:/project/types/index.d.ts" />

```

### `/// <reference types="..." />` [​](#reference-types)

用于引入 `@types` 包中的类型声明文件

```ts

    /// <reference types="node" />

```  

### `/// <reference lib="..." />` [​](#reference-lib)

引用 TypeScript 提供的内置的 `lib` 类型声明文件，如 `es2015`、`dom`等

```ts

    /// <reference lib="es2015" />

``` 

### `/// <reference no-default-lib="true"/>` [​](#reference-no-default-lib-true)

告诉 TypeScript 编译器不要自动引入 `lib.d.ts` 文件

```ts

    /// <reference no-default-lib="true" />

```

编译选项 [​](#编译选项)
---------------

当使用 `/// <reference>` 时，需要确保 TypeScript 编译器知道如何处理这些指令。可以通过以下编译选项来配置：

*   `--noResolve`：禁用自动解析模块，编译器不会自动解析 `/// <reference>` 中的文件
*   `--noLib`：禁用所有默认标准库文件，需要手动指定 `/// <reference>`

```ts

    // 在 TypeScript 文件顶部手动引入 ES2015 标准库
    /// <reference lib="es2015" />

```

其他说明 [​](#其他说明)
---------------

使用场景

*   **使用模块系统**：如果项目使用 ES6 模块或 CommonJS，通常不需要使用 `/// <reference>`，而是通过 `import` 引入模块
*   **优先使用 `tsconfig.json` 配置**：大多数项目应使用 `tsconfig.json` 来管理类型文件的引用，这样更简洁和可维护
*   **使用场景**：如果在没有模块系统的环境中开发，或者需要处理全局变量、全局类型时，`/// <reference>` 会派上用场

注意事项

*   `/// <reference>` 必须出现在文件的顶部，且不能包含其他代码或注释
*   路径必须有效且正确，否则 TypeScript 编译器无法找到并加载引用的文件

