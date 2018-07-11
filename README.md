![Refract](logo/refract-logo-colour.png)

### Master your app's effects through the power of reactive programming

Refract lets you isolate your app's side effects - API calls, analytics, logging, etc - so that you can write your code in a clear, pure, and declarative fashion by using reactive programming.

Refract is an extensible library built for React. In addition we provide a Redux integration, which can also serve as a template for integrations with other libraries.

# Why?

Component-based architecture and functional programming have become an increasingly popular approach for building UIs. They help make apps more predictable, more testable, and more maintainable.

However, our apps don't exist in a vacuum! They need to make network requests, handle data persistence, log analytics, deal with changing time, and so on. Any non-trivial app has to handle any number of these external effects.

These side-effects hold us back from writing fully declarative code. Wouldn't it be nice to cleanly separate them from our apps?

Refract solves this problem for you. [For an in-depth introduction, head to `Why Refract`.](./docs/introduction/why-refract.md)

# Installation

Refract is available for a number of reactive programming libraries. For each library, a Refract integration is available for both React and Redux.

Available packages:

| | [React](https://github.com/facebook/react) | [Redux](https://github.com/reduxjs/redux) |
| --- | --- | --- |
| **[Callbag](https://github.com/callbag/callbag)** | refract-callbag | refract-redux-callbag |
| **[Most](https://github.com/cujojs/most)** | refract-most | refract-redux-most |
| **[RxJS](https://github.com/reactivex/rxjs)** | refract-rxjs | refract-redux-rxjs |
| **[xstream](https://github.com/staltz/xstream)** | refract-xstream | refract-redux-xstream |

To use the latest stable version, simply `npm install` the package you want to use:

```
npm install --save refract-rxjs
```

# The Gist

The example below uses `refract-rxjs` to send data to localstorage.

Every time the `username` prop changes, its new value is sent into the stream. The stream debounces the input for two seconds, then maps it into an object (with a `type` of `localstorage`) under the key `payload`. Each time an effect is emitted from this pipeline, the handler calls `localstorage.setItem` with the effect's `payload` property.

```js
const aperture = (initialProps) => (component) => {
    return component.observe('username').pipe(
        debounce(2000),
        map(username => ({
            type: 'localstorage',
            name: 'username',
            value: username
        }))
    )
}

const handler = (initialProps) => (effect) => {
    switch (effect.type) {
        case 'localstorage':
            localstorage.setItem(effect.name, effect.value)
            return
    }
}

const WrappedComponent = withEffects(handler)(aperture)(BaseComponent)
```

### Aperture

An `aperture` controls the streams of data entering Refract. It is a function which observes data sources within your app, passes this data through any necessary logic flows, and outputs a stream of `effect`s.

Signature: `(initialProps) => (component) => { return effectStream }`.
* The `initialProps` are all props passed into the `WrappedComponent`.
* The `component` is an object containing a number of event sources that you can observe.
* Within the body of the function, you observe the event source you choose, pipe the events through your stream library of choice, and return a single stream of effects.

### Handler

A `handler` is a function which causes side-effects in response to any `effect` object output by the `aperture`.

Signature: `(initialProps) => (effect) => { /* handle effects here */ }`.
* The `initialProps` are all props passed into the `WrappedComponent`.
* The `effect` is each event emitted by your `aperture`.
* Within the body of the function, you call any side-effects imperatively.

### withEffects

The `withEffects` higher-order component implements your side-effect logic as a React component.

Signature: `(handler) => (aperture) => (Component) => { return WrappedComponent }`
* The hoc takes in three curried arguments:
    * A `handler` function
    * An `aperture` function
    * A React `Component`
* The hoc returns a `WrappedComponent` - an enhanced version of your original `Component` which includes your side-effect logic.

# Learn Refract

*Links through to tutorial.*

# Documentation

*Links through to docs sub-pages.*

# Examples

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

[Everyone is welcome to join our discussion channel - `#refract` on the Reactiflux Discord server.](https://discord.gg/fqk86GH)

### Articles

- [The introduction to Reactive Programming you've been missing
](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754) by [@andrestaltz](https://twitter.com/andrestaltz)
