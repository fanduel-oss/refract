# 🏠 [Home](../../) / [Examples](../) / Field Validation

## Field Validation

<!-- prettier-ignore-start -->
| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](https://git.io/fAZ14) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/field-validation/callbag) | [`code`](https://git.io/fAZ1B) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/field-validation/most) | [`code`](https://git.io/fAZ1R) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/field-validation/rxjs) | [`code`](https://git.io/fAZ10) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/field-validation/xstream) |
<!-- prettier-ignore-end -->

This basic example renders a single text input which prompts for a GitHub username; the current `username` of this input is stored in React component state.

#### Aperture

Only one source is observed:

*   The `username` prop.

Every time the input's `username` changes, the new username is passed to the stream. Any blank strings are filtered from the stream, and then the usernames are debounced for one second.

After debouncing, a fetch request is made and resolved. If a user is found, an effect with type `USER_FOUND` is output; if no user is found, an effect with type `USERNAME_AVAILABLE` is output.

#### Handler

The Refract `handler` toggles the `available` state appropriately depending on the effect's type.

#### Result

The end result is an input field with asynchronous validation handled as a side-effect.
