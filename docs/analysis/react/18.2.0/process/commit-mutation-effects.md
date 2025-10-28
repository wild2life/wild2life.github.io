

`commitMutationEffects` [​](#commitmutationeffects)
===================================================

在 `commitRootImpl()` 中会调用 `commitMutationEffects`，进入 **mutation 阶段**（即执行 DOM 操作）

```ts

    commitMutationEffects(root, finishedWork, lanes)

```

> 源码地址 [commitMutationEffects() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L2036)

```ts

    export function commitMutationEffects(root: FiberRoot, finishedWork: Fiber, committedLanes: Lanes) {
      inProgressLanes = committedLanes
      inProgressRoot = root
    
      commitMutationEffectsOnFiber(finishedWork, root, committedLanes)
    
      inProgressLanes = null
      inProgressRoot = null
    }

```  

`commitMutationEffectsOnFiber` [​](#commitmutationeffectsonfiber)
-----------------------------------------------------------------

`commitMutationEffectsOnFiber` 函数中会处理进行如下操作：

*   调用 `recursivelyTraverseMutationEffects` 函数递归遍历子 Fiber 树
*   调用 `commitReconciliationEffects` 函数
*   处理 **Update** 副作用（更新）
*   处理 **Ref** 副作用（卸载 Ref）
*   处理 **ContentReset** 副作用（重置文本内容）

> 源码地址 [commitMutationEffectsOnFiber() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L2083)

```ts

    function commitMutationEffectsOnFiber(
      finishedWork: Fiber,
      root: FiberRoot,
      lanes: Lanes,
    ) {
      const current = finishedWork.alternate;
      const flags = finishedWork.flags;
    
      // The effect flag should be checked *after* we refine the type of fiber,
      // because the fiber tag is more specific. An exception is any flag related
      // to reconcilation, because those can be set on all fiber types.
    
      // 根据 tag 进入不同的处理函数
      switch (finishedWork.tag) {
        case FunctionComponent:
        case ForwardRef:
        case MemoComponent:
        case SimpleMemoComponent: {
          recursivelyTraverseMutationEffects(root, finishedWork, lanes);
          commitReconciliationEffects(finishedWork);
    
          // 处理 Update 副作用
          if (flags & Update) {
            try {
              // 执行 useEffect 卸载函数
              commitHookEffectListUnmount(
                HookInsertion | HookHasEffect,
                finishedWork,
                finishedWork.return,
              );
              // 执行 useEffect 挂载函数
              commitHookEffectListMount(
                HookInsertion | HookHasEffect,
                finishedWork,
              );
            } catch (error) {
              captureCommitPhaseError(finishedWork, finishedWork.return, error);
            }
            // Layout effects are destroyed during the mutation phase so that all
            // destroy functions for all fibers are called before any create functions.
            // This prevents sibling component effects from interfering with each other,
            // e.g. a destroy function in one component should never override a ref set
            // by a create function in another component during the same commit.
            // 执行依赖更新时的 useLayoutEffect 卸载函数
            if (
              enableProfilerTimer &&
              enableProfilerCommitHooks &&
              finishedWork.mode & ProfileMode
            ) {
              try {
                startLayoutEffectTimer();
                commitHookEffectListUnmount(
                  HookLayout | HookHasEffect,
                  finishedWork,
                  finishedWork.return,
                );
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
              recordLayoutEffectDuration(finishedWork);
            } else {
              try {
                commitHookEffectListUnmount(
                  HookLayout | HookHasEffect,
                  finishedWork,
                  finishedWork.return,
                );
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
          }
          return;
        }
        case ClassComponent: {
          recursivelyTraverseMutationEffects(root, finishedWork, lanes);
          commitReconciliationEffects(finishedWork);
    
          // 存在 Ref 副作用时，卸载 Ref
          if (flags & Ref) {
            if (current !== null) {
              safelyDetachRef(current, current.return);
            }
          }
          return;
        }
        case HostComponent: {
          recursivelyTraverseMutationEffects(root, finishedWork, lanes);
          commitReconciliationEffects(finishedWork);
    
          // 处理 Ref 副作用（卸载 Ref）
          if (flags & Ref) {
            if (current !== null) {
              safelyDetachRef(current, current.return);
            }
          }
          if (supportsMutation) {
            // TODO: ContentReset gets cleared by the children during the commit
            // phase. This is a refactor hazard because it means we must read
            // flags the flags after `commitReconciliationEffects` has already run;
            // the order matters. We should refactor so that ContentReset does not
            // rely on mutating the flag during commit. Like by setting a flag
            // during the render phase instead.
    
            // 处理 ContentReset 副作用（重置文本内容）
            if (finishedWork.flags & ContentReset) {
              const instance: Instance = finishedWork.stateNode;
              try {
                // 重置文本内容
                resetTextContent(instance);
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
    
            // 处理 Update 副作用（更新 DOM 节点）
            if (flags & Update) {
              const instance: Instance = finishedWork.stateNode;
              if (instance != null) {
                // Commit the work prepared earlier.
                const newProps = finishedWork.memoizedProps;
                // For hydration we reuse the update path but we treat the oldProps
                // as the newProps. The updatePayload will contain the real change in
                // this case.
                const oldProps =
                  current !== null ? current.memoizedProps : newProps;
                const type = finishedWork.type;
                // TODO: Type the updateQueue to be specific to host components.
                const updatePayload: null | UpdatePayload = (finishedWork.updateQueue: any);
                finishedWork.updateQueue = null;
                if (updatePayload !== null) {
                  try {
                    // 更新 DOM 节点
                    commitUpdate(
                      instance,
                      updatePayload,
                      type,
                      oldProps,
                      newProps,
                      finishedWork,
                    );
                  } catch (error) {
                    captureCommitPhaseError(
                      finishedWork,
                      finishedWork.return,
                      error,
                    );
                  }
                }
              }
            }
          }
          return;
        }
        case HostText: {
          recursivelyTraverseMutationEffects(root, finishedWork, lanes);
          commitReconciliationEffects(finishedWork);
    
          // 处理 Update 副作用（更新文本节点）
          if (flags & Update) {
            if (supportsMutation) {
              if (finishedWork.stateNode === null) {
                throw new Error(
                  'This should have a text node initialized. This error is likely ' +
                    'caused by a bug in React. Please file an issue.',
                );
              }
    
              const textInstance: TextInstance = finishedWork.stateNode;
              const newText: string = finishedWork.memoizedProps;
              // For hydration we reuse the update path but we treat the oldProps
              // as the newProps. The updatePayload will contain the real change in
              // this case.
              const oldText: string =
                current !== null ? current.memoizedProps : newText;
    
              try {
                // 更新文本节点
                commitTextUpdate(textInstance, oldText, newText);
              } catch (error) {
                captureCommitPhaseError(finishedWork, finishedWork.return, error);
              }
            }
          }
          return;
        }
        case HostRoot:
        case HostPortal:
        case SuspenseComponent:
        case OffscreenComponent:
        case SuspenseListComponent:
        case ScopeComponent:
        default: {
          recursivelyTraverseMutationEffects(root, finishedWork, lanes);
          commitReconciliationEffects(finishedWork);
          return;
        }
      }
    }

```

`recursivelyTraverseMutationEffects` [​](#recursivelytraversemutationeffects)
-----------------------------------------------------------------------------

`recursivelyTraverseMutationEffects` 函数递归遍历子 Fiber 树，并做如下操作：

*   调用 `commitDeletionEffects` 函数处理 **Deletion** 副作用（删除）
*   调用 `commitMutationEffectsOnFiber` 函数处理 **Mutation** 副作用（插入、更新、删除、Ref 等）

> 源码地址 [recursivelyTraverseMutationEffects() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L2052)

```ts

    function recursivelyTraverseMutationEffects(root: FiberRoot, parentFiber: Fiber, lanes: Lanes) {
      // Deletions effects can be scheduled on any fiber type. They need to happen
      // before the children effects hae fired.
      // 处理 Deletion 副作用（即 ChildDeletion）
      const deletions = parentFiber.deletions
      if (deletions !== null) {
        for (let i = 0; i < deletions.length; i++) {
          const childToDelete = deletions[i]
          try {
            commitDeletionEffects(root, parentFiber, childToDelete)
          } catch (error) {
            captureCommitPhaseError(childToDelete, parentFiber, error)
          }
        }
      }
    
      // 处理 Mutation 副作用（即 Placement | Update | ChildDeletion | ContentReset | Ref | Hydrating | Visibility）
      if (parentFiber.subtreeFlags & MutationMask) {
        let child = parentFiber.child
        while (child !== null) {
          commitMutationEffectsOnFiber(child, root, lanes)
          child = child.sibling
        }
      }
    }

```
### `commitDeletionEffects` [​](#commitdeletioneffects)

> 源码地址 [commitDeletionEffects() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L1608)

```ts

    function commitDeletionEffects(root: FiberRoot, returnFiber: Fiber, deletedFiber: Fiber) {
      if (supportsMutation) {
        // We only have the top Fiber that was deleted but we need to recurse down its
        // children to find all the terminal nodes.
    
        // Recursively delete all host nodes from the parent, detach refs, clean
        // up mounted layout effects, and call componentWillUnmount.
    
        // We only need to remove the topmost host child in each branch. But then we
        // still need to keep traversing to unmount effects, refs, and cWU. TODO: We
        // could split this into two separate traversals functions, where the second
        // one doesn't include any removeChild logic. This is maybe the same
        // function as "disappearLayoutEffects" (or whatever that turns into after
        // the layout phase is refactored to use recursion).
    
        // Before starting, find the nearest host parent on the stack so we know
        // which instance/container to remove the children from.
        // TODO: Instead of searching up the fiber return path on every deletion, we
        // can track the nearest host component on the JS stack as we traverse the
        // tree during the commit phase. This would make insertions faster, too.
        let parent = returnFiber
        // 标记父节点是否为容器
        findParent: while (parent !== null) {
          switch (parent.tag) {
            case HostComponent: {
              hostParent = parent.stateNode
              hostParentIsContainer = false
              break findParent
            }
            case HostRoot: {
              hostParent = parent.stateNode.containerInfo
              hostParentIsContainer = true
              break findParent
            }
            case HostPortal: {
              hostParent = parent.stateNode.containerInfo
              hostParentIsContainer = true
              break findParent
            }
          }
          parent = parent.return
        }
        if (hostParent === null) {
          throw new Error(
            'Expected to find a host parent. This error is likely caused by ' +
              'a bug in React. Please file an issue.'
          )
        }
        commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber)
        hostParent = null
        hostParentIsContainer = false
      } else {
        // Detach refs and call componentWillUnmount() on the whole subtree.
        commitDeletionEffectsOnFiber(root, returnFiber, deletedFiber)
      }
    
      detachFiberMutation(deletedFiber)
    }

``` 

### `commitDeletionEffectsOnFiber` [​](#commitdeletioneffectsonfiber)

> 源码地址 [commitDeletionEffectsOnFiber() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L1683)

```ts

    function commitDeletionEffectsOnFiber(
      finishedRoot: FiberRoot,
      nearestMountedAncestor: Fiber,
      deletedFiber: Fiber
    ) {
      // The cases in this outer switch modify the stack before they traverse
      // into their subtree. There are simpler cases in the inner switch
      // that don't modify the stack.
      switch (deletedFiber.tag) {
        case HostComponent: {
          if (!offscreenSubtreeWasHidden) {
            safelyDetachRef(deletedFiber, nearestMountedAncestor)
          }
          // Intentional fallthrough to next branch
        }
        // eslint-disable-next-line-no-fallthrough
        case HostText: {
          // We only need to remove the nearest host child. Set the host parent
          // to `null` on the stack to indicate that nested children don't
          // need to be removed.
          if (supportsMutation) {
            const prevHostParent = hostParent
            const prevHostParentIsContainer = hostParentIsContainer
            hostParent = null
            // 继续递归遍历执行 recursivelyTraverseDeletionEffects() 函数
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber)
            hostParent = prevHostParent
            hostParentIsContainer = prevHostParentIsContainer
    
            if (hostParent !== null) {
              // Now that all the child effects have unmounted, we can remove the
              // node from the tree.
              // 判断是否父节点是否为容器
              if (hostParentIsContainer) {
                // 从容器中删除子节点
                removeChildFromContainer(hostParent, deletedFiber.stateNode)
              } else {
                // 直接删除子节点
                removeChild(hostParent, deletedFiber.stateNode)
              }
            }
          } else {
            // 继续递归遍历执行 commitDeletionEffectsOnFiber() 函数
            recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber)
          }
          return
        }
    
        // ... 省略以下 case 的处理逻辑
        case DehydratedFragment:
        case HostPortal:
    
        // 函数组件
        case FunctionComponent:
        case ForwardRef:
        case MemoComponent:
        case SimpleMemoComponent: {
          if (!offscreenSubtreeWasHidden) {
            const updateQueue: FunctionComponentUpdateQueue | null = deletedFiber.updateQueue
            if (updateQueue !== null) {
              const lastEffect = updateQueue.lastEffect
              if (lastEffect !== null) {
                const firstEffect = lastEffect.next
    
                let effect = firstEffect
                do {
                  const { destroy, tag } = effect
                  // 判断是否存在 destroy 函数
                  if (destroy !== undefined) {
                    if ((tag & HookInsertion) !== NoHookEffect) {
                      // 执行组件的 useEffect 卸载函数
                      safelyCallDestroy(deletedFiber, nearestMountedAncestor, destroy)
                    } else if ((tag & HookLayout) !== NoHookEffect) {
                      if (enableSchedulingProfiler) {
                        markComponentLayoutEffectUnmountStarted(deletedFiber)
                      }
    
                      // 执行组件的 useLayoutEffect 卸载函数
                      if (
                        enableProfilerTimer &&
                        enableProfilerCommitHooks &&
                        deletedFiber.mode & ProfileMode
                      ) {
                        startLayoutEffectTimer()
                        safelyCallDestroy(deletedFiber, nearestMountedAncestor, destroy)
                        recordLayoutEffectDuration(deletedFiber)
                      } else {
                        safelyCallDestroy(deletedFiber, nearestMountedAncestor, destroy)
                      }
    
                      if (enableSchedulingProfiler) {
                        markComponentLayoutEffectUnmountStopped()
                      }
                    }
                  }
                  effect = effect.next
                } while (effect !== firstEffect)
              }
            }
          }
    
          // 继续递归遍历执行 commitDeletionEffectsOnFiber() 函数
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber)
          return
        }
        // 类组件
        case ClassComponent: {
          if (!offscreenSubtreeWasHidden) {
            // 卸载 Ref
            safelyDetachRef(deletedFiber, nearestMountedAncestor)
            const instance = deletedFiber.stateNode
            // 执行类组件的 componentWillUnmount 生命周期函数
            if (typeof instance.componentWillUnmount === 'function') {
              safelyCallComponentWillUnmount(deletedFiber, nearestMountedAncestor, instance)
            }
          }
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber)
          return
        }
    
        // ... 省略以下 case 的处理逻辑
        case ScopeComponent:
        case OffscreenComponent:
        default: {
          recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, deletedFiber)
          return
        }
      }
    }

```

### `recursivelyTraverseDeletionEffects` [​](#recursivelytraversedeletioneffects)

对子 Fiber 树进行遍历，并调用 `commitDeletionEffectsOnFiber` 函数处理 **Deletion** 副作用（删除）

> 源码地址 [recursivelyTraverseDeletionEffects() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L1670)

```ts

    function recursivelyTraverseDeletionEffects(finishedRoot, nearestMountedAncestor, parent) {
      let child = parent.child
      while (child !== null) {
        commitDeletionEffectsOnFiber(finishedRoot, nearestMountedAncestor, child)
        child = child.sibling
      }
    }

```
`commitReconciliationEffects` [​](#commitreconciliationeffects)
---------------------------------------------------------------

`commitReconciliationEffects` 函数用于处理 **Placement** 副作用（插入）

> 源码地址 [commitReconciliationEffects() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L2437)

```ts

    function commitReconciliationEffects(finishedWork: Fiber) {
      // Placement effects (insertions, reorders) can be scheduled on any fiber
      // type. They needs to happen after the children effects have fired, but
      // before the effects on this fiber have fired.
      const flags = finishedWork.flags
      // 判断是否存在 Placement 副作用
      if (flags & Placement) {
        try {
          commitPlacement(finishedWork)
        } catch (error) {
          captureCommitPhaseError(finishedWork, finishedWork.return, error)
        }
        // Clear the "placement" from effect tag so that we know that this is
        // inserted, before any life-cycles like componentDidMount gets called.
        // TODO: findDOMNode doesn't rely on this any more but isMounted does
        // and isMounted is deprecated anyway so we should be able to kill this.
        // 去除 flags 中 Placement 的标记
        finishedWork.flags &= ~Placement
      }
      if (flags & Hydrating) {
        finishedWork.flags &= ~Hydrating
      }
    }

```

### `commitPlacement` [​](#commitplacement)

> 源码地址 [commitPlacement() | react-reconciler/src/ReactFiberCommitWork.old.js](https://github.com/wild2life/code-analysis/blob/f0dc66687fe470217252ef38ae4f0697dc2fc15d/react-v18.2.0/src/react/packages/react-reconciler/src/ReactFiberCommitWork.old.js#L1498)

```ts

    function commitPlacement(finishedWork: Fiber): void {
      if (!supportsMutation) {
        return
      }
    
      // Recursively insert all host nodes into the parent.
      // 获取 tag 为 HostComponent、HostRoot、HostPortal 的父节点
      const parentFiber = getHostParentFiber(finishedWork)
    
      // Note: these two variables *must* always be updated together.
      // 判断父 Fiber 节点的 tag
      switch (parentFiber.tag) {
        // 普通 DOM 标签
        case HostComponent: {
          // 获取 DOM 节点
          const parent: Instance = parentFiber.stateNode
          // 当 flags 中存在 ContentReset 副作用时，重置父节点的文本内容
          if (parentFiber.flags & ContentReset) {
            // Reset the text content of the parent before doing any insertions
            resetTextContent(parent)
            // Clear ContentReset from the effect tag
            // 去除 flags 中 ContentReset 的标记
            parentFiber.flags &= ~ContentReset
          }
    
          // 获取当前 Fiber 节点的 DOM 兄弟节点
          const before = getHostSibling(finishedWork)
          // We only have the top Fiber that was inserted but we need to recurse down its
          // children to find all the terminal nodes.
          // 递归插入所有的子节点
          insertOrAppendPlacementNode(finishedWork, before, parent)
          break
        }
        // React 根节点
        case HostRoot:
        // React Portal 节点
        case HostPortal: {
          // 获取 DOM 节点
          const parent: Container = parentFiber.stateNode.containerInfo
          // 获取当前 Fiber 节点的 DOM 兄弟节点
          const before = getHostSibling(finishedWork)
          // 递归插入所有的子节点
          insertOrAppendPlacementNodeIntoContainer(finishedWork, before, parent)
          break
        }
        // eslint-disable-next-line-no-fallthrough
        default:
          throw new Error(
            'Invalid host parent fiber. This error is likely caused by a bug ' +
              'in React. Please file an issue.'
          )
      }
    }

```
