# withEffects

Used to enhance a plain React component, wrapping it in a WithEffects component which handles side-effects internally. It is a curried higher-order component.

## Packages

`withEffects` is provided by our React packages - `refract-callbag`, `refract-most`, `refract-rxjs`, and `refract-xstream`.

## Signature

```js
withEffects = (handler, errorHandler?) => (aperture) => (BaseComponent) => {
    return WrappedComponent
}
```

## Arguments

1. `handler` _(function)_: a function which causes side-effects in response to `effect` values.

    Signature: `(initialProps) => (effect) => { /* handle effect here */ }`

    * The `initialProps` are all props passed into the `WrappedComponent`.
    * The `effect` is each value emitted by your `aperture`.
    * Within the body of the function, you cause any side-effect you wish.

1. `errorHandler` _(function)_: an _optional_ function for catching any unexpected errors thrown within your `aperture`. Typically used for logging errors.

    Signature: `(initialProps) => (error) => { /* handle error here */ }`

    * The `initialProps` are all props passed into the `WrappedComponent`.
    * The `error` is each value emitted by your `aperture`.
    * Within the body of the function, you cause any side-effect you wish.

1. `aperture` _(function)_: a function which observes data sources within your app, passes this data through any necessary logic flows, and outputs a stream of `effect` values in response.

    Signature: `(initialProps) => (component) => { return effectStream }`.

    * The `initialProps` are all props passed into the `WrappedComponent`.
    * The `component` is an object which lets you observe your React component.
    * Within the body of the function, you observe the event source you choose, pipe the events through your stream library of choice, and return a single stream of effects.

1. `BaseComponent` _(React component)_: any react component.

## Returns

`WrappedComponent` _(React component)_: a new component which contains your side-effect logic, and which will render your component as per usual.

## Example

```js
import { withEffects } from 'refract-rxjs'

const BaseComponent = ({ username, onChange }) => (
    <input value={username} onChange={onChange} />
)

const aperture = (initialProps) => (component) => {
    return component.observe('username').pipe(
        debounce(2000),
        map(username => ({
            type: 'localstorage',
            name: 'username',
            value: username
        }))
    )
}

const handler = (initialProps) => (effect) => {
    switch (effect.type) {
        case 'localstorage':
            localstorage.setItem(effect.name, effect.value)
            return
    }
}

const WrappedComponent = withEffects(handler)(aperture)(BaseComponent)
```

## Tips

* Take a look at our recipe for [`dependency injection`](../recipes/dependency-injection.md) into your Refract components.
* `withEffects` is curried so that you can re-use a bound `handler` (and `errorHandler`) with multiple different `apertures`.
