React 设计理念与架构 [​](#react-设计理念与架构)
=================================

单线程的 JavaScript 与多线程的浏览器 [​](#单线程的-javascript-与多线程的浏览器)
-------------------------------------------------------

> 经典名言：**JavaScript 是单线程的，浏览器是多线程的**

多线程的浏览器除了要处理 JavaScript 线程以外，还需要处理包括事件系统、定时器/延时器、网络请求、**处理 DOM 的 UI 渲染线程**等各种各样的任务线程，而 **JavaScript 线程是可以操作 DOM 的**，这就决定了 **JavaScript 线程和渲染线程必须是互斥的**

::: tip 为什么 JavaScript 线程和渲染线程必须是互斥的

当渲染线程和 JavaScript 线程同时工作时，其渲染结果是难以预测的：比如渲染线程刚绘制好的一张图片，JavaScript 线程可能会将其删除，或者渲染线程刚绘制好的一段文字，JavaScript 线程可能会将其修改为其他文字，这样页面可能会渲染混乱、样式错乱、甚至导致页面崩溃

::: 

当下主流浏览器刷新频率为 60Hz，即每 `16.6ms` （`1000ms / 60Hz`）浏览器会刷新一次。在这 `16.6ms` 内需要执行 JavaScript 脚本、样式布局、样式绘制等；同时在这个互斥机制下，如果 JavaScript 线程长时间地占用了主线程，就会导致**渲染层面的更新就不得不长时间地等待，界面长时间不更新，带给用户的体验就是所谓的“卡顿”**

React 15 的架构 [​](#react-15-的架构)
-------------------------------

React 15 架构可以分为两层：

*   **Reconciler（协调器）**：**负责找出变化的组件**（每当有更新发生时 Reconciler 会做如下工作）
    1.  调用函数组件、或 `class` 组件的 `render` 方法，将返回的 JSX 转化为虚拟 DOM
    2.  将虚拟 DOM 和上次更新时的虚拟 DOM 对比
    3.  通过对比找出本次更新中变化的虚拟 DOM
    4.  通知 Renderer 将变化的虚拟 DOM 渲染到页面上
*   **Renderer（渲染器）**：**负责将变化的组件渲染到页面上**（接到 Reconciler 通知后将变化的组件渲染到页面上）

在 React 15 以及更早的版本中使用的是 [Stack Reconciler](https://github.com/facebook/react/tree/15-stable/src/renderers/shared/stack/reconciler)，其具有固有的局限性：**同步并且无法中断工作或将其拆分为块**

由于 **Stack Reconciler**是一个同步的递归过程，导致其不可被打断，当处理结构相对复杂、体量相对庞大的虚拟 DOM 树时，**Stack Reconciler** 需要的调和时间就会变长，这就意味着 JavaScript 线程将长时间地霸占主线程，从而导致上文所描述的渲染卡顿/卡死、交互长时间无响应等问题

异步可中断 [​](#异步可中断)
-----------------

在日常的开发中，如果遇到比较耗时的代码计算会怎么办呢，首先我们可能会将任务分割，让它能够被中断，在其他任务到来的时候让出执行权，当其他任务执行后，再从之前中断的部分开始异步执行剩下的计算。所以关键是实现一套**异步可中断**的方案

由此得知，在 React 的实现中有这三个重要概念

*   任务分割
*   异步执行
*   让出执行权

1.  **Fiber**：React 15 的更新是同步的，因为它不能将任务分割，所以需要一套数据结构让它既能对应真实的 DOM 又能作为分隔的单元，这就是 Fiber
2.  **Scheduler**：有了 Fiber 后，我们需要一个时间片异步执行这些 Fiber 的工作单元，而 React 实现的时间片运行机制就叫做 Scheduler
3.  **Lane**：有了异步调度后，我们还需要细粒度的管理各个任务的优先级，让高优先级的任务优先执行，各个 Fiber 工作单元还能比较优先级，相同优先级的任务可以一起更新

代数效应 [​](#代数效应)
---------------

代数效应是函数式编程中的一个概念，用于**将副作用从函数调用中分离**出来，使得函数调用只关注输入和输出，而不关注函数内部的具体实现。在 React 中，代数效应的应用最明显的例子就是 `Hooks`

详细资料

[什么是代数效应 | React 技术揭秘](https://react.iamkasong.com/process/fiber-mental.html)

React 16 之后的架构 [​](#react-16-之后的架构)
-----------------------------------

> 为了解决上面的问题，React 从 `v15` 升级到 `v16` 后重构了整个架构，引入了 Fiber Reconciler

React 16 架构可以分为三层：

*   Scheduler（调度器）：调度任务的优先级（高优任务优先进入 **Reconciler**）
*   Reconciler（协调器）：负责找出变化的组件
*   Renderer（渲染器）：负责将变化的组件渲染到页面上

在新的架构中，React 新增了 **Scheduler（调度器）**

### Scheduler（调度器） [​](#scheduler-调度器)

浏览器本身提供了一个 [requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback) API，但由于以下因素 React 放弃使用：

*   浏览器兼容性
*   触发频率不稳定（如当我们的浏览器切换 tab 后，之前 tab 注册的 `requestIdleCallback` 触发频率会变低）

基于以上原因，React 实现了功能更完备的 `requestIdleCallback` polyfill，这就是 Scheduler。除了在空闲时触发回调的功能外，Scheduler 还提供了多种调度优先级供任务设置

> [Scheduler](https://github.com/facebook/react/blob/493f72b0a7111b601c16b8ad8bc2649d82c184a0/packages/scheduler/README.md) 是独立于 React 的库

### Reconciler（协调器） [​](#reconciler-协调器)

在 React15 中 Reconciler 是递归处理虚拟 DOM；而在 React 16 则将递归变成了可以中断的循环过程

每次循环都会调用 `shouldYield` 判断当前是否有剩余时间。如果没有剩余时间，就会退出循环，将控制权交还给浏览器；如果有剩余时间，就会继续循环，继续调用 `performUnitOfWork`

```js

    function workLoopConcurrent() {
      // Perform work until Scheduler asks us to yield
      while (workInProgress !== null && !shouldYield()) {
        performUnitOfWork(workInProgress)
      }
    }

```
> 源码地址 [workLoopConcurrent | ReactFiberWorkLoop.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberWorkLoop.old.js#L1824)

在 React16 中，Reconciler 与 Renderer 不再是交替工作。当 Scheduler 将任务交给 Reconciler 后，Reconciler 会为变化的虚拟 DOM 打上代表增/删/更新的标记，类似这样：

```js

    export const Placement = /*                    */ 0b00000000000000000000000010
    export const Update = /*                       */ 0b00000000000000000000000100
    export const Deletion = /*                     */ 0b00000000000000000000001000

```

同时整个 Scheduler 与 Reconciler 的工作都在内存中进行。只有当所有组件都完成 Reconciler 的工作，才会统一交给 Renderer，这样就保证了整个过程不会出现中断导致页面渲染不完全的情况

### Renderer（渲染器） [​](#renderer-渲染器)

Renderer 根据 Reconciler 为 Fiber 节点打的标记，同步执行对应的 DOM 操作

> 在 React 16 架构中的更新流程

![update-process](../../images/react-18/update-process.png)

红框中的步骤随时可能由于以下原因被中断：

*   有其他更高优任务需要先更新
*   当前帧没有剩余时间

由于红框中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断用户也不会看见更新不完全的 DOM

* * *

相关资料

*   [React 理念 | React 技术揭秘](https://react.iamkasong.com/preparation/idea.html)
*   [Fiber 架构的心智模型 | React 技术揭秘](https://react.iamkasong.com/process/fiber-mental.html)
*   [React 的设计理念 | React 源码解析](https://xiaochen1024.com/courseware/60b1b2f6cf10a4003b634718/60b1b31ccf10a4003b63471a)