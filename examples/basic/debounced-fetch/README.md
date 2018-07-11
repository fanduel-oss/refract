# 🏠 [Home](../../../) / [Examples](../../) / [Basic](../) / Debounced Fetch

## Debounced Fetch

This basic example renders a single text input which prompts for a GitHub username; the current `username` of this input is stored in React component state.

#### Aperture

Only one source is observed:

- The `username` prop.

Every time the input's `username` changes, the new username is passed to the stream. Any blank strings are filtered from the stream, and then the usernames are debounced for one second.

After debouncing, a fetch request is made and resolved; the response of this request is output as an effect with a type of `USER_DATA_RECEIVE`.

#### Handler

The Refract `handler` sets the payload of any effect with a type of `USER_DATA_RECEIVE` into state, ready to be displayed in the UI.

#### Result

The end result is a debounced fetch request based on input's current value, with the results rendered to the UI.

| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](./callbag) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/debounced-fetch/callbag) | [`code`](./most) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/debounced-fetch/most)  | [`code`](./rxjs) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/debounced-fetch/rxjs)  | [`code`](./xstream) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/debounced-fetch/xstream)  |
