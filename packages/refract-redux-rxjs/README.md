<p align="center">
    <a href="#"><img src="../../logo/refract-logo-colour.png" height="70" /></a>
</p><br/>

<p align="center">
    Master your React and Redux app's effects through the<br/>
    power of reactive programming.
</p>
<br/>

<p align="center">
    <a href="#why"><strong>Why?</strong></a> ·
    <a href="#installation"><strong>Install</strong></a> ·
    <a href="#the-gist"><strong>The gist</strong></a> ·
    <a href="#documentation"><strong>Learn</strong></a> ·
    <a href="#contributing"><strong>Contribute</strong></a> ·
    <a href="#discuss"><strong>Discuss</strong></a>
</p>
<br/>

<p align="center">
    <img src="https://img.shields.io/bundlephobia/minzip/refract-redux-rxjs.svg" alt="Library size">
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License">
    </a>
</p>
<br/>

Refract lets you isolate your app's side effects - API calls, analytics, logging, etc - so that you can write your code in a clear, pure, and declarative fashion by using reactive programming.

Refract is an extensible library built for React. In addition we provide a Redux integration, which can also serve as a template for integrations with other libraries.

# Why?

Component-based architecture and functional programming have become an increasingly popular approach for building UIs. They help make apps more predictable, more testable, and more maintainable.

However, our apps don't exist in a vacuum! They need to make network requests, handle data persistence, log analytics, deal with changing time, and so on. Any non-trivial app has to handle any number of these external effects.

These side-effects hold us back from writing fully declarative code. Wouldn't it be nice to cleanly separate them from our apps?

Refract solves this problem for you. [For an in-depth introduction, head to `Why Refract`.](../../docs/introduction/why-refract.md)

# Installation

```
npm install --save refract-redux-rxjs
```

Refract is available for a number of reactive programming libraries. For each library, a Refract integration is available for both React and Redux.

Available packages:

<!-- prettier-ignore-start -->
| | [React](https://github.com/facebook/react) | [Redux](https://github.com/reduxjs/redux) |
| --- | --- | --- |
| **[Callbag](https://github.com/callbag/callbag)** | refract-callbag | refract-redux-callbag |
| **[Most](https://github.com/cujojs/most)** | refract-most | refract-redux-most |
| **[RxJS](https://github.com/reactivex/rxjs)** | refract-rxjs | refract-redux-rxjs |
| **[xstream](https://github.com/staltz/xstream)** | refract-xstream | refract-redux-xstream |
<!-- prettier-ignore-end -->

# The Gist

```js
import { compose, createStore } from 'redux'
import { refractEnhancer } from 'refract-redux-rxjs'

const reducers = combineReducers({
    username: (state, action) => {
        if (action.type === 'USERNAME') {
            return action.payload
        }

        return state
    }
})
const store = createStore(reducers, {}, compose(refractEnhancer()))

const usernameActions$ = store.observe('USERNAME')
const username$ = store.observe(state => state.username)
```

### Store enhancer

The Refract store enhancer adds an `observe` method which takes a single argument (action type or store selector) and returns an observable. Read [observing redux](../../docs/usage/observing-redux) for more details.

# Documentation

_Links through to docs sub-pages._

# Examples

# Contributing

We welcome many forms of contribution from anyone who wishes to get involved.

Before getting started, please read through our [contributing guidelines](../../CONTRIBUTING.md) and [code of conduct](../../CODE_OF_CONDUCT.md).

# Links

### Logo

[The Refract logo is available in the Logo directory](../../logo/).

### License

[Refract is available under the MIT license.](../../LICENSE)

### Discuss

[Everyone is welcome to join our discussion channel - `#refract` on the Reactiflux Discord server.](https://discord.gg/fqk86GH)
