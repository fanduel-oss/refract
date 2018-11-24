# Glossary

## Side-Effects

A `side-effect` is a general term in computer science. In the context of an app, it means any interaction with the world outside of the internal logic of your app. Typical examples of a include API requests, analytics, logging, local storage, and so on.

## Aperture

An `aperture` controls the streams of data which enter Refract.

```js
type Aperture<P, E, C> = (
    component: ObservableComponent,
    initialProps: P,
    initialContext: C
) => Observable<E>
```

It is a function which observes data sources within your app, passes this data through any necessary logic flows, and outputs a stream of `effect` values in response.

## Effect

An `effect` is any value, passed from an `aperture` into a `handler`. These can be any value: numbers, strings, booleans, etc - you get to decide how to structure your effects.

It's expected that for most applications, `effect`s will likely be plain JavaScript objects (or arrays of objects if you want to dispatch multiple effects simultaneously) - this works well for more complex apps.

## Handler

A `handler` causes side-effects in response to any `effect` value output by the `aperture`.

```js
type Handler<P, E> = (initialProps: P, initialContext: C) => (effect: E) => void
```

It is a function which imperatively calls any side-effect you wish to result from the output of your aperture. This often includes returning data to your app's flow (via `setState` or Redux `dispatch` for example), but could also include external side-effects which do not loop back into your app (such as localstorage or analytics).

## ErrorHandler

An `errorHandler` causes side-effects in response to any fatal error occurring within your `aperture`.

```js
type ErrorHandler<P> = (
    initialProps: P,
    initialContext: C
) => (error: any) => void
```

It is a function which calls any side-effect you wish to result from any fatal errors within your streams. In some situations, an error can occur which breaks your stream pipeline. In this case, the error is handled by your `errorHandler`. Usually, you would be expected to log this error for further investigation.
