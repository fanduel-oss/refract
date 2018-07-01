# Injecting Dependencies

Refract lets you inject your own dependencies, such as your Redux store, your router, your API, and so on.

To expose any dependencies for use inside Refract, you simply pass them as props into any component wrapped with the `withEffects` higher-order component. Your dependencies will then be available as part of the `initialProps` object, which is the first argument in your `aperture`, `handler`, and `errorHandler`.

## Exposing Your Redux Store

In order to use Refract with Redux, you will need to expose your Redux store as a dependency to your Refract components.

To do so, simply pass your store into your component as props, exactly as you do when passing your store to the Redux Provider component:

```js
import { Provider } from 'redux'
import { withEffects } from 'refract-rxjs'

import configureStore from './configureStore'
import App from './components/App'

const store = configureStore()
const AppWithEffects = withEffects(handler)(aperture)(App)

ReactDOM.render(
    <Provider store={store}>
        <AppWithEffects store={store} />
    </Provider>,
    document.getElementById('root')
)
```

This pattern is likely to change in future when Redux moves to React's new context API.

## Exposing Your Router

Another side-effect you may wish to cause is navigation within your app.

### With Router5

At FanDuel, we use [`router5`](https://router5.js.org/) for routing. It is a framework and view library agnostic router, and provides a very powerful and configurable routing solution which works particularly well with Redux. It also works well with Refract!

Similar to Redux's `createStore`, to use router5 you create an instance of the router by calling a `createRouter` function, and pass the returned router instance into a provider.

This router instance can be passed into Refract, for easy imperative navigation. For example, using both Redux and router5:

```js
import { Provider } from 'redux'
import { RouterProvider } from 'react-router5'
import { withEffects } from 'refract-rxjs'

import createRouter from './create-router'
import configureStore from './create-store'
import App from './components/App'

const router = createRouter()
const store = configureStore(router)
const AppWithEffects = withEffects(handler)(aperture)(App)

const WrappedApp = (
    <Provider store={store}>
        <RouterProvider router={router}>
            <AppWithEffects store={store} router={router} />
        </RouterProvider>
    </Provider>
)

router.start(() => {
    ReactDOM.render(
        WrappedApp,
        document.getElementById('root')
    )
})
```

### With React-Router

TODO: Test with react-router and write an example!

## Other Dependencies

Because dependencies are simply passed into Refract as props, you can easily add any dependency you need - all you have to do is add more props!

## Passing Dependencies To Children

You might have noticed a problem with the approach outlined above: how do you pass these dependencies down to any `ComponentWithEffects` which are far further down the React component tree?

A naïve approach would be to pass all dependencies down through your app as props, but that would be a pain to maintain.

Instead, we recommend using React's new context API, which is perfect for passing this kind of information through to any arbitrary child within your app.

For an explanation of how to do this, and a tip for how to make the code clean and simple, take a look at the [`dependency-injection`](../recipes/dependency-injection.md) recipe.
