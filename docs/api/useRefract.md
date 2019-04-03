# useRefract

Used to create a custom hook.

## Packages

`useRefract` is provided by our React packages - `refract-*`. It is only available for versions of React supporting hooks (React 16.7.0-alpha.0 and above).

## Signature

```js
const useRefract = useRefract(aperture, data, {
    handler,
    errorHandler
})
```

## Arguments

1.  `aperture` _(function)_: a function which observes data sources within your app, passes this data through any necessary logic flows, and outputs a stream of `effect` values in response.

    Signature: `(component, initialData) => { return effectStream }`.

    *   The `initialData` passed to the hook (second argument).
    *   The `component` is an object which lets you observe: see [Observing React](../usage/observing-react.md). The `observe` method allows you to observe `data` passed to your hook.
    *   Within the body of the function, you observe the event source you choose, pipe the events through your stream library of choice, and return a single stream of effects.

1.  `data` _(object)_: an object of data (state, props, context) passed to your hook.

1.  `handler` _(function)_: a _optional_ function which causes side-effects in response to `effect` values.

    Signature: `(initialData) => (effect) => { /* handle effect here */ }`

    *   The `initialData` passed to the hook (second argument).
    *   The `effect` is each value emitted by your `aperture`.
    *   Within the body of the function, you cause any side-effect you wish.

1.  `errorHandler` _(function)_: an _optional_ function for catching any unexpected errors thrown within your `aperture`. Typically used for logging errors.

    Signature: `(initialData) => (error) => { /* handle error here */ }`

    *   The `initialData` passed to the hook (second argument).
    *   The `error` is each value emitted by your `aperture`.
    *   Within the body of the function, you cause any side-effect you wish.

## Returns

`componentData` _(any)_: Refract hooks have a special built-in effect to push data to your component. Effects emitted by your aperture and wrapped with `toRender` will be returned by your hook.

```js
import { toRender } from 'refract-rxjs'
```

## Example

```js
import { useRefract } from 'refract-rxjs'

const handler = initialData => effect => {
    switch (effect.type) {
        case 'localstorage':
            localStorage.setItem(effect.name, effect.value)
            return
    }
}

const aperture = (component, initialData) => {
    return component.observe('username').pipe(
        debounceTime(2000),
        map(username => ({
            type: 'localstorage',
            name: 'username',
            value: username
        }))
    )
}

const BaseComponent = () => {
    const [ username, setUsername ] = useState()

    useRefract(aperture, { username }, { handler })

    return <input value={username} onChange={evt => setUsername(evt.target.value)} />
)
```

## Tips

Take a look at our recipe for [dependency injection](../recipes/dependency-injection.md) into your Refract components.
