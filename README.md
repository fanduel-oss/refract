![Refract](logo/refract-logo-colour.png)

### Master your app's side-effects in React through the power of reactive programming.

Observe any producer, cause any effect. Refract lets you observe anything within your app - changes to props, data passed to callbacks, dispatched redux actions, updated redux state, window event listeners, and much more. Using your chosen stream library, you react to the streams of events, and produce any effect you choose.


# Why?

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

Refract sits between your state and your view. It allows you to leverage the power of reactive programming to handle side-effects declaratively. For a more in-depth introduction, head to [why Refract?](./docs/introduction/why.md). To check how Refract compares to solutions like redux-saga or redux-observable, read our [comparison guide](./docs/introduction/comparison.md).


# Packages

Refract is available for a number of stream libraries. For each stream library, a Refract integration is available for both React and Redux.

Available packages:

| | [React](https://github.com/facebook/react) | [Redux](https://github.com/reduxjs/redux) |
| --- | --- | --- |
| **[Callbag](https://github.com/callbag/callbag)** | refract-callbag | refract-redux-callbag |
| **[Most](https://github.com/cujojs/most)** | refract-most | refract-redux-most |
| **[RxJS](https://github.com/reactivex/rxjs)** | refract-rxjs | refract-redux-rxjs |
| **[xstream](https://github.com/staltz/xstream)** | refract-xstream | refract-redux-xstream |

# The Gist - Usage With React

The example below uses `refract-most` to implement a debounced fetch request based on the component's props.

Every time the `username` prop changes, its new value is sent to the observer. The observer debounces the stream of values before sending a request to the GitHub API, then waits until the request is resolved. Each time a request resolves, the handler calls `setState` with the effect's value. [A fully-functional demo of this example in each streaming library is available here.]()

Events are observed by an `effectFactory`, which outputs a stream of effects.

The effect stream is observed by an `effectHandler`, which causes side-effects in response to each effect.

These two functions are consumed by a `withEffects` hoc, which implements your side-effect logic as a React component.

```js
const effectFactory = (initialProps) => (component) => {
  return component.observe('username')
    .debounce(250)
    .flatMap(username =>
      fromPromise(fetch(`https://api.github.com/users/${username}`))
    )
    .map(response => response.json())
    .awaitPromises()
}

const effectHandler = (initialProps) => (event) => {
  initialProps.setState({ data: event })
}

const WrappedComponent = withEffects(effectHandler)(effectFactory)(Component)
```

### effectFactory

An `effectFactory` is a function with the signature `(initialProps) => (component) => { return effectStream }`.

The `initialProps` are props passed in to the `withEffects` hoc. The `component` is an object containing a number of event sources you can observe. Within the body of the function, you observe the event source you choose, pipe the events through your stream library of choice, and return a single stream of effects.

### effectHandler

An `effectHandler` is a function with the signature `(initialProps) => (effect) => { /* handle effects here */ }`.

The `initialProps` are props passed into the `withEffects` hoc. The `effect` is each event emitted by your `effectFactory`.

*Note that in the example above, `setState` is a prop passed into the `WrappedComponent` by its parent - `<WrappedComponent setState={setState} username={username} />`.*

### withEffects

The `withEffects` hoc expects an `effectHandler`, an `effectFactory`, and a `Component`, and returns a new component which implements your side-effect handling logic.

# Installation

To use the latest stable version, simply `npm install` the package you want to use:

```
npm install --save refract-rxjs
```

# Documentation

*Links through to docs sub-pages.*

# Contributions

### Guidelines

*Brief description and link through to full guidelines.*

### Contributors

*Links to contributors.*

# Links

### Logo

[The Refract logo is available in the Logo directory](/logo/).

### License

[Refract is available under the X license.]()

### Discuss

[Everyone is welcome to join our discussion channel - `#refract` on the Reactiflux Discord server.]()

### Articles

- [The introduction to Reactive Programming you've been missing
](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) by [@andrestaltz](https://twitter.com/andrestaltz)
