<!-- prettier-ignore-start -->
# Changelog

## 28 November 2018

| Packages | Version | Changes |
| --- | --- | --- |
| React / Inferno / Preact | 4.0.0 | :rocket: `component.useEvent` and `component.pushEvent` are now better typed to valueless events and observables [(#130)](https://github.com/fanduel-oss/refract/pull/130)<br>:bug: `component.useEvent` now makes the distinction between a seed value of `undefined` and no seed value<br>:rocket: a new `decorateProps` config option has been added to `withEffects`, so prop decoration can be turned off (default to `true`: decoration is on) [(#131)](https://github.com/fanduel-oss/refract/pull/131)
:rocket:  |

#### Breaking changes (TypeScript users only)

`pushEvent` has changed signature: when not valueless, it is now `<T>(eventName: string) => (val: T) => void` instead of `(eventName: string) => <T>(val: T) => void`.

## 27 November 2018

| Packages | Version | Changes |
| --- | --- | --- |
| React / Inferno / Preact | 3.1.0 | :rocket: Add new config option `mergeProps` to `withEffects`: when set to true, props passed with `toProps` or `asProps` will be merged with previoiusly received ones [(#129)](https://github.com/fanduel-oss/refract/pull/129) |

## 26 November 2018

| Packages | Version | Changes |
| --- | --- | --- |
| React / Inferno / Preact | 3.0.0 | :rocket: **BREAKING CHANGES**: we've simplified Refract API, to allow for `handler` to be optional [(#124)](https://github.com/fanduel-oss/refract/pull/124)<br>:fire: React packages now have a `useRefract` hook [(#123)](https://github.com/fanduel-oss/refract/pull/123) |

#### API simplification (BREAKING CHANGES)

`withEffects` and `aperture` have now a simplified "flattened" API. `handler`, `errorHandler` and `Context` are entirely optional in `withEffects` (note that `Context` is only for React 16.6.0 and above). In addition `aperture` is now a simple function:

```js
const aperture = (component, initialProps, initialContext) => {
    /** Return a stream **/
}

const MyContainerComponent = withEffects(
    aperture,
    { hander, errorHander, Context }
)(MyBaseComponent)
```

#### Hook

In addition, a `useRefract` hook has been introduced. It is very similar to `withEffects`:
- Instead of observing `props`, it can observe `data` passed to it. `data` can be anything: props, context, state.
- `useRefract` doesn't have the ability to observe functions being called
- It has only one built-in effect called `toRender`, which enables to return data to your component

```js
const aperture = (component, initialData) => {
    /** Return a stream **/
}

function MyComponent(props) {
    const context = useContext(MyContext)
    const data = {
        ...props,
        ...context
    }
    const returnedData = useRefract(aperture, data)
}
```


## 30 October 2018

| Packages | Version | Changes |
| --- | --- | --- |
| Callbag | 2.2.2 | :bug: fix `useEvent` when providing a seed value and its type definition [(#120)](https://github.com/fanduel-oss/refract/pull/120) and [(#121)](https://github.com/fanduel-oss/refract/pull/121) |

## 28 October 2018

| Packages | Version | Changes |
| --- | --- | --- |
| React / Inferno / Preact | 2.2.0 | :rocket: Add an optional seed value to `component.useEvent(eventName, seedValue?)`. The seed value will be used to initialise the returned stream of events [(#113)](https://github.com/fanduel-oss/refract/pull/113) |

| Packages | Version | Changes |
| --- | --- | --- |
| React / Inferno / Preact | 2.1.0 | :rocket: Add a convenient util `component.useEvent(eventName)` to return a tuple containing the result of `fromEvent` and `pushEvent` [(#112)](https://github.com/fanduel-oss/refract/pull/112)<br>:rocket: Support React new `contextType` (React >= 16.6.0): a React context can be passed to `withEffects` and its context value will be passed alongside `initialProps` [(#109)](https://github.com/fanduel-oss/refract/pull/109) |

## 10 October 2018

| Packages | Version | Changes |
| --- | --- | --- |
| React / Inferno / Preact | 2.0.0 | :rocket: Add built-in effects for mapping and injecting props, and rendering [(#76)](https://github.com/fanduel-oss/refract/pull/76), [(#77)](https://github.com/fanduel-oss/refract/pull/77)<br>:rocket: Add value transformer (second argument) to `component.observe()` and `component.fromEvent()` [(#95)](https://github.com/fanduel-oss/refract/pull/95)<br>**BREAKING CHANGES** `component.event()` has been renamed to `component.fromEvent()` |
| Redux | 1.2.0 | Update Redux peer dependency to `3.5.0` or above (as opposed to `3.0.0`) |

## 25 September 2018

| Packages | Version | Changes |
| --- | --- | --- |
| Redux | 1.1.0 | :bug: Fix: initialise Redux selector observers with their initial value [(#75)](https://github.com/fanduel-oss/refract/pull/75) |
<!-- prettier-ignore-end -->
