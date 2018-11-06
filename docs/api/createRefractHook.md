# createRefractHook

Used to create a custom hook.

## Packages

`createRefractHook` is provided by our React packages - `refract-*`. It is only available for versions of React supporting hooks (React 16.7.0-alhpa.0 and above).

## Signature

```js
const useRefract = createRefractHook(
    handler,
    errorHandler?,
    Context?
)

const componentData = useRefract(aperture, data?)
```

After providing an effect handler, and optionally an error handler and a Context, `useRefract` needs to be passed an `aperture` and optionally some custom `data`.

## Arguments

1.  `handler` _(function)_: a function which causes side-effects in response to `effect` values.

    Signature: `(initialData, initialContext) => (effect) => { /* handle effect here */ }`

    *   The `initialData` passed to the hook (second argument).
    *   The `initialContext` is the initial context value of the provided `Context` (see below, React >= 16.6.0 only)
    *   The `effect` is each value emitted by your `aperture`.
    *   Within the body of the function, you cause any side-effect you wish.

1.  `errorHandler` _(function)_: an _optional_ function for catching any unexpected errors thrown within your `aperture`. Typically used for logging errors.

    Signature: `(initialData, initialContext) => (error) => { /* handle error here */ }`

    *   The `initialData` passed to the hook (second argument).
    *   The `initialContext` is the initial context value of the provided `Context` (see below, React >= 16.6.0 only)
    *   The `error` is each value emitted by your `aperture`.
    *   Within the body of the function, you cause any side-effect you wish.

1.  `Context` _(ReactContext)_: a React Context object. Its initial value will be passed to `handler`, `errorHandler` and `aperture` (React 16.6.0 and above only).

1.  `aperture` _(function)_: a function which observes data sources within your app, passes this data through any necessary logic flows, and outputs a stream of `effect` values in response.

    Signature: `(initialData, initialContext) => (component) => { return effectStream }`.

    *   The `initialData` passed to the hook (second argument).
    *   The `initialContext` is the initial context value of the provided `Context` (see above, React >= 16.6.0 only)
    *   The `component` is an object which lets you observe: see [Observing React](../usage/observing-react.md). The `observe` method allows you to observe `data` passed to your hook.
    *   Within the body of the function, you observe the event source you choose, pipe the events through your stream library of choice, and return a single stream of effects.

1.  `data` _(object)_: an object of data (state, props, context) passed to your hook.

## Returns

`componentData` _(any)_: Refract hooks have a special built-in effect to push data to your component. Effects emitted by your aperture and wrapped with `toComponent` will be returned by your hook.

```js
import { toComponent } from 'refract-rxjs'
```

## Example

```js
import { createRefractHook } from 'refract-rxjs'

const handler = initialData => effect => {
    switch (effect.type) {
        case 'localstorage':
            localstorage.setItem(effect.name, effect.value)
            return
    }
}

const useRefract = createRefractHook(handler)

const aperture = initialData => component => {
    return component.observe('username').pipe(
        debounce(2000),
        map(username => ({
            type: 'localstorage',
            name: 'username',
            value: username
        }))
    )
}

const BaseComponent = () => {
    const [ username, setUsername ] = useState()

    useRefract(aperture, { username })

    return <input value={username} onChange={evt => setUsername(evt.target.value)} />
)
```

## Tips

*   Take a look at our recipe for [dependency injection](../recipes/dependency-injection.md) into your Refract components.
*   `createRefractHook` enables to create a re-usable hook bound to a `handler` (and `errorHandler`).
