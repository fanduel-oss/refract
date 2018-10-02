# Props

## Packages

`toProps` and `asProps` are provided by our React, Inferno or Preact packages - `refract-*`, `refract-inferno-*`, `refract-preact-*`.

## Arguments

Both `toProps` and `asProps` take an object of props.

## Returns

Similarly to a Redux action creator, they return an object containing `type` and `payload` attributes, so it can be recognised by Refract.

```js
export const toProps = props => ({
    type: PROPS_EFFECT,
    payload: {
        replace: false,
        props
    }
})

export const asProps = props => ({
    type: PROPS_EFFECT,
    payload: {
        replace: true,
        props
    }
})
```
