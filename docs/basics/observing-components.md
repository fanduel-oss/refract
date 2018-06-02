# Observing React components

Refract exposes in `effectFactory` an object `component`.

```js
const effectFactory = initialProps => component => {
    /* ... */
}
```

`component` contains the following properties:
- `observe(propName: string)`
- `mount`
- `unmount`


## Observing props

You can observe props changing with `observe(propName: string, options: Options)`. It will return a stream of values of a prop.

When calling `observe`, you can specify whether or not the returned stream should be initialised with the current observed prop value (default to `true`).

```js
const value$ = component.observe('value', { initialValue: false })
```

Refract emits new prop values only if they have changed: the change detection is done using reference equality `===`. If you need a different change detection mechanism (and exclude more values), it is easy to filter them on your side (using a `filter` operator).


## Observing function props

Refract can also observe function props being called. If you have a component prop called `setValue`, `component.observe('setValue')` will return a stream of the first argument for each function call.

```js
const value$ = component.observe('setValue')
```

In the case of function props, option `initialValue` is not applicable.

## Components mounting

`component.mount` is a stream which will emit a single value (like a signal) when a component mounts.

It can be useful to defer any logic after a component has been mounted.

## Components unmounting

`component.unmount` is a stream which will emit a single value (like a signal) when a component unmounts.

It can be useful to trigger side-effects when a component is about to be unmounted.
