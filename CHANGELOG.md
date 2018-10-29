<!-- prettier-ignore-start -->
# Changelog

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
