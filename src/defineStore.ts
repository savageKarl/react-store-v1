import { useEffect } from "react";

type Options = {
  state: {
    [key: string]: unknown;
  };
  actions: {
    [key: string]: () => unknown;
  };
};

// 返回一个自定义钩子
export function defineStore(options?: Options) {
  useEffect(() => {
    console.debug("订阅数据");
    return () => {
      console.debug("取消订阅");
    };
  }, []);

}
