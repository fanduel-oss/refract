# Core Concepts

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

## Separation of concerns

Refract allows you to cleanly separate concerns in your app: you can extract effects and side-effects into their own functions. We tend to distinguish side-effects (things happening outside your application: analytics, data persistance, ...) from effects (things happening inside your application: network requests, setting state, ...).

### Side-effects

Your application should be able to function with or without its side-effects: for instance, how many times have you experienced a website not working? Only to realise that your ad blocker had blocked a third party script, causing a missing analytic function to crash the whole app!

With Refract, you can wrap side-effects around your container components, and ensure that your application works with or without them.

### Effects

For effects, your application shouldn't be able to function without them. For instance, you can look at the [typeahead example](../../examples/typeahead/README.md): without input debouncing and network requests, the input component would lose its main functionality.

In the case of effects, Refract helps you separate them into different logical units, increasing maintainability of your apps and promoting code re-use. Read [Thinking in Refract](./thinking-in-refract.md) for a more detailed explanation.

## Paradigms

Refract makes use of functional and reactive principles to manage effects and side-effects. Reactive programming especially is extremely powerful in its ability to chain time-based operations without breaking a sweat: Refract offers a great way to gradually use it in component-based applications (React, Inferno and Preact).

### Functional and declarative

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

const imperativeSideEffectHandler = effect => {
    if (effect.type === 'localStorage') {
        window.localStorage.setItem(name, value)
    }
}
```

`declarativeStorageSideEffect` is pure while `imperativeSideEffectHandler` is not. Every application will have imperative and impure code: `declarativeStorageSideEffect` can't exist without `imperativeStorageSideEffect`. But it is best for imperative code to be isolated and as high as possible in your application.

Declarative side-effects have two main benefits:

*   easier to test (pure functions)
*   only one place is concerned with the "how" (imperative code)

### Reactive

The key to reactive programming is observability: we need to be able to observe changes in your app, get notified when they happen so we can trigger side-effects. Reactive programming works really well for side-effects: side-effects are just data. It is also a remarkable abstraction encouraging declarative programming and which can concisely express time-based operations (throttle, debounce, etc.).

We have seen a lot of side-effect management libraries in Redux, due to the observability of its actions (with middleware). It is entirely possible to move side-effects handling to React, and to not have to rely on Redux.

To see how Refact compares to other side-effects libraries, check our [comparison guide](./alternatives.md). To see Refract usage, head to [using Refract](../usage/getting-started.md).
