# 🏠 [Home](../../) / [Examples](../) / Routing

## Routing

In this example, a set of tabs are rendered to the screen, with the currently active tab stored in React state.

#### Aperture

Two sources are observed in this example:

*   The `setActiveTab` callback function.
*   The `window.popstate` event.

In addition, a single event is fired when the `aperture` initiates, which sets the initial state to `initialProps.activeTab`.

All three are simply mapped to objects with the desired structure, and merged into a single stream.

#### Handler

If the effect's type is `NAVIGATION`, the `handler` calculates the new browser url, and pushes it to `window.history`.

If the effect's type is `STATE`, it calls `setState` with the new state.

#### Result

The end result is a set of tabs whose state is pushed to the browser url as a side-effect.

<!-- prettier-ignore-start -->
| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](./callbag) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/routing/callbag) | [`code`](./most) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/routing/most)  | [`code`](./rxjs) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/routing/rxjs)  | [`code`](./xstream) [`live`](https://codesandbox.io/s/github/troch/refract/tree/master/examples/routing/xstream)  |
<!-- prettier-ignore-end -->
