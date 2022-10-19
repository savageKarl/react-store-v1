# 项目描述

> 简单、优雅的`React`全局状态管理器

- **轻量**
- **简单**
- **高性能**
- **灵活**

## 安装

```
npm install @savage181855/react-store
```

##  兼容性

项目使用了ES6的`proxy`，仅支持主流浏览器，查看[详情](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy#%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%BC%E5%AE%B9%E6%80%A7)。

## 快速使用

定义个`useStore`hook 并导出
```javascript
import { defineStore } from "../lib/index";

export const useStore = defineStore({
  state: {
    count: 10,
    name: "savage",
  },
  actions: {
    // 会自动传入 state
    increment(state, payload) {
      state.count += 1;
    },
    changeName(state) {
      state.name = "foo";
    },
  },
  computed: {
    dbCount(state) {
      return state.count * 2;
    }
  }
});

```




## 本地开发调试太烦了，

示例和库分开放用 npm link 连接，还有库只能装 react 的类型提示，不能装 react，否则示例就会报错，两个 react 依赖。

示例和库分开，库改动的代码，示例的声明文件解析跟不上，每次都要重新运行 start 脚本，要不然报错。

最后一种办法，把库和示例放在同一个项目里面。

然后直接本地跑示例。
