JSX [​](#jsx)
=============

JSX 是 JavaScript 语法扩展，结构类似 XML，可以让你在 JavaScript 文件中书写类似 HTML 的标签

为什么要使用 `JSX` [​](#为什么要使用-jsx)
-----------------------------

> JSX 是 React 的一大特性

使用 JSX 可以让我们在 JavaScript 中直接使用 `HTML` 标签，而不用通过 `document.createElement` 等方法来创建元素，这样可以让我们的代码更加简洁，更加直观

::: tip 
JSX 和 React

[JSX 和 React 是相互独立的](https://legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform)东西。虽然它们经常一起使用，但你**可以单独使用**它们中的任意一个

*   JSX 是一种语法扩展
*   React 是一个 JavaScript 的库

::: 
JSX 语法的规则 [​](#jsx-语法的规则)
-------------------------

*   只能返回一个根元素（组件中包含多个元素时需要用一个父标签把它们包裹起来）
    *   父标签可以是 HTML 标签或 `<React.Fragment>`（即 `<>` 和 `</>`）
*   标签必须闭合（如果没有子元素可以使用自闭合标签 `<img />`）
*   标签的属性命名使用驼峰命名法（`class` 是一个保留字，需要用 `className` 来代替）
*   标签的属性值可以是字符串或表达式，表达式需要使用大括号包裹
    *   引号内的值会作为字符串传递给属性 `<App name="maomao" />`
    *   在大括号内中可以使用任何 JavaScript 表达式，包括函数调用 `<App a={1+2} b={fn()} />`
    *   `{/{ ... }/}` 不是什么特殊的语法：只是包在 JSX 大括号内的 JavaScript 对象
*   JSX 注释以 `{/* ... */}` 形式表示

JSX 语法的转换 [​](#jsx-语法的转换)
-------------------------

在 `React` 中所有的元素都是通过 `React.createElement` 方法创建的。使用 `JSX` 语法的代码最终会被 `Babel` 编译为 `React.createElement` 方法，即 **`JSX` 语法的本质就是 `React.createElement` 方法**

```jsx

    // JSX 语法
    import React from 'react'
    const element = <h1 className="greeting">Hello, world!</h1>
    
    // 通过 babel 转化为 React.createElement 方法
    import React from 'react'
    const element = React.createElement('h1', { className: 'greeting' }, 'Hello, world!')
``` 

这也是为什么在 `React 17` 之前我们在使用 `JSX` 语法时必须要引入 `React` 的原因，如果不引入 `React` 就会因为找不到 `React.createElement` 方法导致编译失败

`React.createElement` 方法 [​](#react-createelement-方法)
-----------------------------------------------------

> 源码地址 [createElement | ReactElement.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react/src/ReactElement.js#L362)

```js

    export function createElement(type, config, children) {
      // 用于存储遍历时的属性名
      let propName
    
      // 创建一个用于存储属性的空对象 props
      const props = {}
    
      // key、ref、self、source 均为 React 元素的属性
      let key = null
      let ref = null
      let self = null
      let source = null
    
      if (config != null) {
        // 依次对 ref、key、self 和 source 属性赋值
        if (hasValidRef(config)) {
          ref = config.ref
        }
        // 将 key 转换为字符串
        if (hasValidKey(config)) {
          key = '' + config.key
        }
    
        self = config.__self === undefined ? null : config.__self
        source = config.__source === undefined ? null : config.__source
    
        // 将 config 对象中剩余属性添加到新的 props 对象中
        for (propName in config) {
          if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
            props[propName] = config[propName]
          }
        }
      }
    
      // 计算子元素的个数（去除 type 和 config 剩余的参数都是 children）
      const childrenLength = arguments.length - 2
    
      // 根据剩余的参数的长度分别处理 children 并赋值给 props.children
      if (childrenLength === 1) {
        props.children = children
      } else if (childrenLength > 1) {
        const childArray = Array(childrenLength)
        for (let i = 0; i < childrenLength; i++) {
          childArray[i] = arguments[i + 2]
        }
        props.children = childArray
      }
    
      // 处理 defaultProps
      if (type && type.defaultProps) {
        const defaultProps = type.defaultProps
        for (propName in defaultProps) {
          if (props[propName] === undefined) {
            props[propName] = defaultProps[propName]
          }
        }
      }
    
      return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props)
    }

```

> 源码地址 [ReactElement | ReactElement.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react/src/ReactElement.js#L148)

```js

    const ReactElement = function (type, key, ref, self, source, owner, props) {
      const element = {
        // 标识是一个 React Element 元素
        $$typeof: REACT_ELEMENT_TYPE,
    
        // 元素的内置属性
        type: type,
        key: key,
        ref: ref,
        props: props,
    
        // 记录创建此元素的组件
        _owner: owner,
      }
    
      return element
    }
``` 

`createElement` 方法接收三个参数：

*   `type`：元素的类型
*   `config`：元素的属性
*   `children`：元素的子元素

该方法会将 `config` 中的 `ref`、`key`、`__self`、`__source` 等属性提取出来，剩余的属性放到 `props` 对象中，最后调用 `ReactElement` 方法并返回一个 `React Element` 对象


::: tip 如何判断一个对象是 `React Element` 对象

React 提供了一个 [`isValidElement` 方法](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react/src/ReactElement.js#L567)用于判断一个对象是否是 `React Element` 对象

```js

    export function isValidElement(object) {
      return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE
    }
```
可以看到，主要满足条件 `$$typeof === REACT_ELEMENT_TYPE` 的非 `null` 对象就是一个合法的 `React Element` 对象
::: 
全新的 JSX 转换 [​](#全新的-jsx-转换)
---------------------------

React 17 提供了[全新的 JSX 转换](https://zh-hans.legacy.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)，在使用时不再需要引入 React

```jsx

    // 源代码
    function App() {
      return <h1>Hello World</h1>
    }
    
    // 新的 JSX 转换
    import { jsx as _jsx } from 'react/jsx-runtime'
    
    function App() {
      return _jsx('h1', { children: 'Hello world' })
    }

```

`jsx` 方法和上面的 `createElement` 方法一样，都是对参数进行处理，最后调用 `ReactElement` 方法返回 `React Element` 对象

