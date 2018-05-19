# Why Refract?

Refract allows you to manage your side-effects declaratively in React, using the power of reactive programming.


## Imperative side-effects

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

However, the loop above doesn't exist in a vacuum! Various external effects compose the business logic of an app: network requests, time, data persistence, analytics, etc. State mutations (`setState`, reducers), state getters and render functions are in principle always pure. As a result, interaction handlers such as `onClick` or lifecycle methods such as `componentDidMount` handle side-effects in an imperative way.

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

The side-effects of persisting the filter value and firing an analytics event are imperative: they are concerned with the "what" as well as the "how". Every application will have to write code in an imperative way, but it's best for that code to be isolated and as high as possible in your stack.


## Separation of concerns

Ideally, we want to separate the main action of our code (setting a filter) from the resulting actions (storage, analytics): our application should be able to function without them.


## Reactive programming

The key to declarative side-effects is observability. First, you need to be able to observe changes in your app in order to trigger side-effects. And then you need your side-effect instructions to be observed.
