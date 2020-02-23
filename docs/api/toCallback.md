# toCallback

## Packages

`toCallback` is provided by our React, Inferno or Preact packages - `refract-*`, `refract-inferno-*`, `refract-preact-*`.

## Arguments

`toCallback` is a curried function which takes two arguments: the name of the prop you want to call (as a string), and the data you want to pass into this callback.

## Returns

Similar to a Redux action creator, it returns an object containing `type` and `payload` attributes, so it can be recognised by Refract.

```js
export const toCallback = propName => data => ({
    type: CALLBACK_EFFECT,
    payload: {
        data,
        propName
    }
})
```
