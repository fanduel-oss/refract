# Core Concepts

Imagine data flowing through your app.

Props flow downwards, changing over time, and your app re-renders in response to each change. When a function prop is called, data leaps from a child component back to the parent which created the function.

Side-effects like calling APIs or saving to localStorage are like rocks obstructing this clean flow of data, making it less predictable and harder to understand. Why not remove these obstructions from the core data flow altogether, and handle them in a separate stream of logic?

Refract lets you observe the changing data as it passes through your components. You can watch a specific prop change over time, watch the values a function prop is called with, or watch an entire stream of props as if it were a single thread of data.

```js
const aperture = initialProps => component => {
    component.observe('prop')
}
```

Refract then lets you leverage the power of reactive programming to deal with these streams of changing data in a clear and expressive way, isolated from your React app.

Inside your `aperture`, you set up a pipeline through which your data will flow. This pipeline can be as simple or as complex as needed, but must output a single stream of data, known as `effect`s.

```js
const aperture = initialProps => component =>
    component.observe('username').filter(Boolean)
```

Finally, you will likely want to do something in response to the output of this data flow. Each `effect` output from the pipeline is passed into a `handler`, through which you can either perform side-effects or inject the result of the data flow back into your app.

```js
const handler = initialProps => effect => {
    if (effect.type === 'SET_STATE') {
        initialProps.setState(effect.payload)
    }
}
```

When you extract your side-effects from your app in this way, the internal code can remain pure, declarative, and easy to reason about.

By leveraging reactive programming to handle data flows, and by handling the pipelines' output in a clear and consistent location, your side-effects can also be written in declarative code which is easy to reason about.
