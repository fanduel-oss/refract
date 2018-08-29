# 🏠 [Home](../../) / [Examples](../) / Redux Fetch

## Redux Fetch

<!-- prettier-ignore-start -->
| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](./callbag) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/redux-fetch/callbag) | [`code`](./most) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/redux-fetch/most) | [`code`](./rxjs) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/redux-fetch/rxjs) | [`code`](./xstream) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/redux-fetch/xstream) |
<!-- prettier-ignore-end -->

This basic example renders a single text input which prompts for a GitHub username. When the user submits the form (either by clicking the button or pressing return), it dispatches a plain action to Redux.

#### Aperture

Inside the Refract `aperture`, two observables are observed: the `USER_REQUEST` action, and the `getUsers` selector. Every time an action with the type `USER_REQUEST` is dispatched to the store, it is passed to the stream; every time the `users` object in the redux store changes, it is also passed to the stream.

These two streams are combined into one `combined$` - each time anything is sent to either stream, this new stream emits a new tuple containing the most recent value from _both_ source streams.

This combined stream is piped through various methods in two separate control flows: requests for users whose data is not yet in redux are mapped to a fetch request, with error handling built in; requests for users whose data _is_ already in the store are mapped to a `selectUser` action.

#### Handler

The Refract `handler` inspects the type of each effect, and causes different effects for different action types. If the effect is an error, it logs the effect; if the effect is either a `USER_RECEIVE` or a `USER_SELECT` effect, it is dispatched to the store.

#### Result

The end result is a form with some complex conditional, asynchronous logic built in an easily maintainable way.
