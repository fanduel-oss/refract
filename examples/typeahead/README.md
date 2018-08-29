# 🏠 [Home](../../) / [Examples](../) / Typeahead

## Typeahead

<!-- prettier-ignore-start -->
| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](./callbag/) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/typeahead/callbag) | [`code`](./most/) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/typeahead/most)  | [`code`](./rxjs/) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/typeahead/rxjs)  | [`code`](./xstream/) [`live`](https://codesandbox.io/s/github/fanduel-oss/refract/tree/master/examples/typeahead/xstream)  |
<!-- prettier-ignore-end -->

In this example, a GitHub username searchbox is rendered to the screen. The searchbox includes a typeahead, which fetches username suggestions based on what the user has typed so far.

When a user clicks on a suggestion, or presses the return key while the textbox (or a suggestion) is focused, the selected GitHub account's data is fetched, and rendered to the screen.

#### Aperture

Two sources are observed in this example:

*   The `search` prop.
*   The `selection` prop.

The `search` prop is used as the source for two separate streams.

First, a stream of suggestions. Each time the `search` prop changes, if its value is truthy, it is debounced and sent through a pipeline which includes an asynchronous fetch request, and some data manipulation.

In a separate stream of logic, each time the `search` prop changes, if its value is an empty string, it is mapped to another `setState` effect which resets the `suggestions` state to an empty array.

Finally, a stream of users. Each time the `selection` prop changes, it is sent through a similar logic pipeline to the first stream, which results in the `user` state being updated.

These three streams are merged into one, and returned as the output of the `aperture`.

Note that all three streams used a `toState` "effectCreator" function at the end - this is a helper function similar to a redux `actionCreator`.

#### Handler

If the effect's type is `SET_STATE`, the `handler` passes the effect's payload into `initialProps.setState`.

#### Result

The end result is an intelligent user interface which exposes search suggestions and fetches user data as a side-effect.
