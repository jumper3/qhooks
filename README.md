# qhooks

> 基于hooks的状态管理工具

特点一览
- 原生hooks写法，易于学习和优化
- 兼容class组件
- 占用空间小, 0依赖


### 安装

```bash
npm i qhooks
# 或
yarn add qhooks

```


### 1. 基本使用
一个计数器的例子

```javascript
import React, { useState } from "react"
import { createStore } from "qhooks"
import { render } from "react-dom"

// 要创建的store就是一个自定义hooks
function useCounter() {
    const [cnt, setCnt] = useState(0);
    const decrement = () => setCnt(cnt - 1);
    const increment = () => setCnt(cnt + 1);

    return {
        cnt,
        decrement,
        increment
    };
}

// 调用createStore方法，导出用于传递数据的Provider
// 并默认导出store用于组件内部调用
const { Provider: CounterProvider, useStore: useCounter } = createStore(useCounter);

function App() {
  return (
    // 需要用到store的组件用provider包裹即可
    <CounterProvider>
      {/* ...other components */}
    
      <Counter />
    </CounterProvider>
  )
}

function Counter() {
  let counter = useCounter();
  return (
    <div>
      <button onClick={counter.decrement}>-</button>
      <span>{counter.count}</span>
      <button onClick={counter.increment}>+</button>
    </div>
  )
}

render(<App />, document.getElementById("app"))

```


### 2. 进阶使用

#### 2.1 拆分store

如果维护单个store过大，需要拆分，或需要引用当前store中的部分数据，则可以在其他hooks内部引用已有store。

```javascript
import useProduct from "./product";

// 副store示例
function usePrice() {
    const { products } = useProduct();

    return {
        totalPrice: products.reduce((prev, curr) => prev + parseFloat(curr.salePrice), 0)
    }
}
// 注意，这里导出已经不需要再进行包装
export default usePrice;

```


*注意*

1.小心循环store依赖

2.由于store已经是一个自定义hook，因此其他hook在引用该store后导出时，不用再通过`createStore`包裹


#### 2.2 组合Store
如果习惯于使用单中心store，`createStore`也支持将多个store进行组合。组合形式即将多个store以对象形式传入`createStore`方法中，例子如下：

```javascript
...
import { createStore } from "qhooks"

const { Provider, useStore } = createStore({
    banner,
    scroller,
    pageData,
    productList,
    shoppingCart
});
...

```

这样，我们得到的useStore方法可以同时取到多个store中的内容，如

```javascript
...

function App() {
    const { pageData, productList } = useStore();

    ...
}
...

```


*注意*

由于过大的store可能会导致[性能问题](https://github.com/facebook/react/issues/15156#issuecomment-474590693)，因此建议在组合时给`useStore`传入`selector`方法订阅状态的具体属性，这样会使大型状态树的页面渲染性能有明显的提升，具体的`selector`使用方法参考3.2章节



#### 2.3 兼容class组件
虽然 store 是使用的 Hooks 语法，但你仍然可以在class组件中获取store
使用`withStore`方法包裹class组件，并传入所需要的store和mapStoreToProps方法

```javascript
import React, { Component } from 'react'
import { withStore } from 'qhooks';
import Counter from '../../stores/product';

class Footer extends Component {
    ...
    render() {
        const { count, add } = this.props;
    }
}

function mapStoreToProps(Counter) {
    return {
        count: Counter.cnt,
        add: Counter.increment
    }
}

export default withStore(Product, mapStoreToProps)(Footer);

```

也可以以Array格式传入多个store,对应`mapStoreToProps`方法的参数格式也是Array

```javascript
import React, { Component } from 'react'
import { withStore } from 'qhooks';
import Counter from '../../stores/product';
import Product from '../../stores/product';

class Footer extends Component {
    ...
}

export default withStore([Product, Counter], ([Product, Counter]) => ({
    ...Product,
    ...Counter
}))(Footer);

```

#### 2.4 初始值
如果希望在store初始化的时候拥有初始值，只需在在导出的Priover的props中传入initialState，并在自定义store的第一个参数中取得对应的initialState
```javascript

// 自定义store中的第一个参数用于接收initialState
function useCounter(initialState) {
    const [cnt, setCnt] = useState(initialState || 0);
    ...
}

...

<CounterProvider initialState={2}>
    {/* ...other components */}
    <Counter />
</CounterProvider>

...

```



### 3. 性能优化

由于store的实现是原生hooks,因此优化也是基于原生hooks的优化

#### 3.1 优化耗时操作

```javascript
import { useState, useEffect, useMemo } from "react";
import { createStore } from "qhooks";

function useProducts() {
    const [products, setProduct] = useState([]);
    ...
    // 耗费性能的值用useMemo包装，避免不必要的计算
    const productSortedByPrice = useMemo(
        () =>
            products
                .concat()
                .sort((a, b) => (a.salePrice > b.salePrice ? 1 : -1)),
        [products]
    );
    ...
}

```

#### 3.2 针对大store的优化
如果状态树很大的情况下（通常是组合多个store），一旦状态频繁的状态更新，会使页面触发不必要的re-render。所以我们为了准确订阅组件内需要用到的属性，可以向`useStore`中传入`selector`方法，去手动提取组件真正用到的属性，这样可以精准的控制渲染。

示例如下：
```javascript
...

function ProductTab() {
    const { productTagVOS, productListStore, scrollY } = useStore((state) => ({
        productTagInfo: state.pageData.productTagInfo,
        productListStore: state.productList,
        scrollY: state.scroller.scrollY
    }));

    ...
}
...

```

*注意*

尽量避免在组件中同时使用props模式和`selector`取同一份数据，这样两份数据可能会有短时间的状态不一致。
