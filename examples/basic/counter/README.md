# 🏠 [Home](../../../) / [Examples](../../) / [Basic](../) / Counter

## Counter

This basic example involves a `counter` which the user can toggle between `incrementing`, `decrementing`, and `paused` states. The parent component has a simple state: `{ counter: 0, direction: 'NONE' }`. The buttons in the UI alter the `direction` state.

#### EffectFactory

Two sources are observed:

- The `setDirection` callback function.
- An interval which dispatches a new number every second.

Every time `setDirection` is called, the value it was called with is dispatched.

These two sources are then merged; the resulting stream contains a new effect every second, which contains the current direction as its `type`.

#### EffectHandler

Simply increments or decrements the state whenever an effect is dispatched with the correct effect type.

#### Result

The end result is a counter which infinitely counts upwards after the user clicks `increase`, infinitely counts downwards after the user clicks `decrease`, or stays static after the user clicks `pause`.

| callbag | most | RxJS | xstream |
| --- | --- | --- | --- |
| [`code`](./callbag) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/counter/callbag) | [`code`](./most) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/counter/most)  | [`code`](./rxjs) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/counter/rxjs)  | [`code`](./xstream) [`live`](https://stackblitz.com/github/troch/refract/tree/master/examples/basic/counter/xstream)  |
