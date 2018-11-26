<p align="center">
    <a href="#"><img src="https://raw.githubusercontent.com/fanduel-oss/refract/master/logo/refract-logo-colour.png" height="70" /></a>
</p><br/>

<p align="center">
    Harness the power of reactive programming<br/>
    to supercharge your components
</p>
<br/>

<p align="center">
    <a href="#why"><strong>Why?</strong></a> ·
    <a href="#installation"><strong>Install</strong></a> ·
    <a href="#the-gist"><strong>The gist</strong></a> ·
    <a href="#learn-refract"><strong>Learn</strong></a> ·
    <a href="#contributing"><strong>Contribute</strong></a> ·
    <a href="#discuss"><strong>Discuss</strong></a>
</p>
<br/>

<p align="center">
    <img src="https://img.shields.io/bundlephobia/minzip/LIBRARY_NAME.svg" alt="Library size">
    <img src="https://img.shields.io/npm/v/LIBRARY_NAME.svg?maxAge=3600&label=LIBRARY_NAME">
    <a href="https://opensource.org/licenses/MIT">
        <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License">
    </a>
</p>
<br/>

*   :bowling: **Decentralised**: attach effects and side-effects to your components, for better code splitting results
*   :sunrise: **Gradual**: use on an existing component today, throughout your app tomorrow
*   :rocket: **Reactive**: leverage the power and benefits of reactive programming
*   :floppy_disk: **Tiny**: less than 2Kb minified and gzipped
*   :pencil: **Typed**: written in TypeScript, fully typed integrations
*   :zap: **Universal**: supports React, React Native, Inferno and Preact

Refract lets you handle your component effects and side-effects, so that you can write your code in a clear, pure, and declarative fashion by using reactive programming.

Refract makes reactive programming possible in React, React Native, Preact and Inferno, with only a single higher-order component or a single hook! You can choose to start using a tiny bit of reactive programming, or go full reactive. Refract allows you to:

*   [Manage side effects](https://refract.js.org/) like API calls, analytics, logging, etc.
*   [Manipulate, replace and inject props](https://refract.js.org/usage/pushing-to-props), you can even [fully replace Redux `connect` HoC](https://refract.js.org/recipes/replacing-connect)
*   [Handle state](https://refract.js.org/recipes/handling-state)
*   [Render components](https://refract.js.org/usage/rendering-components)

We also provide a Redux integration, which can serve as a template for integrations with other libraries. With a single HoC, you can fully replace libraries like [recompose](https://github.com/acdlite/recompose), [redux-observable](https://redux-observable.js.org/), and [react-redux](https://github.com/reduxjs/react-redux) to name a few!

# Why?

Component-based architecture and functional programming have become an increasingly popular approach for building UIs. They help make apps more predictable, more testable, and more maintainable.

However, our apps don't exist in a vacuum! They need to handle state, make network requests, handle data persistence, log analytics, deal with changing time, and so on. Any non-trivial app has to handle any number of these effects. Wouldn't it be nice to cleanly separate them from our apps?

Refract solves this problem for you, by harnessing the power of reactive programming. [For an in-depth introduction, head to `Why Refract`.](./docs/introduction/why-refract.md)

# Installation

```
npm install --save LIBRARY_NAME
```

Refract is available for a number of reactive programming libraries. For each library, a Refract integration is available for React, Inferno, Preact and Redux.

Available packages:

<!-- prettier-ignore-start -->
| | [React](https://github.com/facebook/react) | [Inferno](https://infernojs.org/) | [Preact](https://preactjs.com/) | [Redux](https://github.com/reduxjs/redux) |
| --- | --- | --- | --- | --- |
| **[Callbag](https://github.com/callbag/callbag)** | refract-callbag | refract-inferno-callbag | refract-preact-callbag | refract-redux-callbag |
| **[Most](https://github.com/cujojs/most)** | refract-most | refract-inferno-most | refract-preact-most | refract-redux-most |
| **[RxJS](https://github.com/reactivex/rxjs)** | refract-rxjs | refract-inferno-rxjs | refract-preact-rxjs | refract-redux-rxjs |
| **[xstream](https://github.com/staltz/xstream)** | refract-xstream | refract-inferno-xstream | refract-preact-xstream | refract-redux-xstream |
<!-- prettier-ignore-end -->

# The Gist

The example below uses `refract-rxjs` to send data to localstorage.

Every time the `username` prop changes, its new value is sent into the stream. The stream debounces the input for two seconds, then maps it into an object (with a `type` of `localstorage`) under the key `value`. Each time an effect with the correct type is emitted from this pipeline, the handler calls `localstorage.setItem` with the effect's `name` and `value` properties.

```js
const aperture = component => {
    return component.observe('username').pipe(
        debounce(2000),
        map(username => ({
            type: 'localstorage',
            name: 'username',
            value: username
        }))
    )
}

const handler = initialProps => effect => {
    switch (effect.type) {
        case 'localstorage':
            localstorage.setItem(effect.name, effect.value)
            return
    }
}

const WrappedComponent = withEffects(aperture, { handler })(BaseComponent)
```

The example demonstrates uses the two building blocks used with Refract - an `aperture` and a `handler` - and shows how they can be integrated into a React component via the `withEffects` higher-order component.

### Aperture

An `aperture` controls the streams of data entering Refract. It is a function which observes data sources within your app, passes this data through any necessary logic flows, and outputs a stream of `effect` values in response.

### Handler

A `handler` is a function which causes side-effects in response to `effect` values.

# Learn Refract

## Documentation

Documentation is available at [refract.js.org](https://refract.js.org). We aim to provide a helpful and thorough documentation: all documentation files are located on this repo and we welcome any pull request helping us achieve that goal.

## Examples

We maintain and will grow over time a set of examples to illustrate the potential of Refract, as well as providing reactive programming examples: [refract.js.org/examples](https://refract.js.org/examples).

Examples are illustrative and not the idiomatic way to use Refract. Each example is available for the four reactive libraries we support (RxJS, xstream, Most and Callbag), and we provide links to run the code live on [codesandbox.io](https://codesandbox.io). All examples are hosted on this repo, and we welcome pull requests helping us maintaining them.

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
