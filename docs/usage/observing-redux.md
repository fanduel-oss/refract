# Observing Redux

_Before you can observe your Redux store, make sure you have used dependency injection to expose it to your Refract components!_

Refract adds a method to your store called `observe` (see [Getting Started](./getting-started.md)), which you can use to observe Redux from inside your `aperture`.

```js
const aperture = (component, initialProps) => {
    const streamFromStore$ = initialProps.store.observe('something')
}
```

`store.observe` takes one argument, which can be either a string or a function.

## Observing Actions

If you pass in a string, `store.observe` returns a stream of actions dispatched to your store which have that string as their action type.

```js
const aperture = (component, { store }) => {
    const ping$ = store.observe('PING')
    const pong$ = store.observe('PONG')
}
```

In this example, `ping$` will receive any action with a type of `PING` which gets dispatched to your store, and `pong$` will receive any action with a type of `PONG` which gets dispatched to your store.

Each observed action is passed into your stream with all its data - including the payload.

## Observing State

If you pass in a function, `store.observe` will treat it as a Redux selector, and return a stream which subscribes to the state using your function, initialised with the selector's current value. Any time the selected slice of state changes, its new value will be piped to your stream if changed (`===` comparison).

```js
const storeShape = {
    users: {
        SomeUserName: {
            balance: 999,
            ...user
        }
    }
}

const getBalance = username => state => state.users[username].balance

const aperture = (component, { store }) => {
    const balance$ = store.observe(getBalance('SomeUserName'))
}
```

In this example, `balance$` will receive a new value every time the user's balance changes.

Note that this is particularly powerful in combination with curried selectors - by tweaking the above example to use the `initialProps` to source the username, we can select the slice of state dynamically:

```js
const aperture = (component, { store, username }) => {
    const balance$ = store.observe(getBalance(username))
}
```

## Combining Observations

As mentioned previously, Refract's API is designed to give you complete control over your side-effects, and you are encouraged to observe multiple sources simultaneously.

Observing both actions and state is a powerful combination which opens up many opportunities for complex functionality to be implemented in a clean and maintainable way.
