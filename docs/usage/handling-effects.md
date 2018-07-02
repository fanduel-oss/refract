# Handling Effects

Each time an effect is piped out of your `aperture` stream pipeline (assuming no errors occur), it is passed to your `handler`.

```js
const handler = (initialProps) => (effect) => {
    /* handle effects here */
}
```

Similar to your `aperture`, your `handler` is passed all of your component's props through the `initialProps` object. This means that when you inject your dependencies via props, they're also available here!

This makes it easy to call imperative side-effects in your handler, as a clear and simple way to either push data back into your app after it has been through your async pipeline, or send it out to some external dependency which will not return data to your app.

## Global Handler

The internal logic of your handler can be as simple or as complex as you wish, and each Refract component can have a custom handler if you choose.

However, in our experience it is beneficial to have only one handler, and to use this handler throughout your app.

In order to achieve this, your effect objects need to follow some kind of convention, not too different from Redux actions. It can be a great shortcut to reuse existing actionCreators and actionTypes you might have built for your Redux app, for example.

One flexible pattern would be to structure your effect objects to allow calling multiple side-effects at once:

```js
const handler = (initialProps) => (effect) => {
    if (effect.analytics) {
        initialProps.analytics.push(effect.analytics)
    }

    if (effect.dispatch) {
        initialProps.store.dispatch(effect.dispatch)
    }

    if (effect.navigate) {
        initialProps.router.navigate(effect.navigate)
    }

    // ...etc
}
```
}
