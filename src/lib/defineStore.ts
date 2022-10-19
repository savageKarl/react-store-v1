import { useLayoutEffect, useReducer, useEffect } from "react";

import {
  installEventCenter,
  hasChanged,
  get,
  deepClone,
  isObject,
} from "@savage181855/utils";

type StateType = {
  [key: string]: any;
};

type Options = {
  state: StateType;
  actions?: {
    [key: string]: (...args: any) => unknown;
  };
  computed?: {
    [key: string]: (...args: any) => unknown;
  };
};

type ComputedDep = {
  [k: string]: {
    name: string; // 计算属性名字
    fn: () => unknown; // 计算属函数
  }[];
};

// 定义全局属性，用于向dep传送计算属性函数
var Dep: any = null;

// 返回一个自定义钩子
export function defineStore(options?: Options) {
  const eventCenter = installEventCenter({});

  let state = options?.state;

  let computed = options?.computed;

  // 创建一个响应式对象
  function createReactiveObject(target: any): any {
    const deps = {} as ComputedDep;
    const proxy = new Proxy(target, {
      get(target: any, key: any, receiver: any) {
        const res = Reflect.get(target, key, receiver);

        //  这里收集计算属性依赖
        if (Dep) deps[key]?.push(Dep) || (deps[key] = [Dep]);

        // 递归代理，因为proxy只能代理一层的数据
        if (isObject(res)) {
          return createReactiveObject(res);
        }
        return res;
      },
      set(target: any, key: any, value: any, receiver: any) {
        // 这里先用深克隆吧，原因是state是引用类型，大量数据可能会有性能问题
        const oldState = deepClone(state!);
        const result = Reflect.set(target, key, value, receiver);

        // 发布消息让计算属性更新
        deps[key]?.forEach((item) => {
          // 更新计算属性的值
          for (let k in computed) {
            computed[k] = item.fn() as any;
          }
          //  刷新使用计算属性的组件
          eventCenter.subscribeList[item.name].forEach((fn) => fn());
        });

        // console.debug(eventCenter.subscribeList)
        // 发布消息让组件渲染或者监听器执行
        Reflect.ownKeys(eventCenter.subscribeList).forEach((k) => {
          const oldValue = get(oldState, k as string);
          const value = get(state!, k as string);

          if (hasChanged(oldValue, value)) {
            eventCenter.subscribeList[k as string].forEach((fn) =>
              fn(oldValue, value)
            );
          }
        });
        return result;
      },
    });
    return proxy;
  }

  // 设置 state proxy，发布消息
  if (state) {
    state = createReactiveObject(state);
  }

  if (computed) {
    for (let k in computed) {
      computed[k] = computed[k].bind(computed, state);
      Dep = { name: k, fn: computed[k] };
      //  先执行一下自己，state的属性才能收集自己作为依赖，然后再把自己变成返回的值，这样子，用户在导出计算属性就不用调用函数
      computed[k] = computed[k]() as any;
      Dep = null;
    }
  }

  // 给 actions里面的每一个函数自动注入 state参数
  let actions = options?.actions;
  if (actions) {
    for (let k in actions) {
      actions[k] = actions[k].bind(actions, state);
    }
  }

  const store = {
    /** 选择 state 和 actions 的 hooks */
    usePicker(seleted: string[]) {
      // 状态改变刷新组件
      const [, forceUpdate] = useReducer((c) => c + 1, 0);

      const dataCallbacks = {} as any;

      useLayoutEffect(() => {
        Reflect.ownKeys({ ...state, ...computed })
          .filter((key) => seleted.includes(key as string))
          .forEach((key) => {
            dataCallbacks[key] = function () {
              // console.debug("强制刷新");
              forceUpdate();
            };
            eventCenter.subscribe(key as any, dataCallbacks[key]);
          });

        return () => {
          Reflect.ownKeys(dataCallbacks).forEach((k) =>
            eventCenter.remove(k as any, dataCallbacks[k])
          );
          // console.debug("取消订阅");
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const value = { ...state, ...actions, ...computed };
      // console.debug("value", value, options?.state, { ...options?.state });

      // 返回用户选择的 state 和 actions
      return Reflect.ownKeys(value)
        .filter((item) => seleted.includes(item as string))
        .reduce((x, y) => {
          x[y] = value[y as string];
          return x;
        }, {} as any);
    },
    /** 修改 state */
    patch(val: Object | Function) {
      if (typeof val === "object") {
        for (let k in val) {
          state![k] = (val as any)[k];
        }
      }

      if (typeof val === "function") {
        val(state);
      }
    },
    /** 监听 state里面的值 */
    useWatcher(key: string, fn: (oldVlaue: any, value: any) => unknown) {
      useEffect(() => {
        eventCenter.subscribe(key, fn);
        return () => {
          eventCenter.remove(key, fn as any);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
    },
  };

  return function () {
    return store;
  };
}

/*
  api的设计，defineStore 定义返回一个 hooks，hooks执行返回 store


  store 的属性，state和actions的定义都会代理到 store上面。

  store.usePicker() 选择state和actions
  store.patch((state)=>{})
  // 监听state的值
  store.useWatcher('xxx,xxx', (oldValue, value) =>{})
  
 */
