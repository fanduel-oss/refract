# Observing React

Inside your `aperture`, refract exposes an object called `component`.

```js
const aperture = initialProps => component => {
    /* ... */
}
```

This `component` object contains the following properties:
* `observe(propName: string)` - a function which lets you observe any property passed into your component.
* `mount` - a stream of React `mount` lifecycle events.
* `unmount` - a stream of React `unmount` lifecycle events.

## Observing Props

## Observing Lifecycle