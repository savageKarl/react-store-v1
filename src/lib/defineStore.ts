import { useLayoutEffect, useState, useReducer } from "react";

import {
  installEventCenter,
  isObject,
  hasChanged,
  get,
  deepClone,
} from "@savage181855/utils";

type StateType = {
  [key: string]: any;
};

type Options = {
  state: StateType;
  actions?: {
    [key: string]: (...args: any) => unknown;
  };
};

// 返回一个自定义钩子
export function defineStore(options?: Options) {
  const eventCenter = installEventCenter({});

  let state = options?.state;
  // 设置 proxy，发布消息
  if (state) {
    state = new Proxy(state, {
      set(target, key, value, receiver) {
        // console.debug("fuck");
        // 这里先用深克隆吧，原因是state是引用类型，大量数据可能会有性能问题
        const oldState = deepClone(state!);
        const result = Reflect.set(target, key, value, receiver);

        // console.debug(eventCenter.subscribeList)
        Reflect.ownKeys(eventCenter.subscribeList).forEach((key) => {
          const oldValue = get(oldState, key as string);
          const value = get(state!, key as string);

          if (hasChanged(oldValue, value)) {
            eventCenter.subscribeList[key as string].forEach((fn) =>
              fn(oldValue, value)
            );
          }
        });
        return result;
      },
    });
  }

  // 给 actions里面的每一个函数自动注入 state参数
  if (options?.actions) {
    for (let k in options?.actions) {
      options.actions[k] = options?.actions[k].bind(options, state);
    }
  }

  // 设置 proxy，发布消息
  const store = {
    /** 选择 state 和 actions 的 hooks */
    usePicker(seleted: string[]) {
      // 状态改变刷新组件
      const [, forceUpdate] = useReducer((c) => c + 1, 0);

      const dataCallbacks = {} as any;

      useLayoutEffect(() => {
        Reflect.ownKeys(options?.state!)
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
      });

      const value = { ...state, ...options?.actions };
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


  store.watch('xxx,xxx', (oldValue, value) =>{})

  
  现在主要的难题是 如何收集依赖，将当前的组件和使用到 store.xxxx绑定在一起

  
 */
