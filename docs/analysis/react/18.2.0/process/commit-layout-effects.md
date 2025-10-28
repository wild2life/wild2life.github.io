

`commitLayoutEffects` [​](#commitlayouteffects)
===============================================

在 `commitRootImpl()` 中会调用 `commitLayoutEffects`，进入 **layout 阶段**（即执行 DOM 操作后）

这个阶段的执行过程和 **before mutation 阶段** 类似，一样存在 **“递”** 和 **“归”** 的逻辑，通过深度优先遍历，找到最后一个有 `LayoutMask` 标记的 Fiber，然后从下往上调用 `complete` 逻辑

```ts

    commitLayoutEffects(finishedWork, root, lanes)

```

> 源码地址 [commitLayoutEffects() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L2459)

```ts

    export function commitLayoutEffects(
      finishedWork: Fiber,
      root: FiberRoot,
      committedLanes: Lanes
    ): void {
      inProgressLanes = committedLanes
      inProgressRoot = root
      nextEffect = finishedWork
    
      // 处理 layout 阶段的副作用
      commitLayoutEffects_begin(finishedWork, root, committedLanes)
    
      inProgressLanes = null
      inProgressRoot = null
    }
```

`commitLayoutEffects_begin` [​](#commitlayouteffects-begin)
-----------------------------------------------------------

> 源码地址 [commitLayoutEffects\_begin() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L2474)

```ts

    function commitLayoutEffects_begin(subtreeRoot: Fiber, root: FiberRoot, committedLanes: Lanes) {
      // Suspense layout effects semantics don't change for legacy roots.
      const isModernRoot = (subtreeRoot.mode & ConcurrentMode) !== NoMode
    
      // 对 Fiber 树进行深度优先遍历，当找到符合条件的节点时开始执行对应的操作
      while (nextEffect !== null) {
        const fiber = nextEffect
        const firstChild = fiber.child
    
        if (enableSuspenseLayoutEffectSemantics && fiber.tag === OffscreenComponent && isModernRoot) {
          // ... 省略 OffscreenComponent 组件的处理逻辑
          continue
        }
    
        // 找最后一个有 LayoutMask 标记的 Fiber
        if (
          // 判断当前 Fiber 的子 Fiber 树中是否存在 LayoutMask 副作用（即 Update | Callback | Ref | Visibility）
          (fiber.subtreeFlags & LayoutMask) !== NoFlags &&
          // 判断当前 Fiber 是否存在子 Fiber
          firstChild !== null
        ) {
          // 更新指针
          firstChild.return = fiber
          nextEffect = firstChild
        } else {
          // 找最后一个带有 LayoutMask 标识的 Fiber 时，进入该 Fiber 的 complete 阶段
          commitLayoutMountEffects_complete(subtreeRoot, root, committedLanes)
        }
      }
    }

```

`commitLayoutMountEffects_complete` [​](#commitlayoutmounteffects-complete)
---------------------------------------------------------------------------

> 源码地址 [commitLayoutMountEffects\_complete() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L2548)

```

    function commitLayoutMountEffects_complete(
      subtreeRoot: Fiber,
      root: FiberRoot,
      committedLanes: Lanes
    ) {
      while (nextEffect !== null) {
        const fiber = nextEffect
        if ((fiber.flags & LayoutMask) !== NoFlags) {
          const current = fiber.alternate
          try {
            // layout 阶段的主要函数（执行对应生命周期钩子和 Hook）
            commitLayoutEffectOnFiber(root, current, fiber, committedLanes)
          } catch (error) {
            captureCommitPhaseError(fiber, fiber.return, error)
          }
        }
    
        if (fiber === subtreeRoot) {
          nextEffect = null
          return
        }
    
        const sibling = fiber.sibling
        // 判断是否存在兄弟节点
        if (sibling !== null) {
          // 当存在兄弟节点时更新指针并返回到 begin 方法继续向下遍历
          sibling.return = fiber.return
          nextEffect = sibling
          return
        }
    
        // 更新指针为父节点
        nextEffect = fiber.return
      }
    }

```

### `commitLayoutEffectOnFiber` [​](#commitlayouteffectonfiber)

`commitLayoutEffectOnFiber` 函数是 layout 阶段的主要函数，其内部会根据 `finishedWork.tag` 来调用对应生命周期钩子和 Hook

*   `FunctionComponent`、`ForwardRef`、`SimpleMemoComponent`：执行 `useLayoutEffect` 挂载函数
*   `ClassComponent`：执行 `componentDidMount` 或 `componentDidUpdate` 生命周期函数

> 源码地址 [commitLayoutEffectOnFiber() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L702)

```ts

    function commitLayoutEffectOnFiber(
      finishedRoot: FiberRoot,
      current: Fiber | null,
      finishedWork: Fiber,
      committedLanes: Lanes,
    ): void {
      if ((finishedWork.flags & LayoutMask) !== NoFlags) {
        switch (finishedWork.tag) {
          case FunctionComponent:
          case ForwardRef:
          case SimpleMemoComponent: {
            if (
              !enableSuspenseLayoutEffectSemantics ||
              !offscreenSubtreeWasHidden
            ) {
              // At this point layout effects have already been destroyed (during mutation phase).
              // This is done to prevent sibling component effects from interfering with each other,
              // e.g. a destroy function in one component should never override a ref set
              // by a create function in another component during the same commit.
    
              // 执行 useLayoutEffect 挂载函数
              if (
                enableProfilerTimer &&
                enableProfilerCommitHooks &&
                finishedWork.mode & ProfileMode
              ) {
                try {
                  startLayoutEffectTimer();
                  commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
                } finally {
                  recordLayoutEffectDuration(finishedWork);
                }
              } else {
                commitHookEffectListMount(HookLayout | HookHasEffect, finishedWork);
              }
            }
            break;
          }
          case ClassComponent: {
            const instance = finishedWork.stateNode;
            if (finishedWork.flags & Update) {
              if (!offscreenSubtreeWasHidden) {
                // 通过 current 判断当前是 mount 还 update
                if (current === null) {
                  // We could update instance props and state here,
                  // but instead we rely on them being set during last render.
                  // TODO: revisit this when we implement resuming.
    
                  // 执行类组件的 componentDidMount 生命周期函数
                  if (
                    enableProfilerTimer &&
                    enableProfilerCommitHooks &&
                    finishedWork.mode & ProfileMode
                  ) {
                    try {
                      startLayoutEffectTimer();
                      instance.componentDidMount();
                    } finally {
                      recordLayoutEffectDuration(finishedWork);
                    }
                  } else {
                    instance.componentDidMount();
                  }
                } else {
                  const prevProps =
                    finishedWork.elementType === finishedWork.type
                      ? current.memoizedProps
                      : resolveDefaultProps(
                          finishedWork.type,
                          current.memoizedProps,
                        );
                  const prevState = current.memoizedState;
                  // We could update instance props and state here,
                  // but instead we rely on them being set during last render.
                  // TODO: revisit this when we implement resuming.
    
                  // 执行类组件的 componentDidUpdate 生命周期函数
                  if (
                    enableProfilerTimer &&
                    enableProfilerCommitHooks &&
                    finishedWork.mode & ProfileMode
                  ) {
                    try {
                      startLayoutEffectTimer();
                      instance.componentDidUpdate(
                        prevProps,
                        prevState,
                        instance.__reactInternalSnapshotBeforeUpdate,
                      );
                    } finally {
                      recordLayoutEffectDuration(finishedWork);
                    }
                  } else {
                    instance.componentDidUpdate(
                      prevProps,
                      prevState,
                      instance.__reactInternalSnapshotBeforeUpdate,
                    );
                  }
                }
              }
            }
    
            // TODO: I think this is now always non-null by the time it reaches the
            // commit phase. Consider removing the type check.
            const updateQueue: UpdateQueue | null = (finishedWork.updateQueue: any);
            if (updateQueue !== null) {
              // We could update instance props and state here,
              // but instead we rely on them being set during last render.
              // TODO: revisit this when we implement resuming.
              commitUpdateQueue(finishedWork, updateQueue, instance);
            }
            break;
          }
          case HostRoot: {
            // TODO: I think this is now always non-null by the time it reaches the
            // commit phase. Consider removing the type check.
            const updateQueue: UpdateQueue | null = (finishedWork.updateQueue: any);
            if (updateQueue !== null) {
              let instance = null;
              if (finishedWork.child !== null) {
                switch (finishedWork.child.tag) {
                  case HostComponent:
                    instance = getPublicInstance(finishedWork.child.stateNode);
                    break;
                  case ClassComponent:
                    instance = finishedWork.child.stateNode;
                    break;
                }
              }
              commitUpdateQueue(finishedWork, updateQueue, instance);
            }
            break;
          }
          case HostComponent: {
            const instance: Instance = finishedWork.stateNode;
    
            // Renderers may schedule work to be done after host components are mounted
            // (eg DOM renderer may schedule auto-focus for inputs and form controls).
            // These effects should only be committed when components are first mounted,
            // aka when there is no current/alternate.
            if (current === null && finishedWork.flags & Update) {
              const type = finishedWork.type;
              const props = finishedWork.memoizedProps;
              // 处理表单元素的 autoFocus 属性
              commitMount(instance, type, props, finishedWork);
            }
    
            break;
          }
          case HostText: {
            // We have no life-cycles associated with text.
            break;
          }
          case HostPortal: {
            // We have no life-cycles associated with portals.
            break;
          }
    
          // ... 省略以下 case 的处理逻辑
          case Profiler:
          case SuspenseComponent:
          case SuspenseListComponent:
          case IncompleteClassComponent:
          case ScopeComponent:
          case OffscreenComponent:
          case LegacyHiddenComponent:
          case TracingMarkerComponent: {
            break;
          }
    
          default:
            throw new Error(
              'This unit of work tag should not have side-effects. This error is ' +
                'likely caused by a bug in React. Please file an issue.',
            );
        }
      }
    
      // 处理 Ref 副作用
      if (!enableSuspenseLayoutEffectSemantics || !offscreenSubtreeWasHidden) {
        if (enableScopeAPI) {
          // TODO: This is a temporary solution that allowed us to transition away
          // from React Flare on www.
          if (finishedWork.flags & Ref && finishedWork.tag !== ScopeComponent) {
            commitAttachRef(finishedWork);
          }
        } else {
          if (finishedWork.flags & Ref) {
            commitAttachRef(finishedWork);
          }
        }
      }
    }

```  

### `commitAttachRef` [​](#commitattachref)

`commitAttachRef` 函数用于获取 DOM 实例，更新 `ref`

> 源码地址 [commitAttachRef() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L1232)

```ts

    function commitAttachRef(finishedWork: Fiber) {
      const ref = finishedWork.ref
      if (ref !== null) {
        const instance = finishedWork.stateNode
    
        // 获取 DOM 实例
        let instanceToUse
        switch (finishedWork.tag) {
          case HostComponent:
            instanceToUse = getPublicInstance(instance)
            break
          default:
            instanceToUse = instance
        }
        // Moved outside to ensure DCE works with this flag
        if (enableScopeAPI && finishedWork.tag === ScopeComponent) {
          instanceToUse = instance
        }
        if (typeof ref === 'function') {
          // 如果 ref 是函数，调用回调函数并传入 DOM 实例
          let retVal
          if (enableProfilerTimer && enableProfilerCommitHooks && finishedWork.mode & ProfileMode) {
            try {
              startLayoutEffectTimer()
              retVal = ref(instanceToUse)
            } finally {
              recordLayoutEffectDuration(finishedWork)
            }
          } else {
            retVal = ref(instanceToUse)
          }
        } else {
          // 如果 ref 是 ref 实例形式，则将值赋给 current 属性
          ref.current = instanceToUse
        }
      }
    }

```
