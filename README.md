# 项目描述

react全局状态管理器

无论是redux还是react-redux，或者其他人封装的库，使用都太繁琐了，也不好用

首先是基本的react，使用action，reducer，state，分开维护，然后用 subscribe监听。

react-redux，基于react进行封装，需要使用context和provide组件进行传store，然后组件导入在store定义的action，再用 useSelector 和 useDispatch 等api去获取值或者修改值。


这样子，使用太繁琐，也没必要，组件使用一个状态就要导入一堆的东西。


如果直接用useState和useContext hooks，会导致一个context一变，整个app都会渲染，连memo也无效，没必要。


为什么不学习pinia简单易用，直接用一个store就行，可以直接取值，可以直接调用action，可以监听，很完美。


这里的设计，只有用到store的组件，才会响应store的变化。

api的设置


````
defineStore 返回函数一个

组件导入 usexxx函数

然后 store = useXXX


可以从 const  {xxx, yyy} = store;

也可以 store.watch(xxxx, (oldValue, value) => {

})

````

难点：

不需要再app组件导入 context 的provide组件。

只需要在使用 store的 组件进行响应更新。

要记录当前的组件是哪一个让他强制 刷新
