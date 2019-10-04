# 🏠 [Home](../../) / [Examples](../) / Routing

## Routing

<!-- prettier-ignore-start -->
| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](https://git.io/fAZ1Q) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/routing/callbag) | [`code`](https://git.io/fAZ1y) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/routing/most)  | [`code`](https://git.io/fAZ1P) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/routing/rxjs)  | [`code`](https://git.io/fAZ1K) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/routing/xstream)  |
<!-- prettier-ignore-end -->

In this example, a set of tabs are rendered to the screen, with the currently active tab stored in React state.

#### Aperture

Two sources are observed in this example:

*   The `setActiveTab` callback function.
*   The `window.popstate` event.

In addition, a single event is fired when the `aperture` initiates, which sets the initial state to `initialProps.activeTab`.

All three are simply mapped to objects with the desired structure, and merged into a single stream.

#### Handler

If the effect's type is `NAVIGATION`, the `handler` calculates the new browser url, and pushes it to `window.history`.

If the effect's type is `STATE`, it calls `setActiveTab` with the new state.

#### Result

The end result is a set of tabs whose state is pushed to the browser url as a side-effect.
