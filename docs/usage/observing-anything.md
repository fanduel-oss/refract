# Observing Anything

Your `aperture` receives all initial props passed to your component. By passing observable data sources as props, you can observe anything you wish and trigger side-effects in response.

This is a good way to inject any observable data source via `initialProps` can therefore be used to trigger effects. What you have to do is to pass the props you need to `withEffects`: see [Dependency injection](./dependency-injection.md)

In addition, your `aperture` is a blank slate, and allows you to observe anything which exists in the global context such as time or events.

## Events

By using your streaming library's utilities aimed at creating observables, you can respond to any events available in JavaScript.

For example, you can observe the `window.popstate` event to respond to the user clicking back/forward in the browser:

```js
const aperture = initialProps => component => {
    const popstate$ = fromEvent(window, 'popstate').pipe(
        map(event => ({
            type: 'POPSTATE',
            state: event.state
        }))
    )
}
```

Or as another example, you could listen to the `window.resize` event in order to dynamically alter your logic depending on the user's screen size:

```js
const aperture = initialProps => component => {
    const resize$ = fromEvent(window, 'resize').pipe(
        debounce(500)        
    )
}
```

## Time

Your streaming library will also provide utilities for observing the passing of time.

For example, if you want to do something once every few seconds as a kind of background process, it's easy to create an interval stream:

```js
const aperture = initialProps => component => {
    const interval$ = interval(4000) // emits once every four seconds
}
```

## Custom Dependencies

It's also possible to create your own dependencies with custom methods similar to our `component.observe` and `store.observe`, and expose them through dependency injection via props. If you do, please publish it so that others can use it too!
