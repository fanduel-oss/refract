# Why Refract?

Refract is a functional and reactive programming solution (F&RP). It allows you to manage your side-effects declaratively in React, using the power of reactive programming.

With functional programming and components becoming an increasingly popular option for building UIs, we've become used to unidirectional data flows, view / state separation and immutable data.

```
               +------------+
         +----->   State    +-----+
         |     +------------+     |
Setter / |                        | Getter /
Action   |                        | Selector
         |     +------------+     |
         +-----+    View    <-----+
               +------------+
```

However, the loop above doesn't exist in a vacuum! Various external effects compose the business logic of an app: network requests, time, data persistence, analytics, etc. State mutations (`setState`, reducers), state getters and render functions are in principle always pure. As a result, interaction handlers such as `onClick` or lifecycle methods such as `componentDidMount` handle side-effects imperatively.


## Functional and declarative

Perhaps this is familiar:

```js
const setFilter = (name, value) => {
    setState({
        [name]: value
    })

    window.localStorage.setItem(name, value)
    myAnalyticsProvider.logEvent('FilterChange', {
        [name]: value
    })
}
```

The side-effects of persisting the filter value and firing an analytics event are imperative: they are concerned with the "what" as well as the "how".

```js
const declarativeStorageSideEffect = (name, value) => ({
    type: 'localStorage',
    name,
    value
})

const imperativeSideEffectHandler = (effect) => {
    if (effect.type === 'localStorage') {
        window.localStorage.setItem(name, value)
    }
}
```

`declarativeStorageSideEffect` is pure while `imperactiveSideEffectHandler` is not. Every application will have imperative and impure code: `declarativeStorageSideEffect` can't exist whithout `imperativeStorageSideEffect`. But it is best for imperative code to be isolated and as high as possible in your application.

Declarative side-effects have two main benefits:
- easier to test (pure functions)
- only one place is concerned with the "how" (imperative code)


## Reactive

We want to separate the main action of our code (setting a filter) from the resulting actions (storage, analytics): our application should be able to function without them, or if they fail. Have you ever had a bad experience on the web, a form you try to submit but nothing happens? Only to realise when you open the console that something is failing due to your ad blocker? This is terrible!

The key to reactive programming is observability: we need to be able to observe changes in your app, get notified when they happen so we can trigger side-effects. Reactive programming works really well for side-effects: effects are just data. It is also a remarkable abstraction encouraging declarative programming and which can concisely express time-based operations (throttle, debounce, etc.).

We have seen a lot of side-effect management libraries in redux, due to the observability of its actions (with middleware). It is entirely possible to move side-effects handling to React, and to not have to rely on redux.

Too see how Refact compares to other side-effects libraries, check our [comparison guide](./comparison.md). Too see Refract usage, head to [using Refract](./usage.md).
