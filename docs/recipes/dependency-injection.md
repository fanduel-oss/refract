# Dependency Injection

We recommend using React's new context API for dependency injection, because it is perfect for passing information through to any arbitrary child within your app.

However, it needs a little work for it to play nicely with higher-order components.

## Setting up React Context

Consider the following example, using vanilla React context:

```js
import { createContext } from 'react'

export default createContext()
```

```js
import { Provider } from 'redux'
import { withEffects } from 'refract-rxjs'

import RefractContext from './refractContext'
import configureStore from './configureStore'
import App from './components/App'

const store = configureStore()

ReactDOM.render(
    <Provider store={store}>
        <RefractContext.Provider value={{ store }}>
            <App />
        </RefractContext.Provider>
    </Provider>,
    document.getElementById('root')
)
```

## Passing context to `withEffects`

With React version 16.6.0 and above, you can pass your React context to `withEffects`. For more information about it, you can look at [`withEffects` API](../api/withEffects.md) and [React `class.contextType`](https://reactjs.org/docs/context.html#classcontexttype).

```js
import { withEffects } from 'refract-rxjs'

const MyComponent = props => <Foo {...props} />

export default withEffects(aperture, {
    handler,
    errorHandler,
    Context
})(MyComponent)
```

`handler`, `errorHandler` and `aperture` will then be called with two arguments:

*   `initialProps`: the component props when your component is instantiated
*   `initialContext`: the value of `Context` when your component is instantiated

## Passing context to props

If you are not using React 16.6.0 and above, you can fallback to passing your context as props and it will be available via `initialProps`:

```js
import { withEffects } from 'refract-rxjs'

const MyComponent = props => <Foo {...props} />

export default withEffects(aperture, { handler })(MyComponent)
```

```js
import MyComponent from './MyComponent' // includes effects, but no context
import RefractContext from './refractContext'

const MyView = props => (
    <RefractContext.Consumer>
        {dependencies => <MyComponent {...dependencies} {...props} />}
    </RefractContext.Consumer>
)
```

This code successfully puts dependencies into context and pulls them out again where needed, but it's not a particularly nice pattern. It's a pain to have to import the context and the component separately, and manually pass the dependencies through.

Thankfully, there's a solution for this!

## Using Context With `react-zap`

We recommend using another tiny library, [`react-zap`](https://github.com/troch/react-zap), which lets you consume React context directly via higher-order components.

At first glance, it might seem obvious to do this:

```js
import { withEffects } from 'refract-rxjs'
import { contextToProps } from 'react-zap'

import RefractContext from './refractContext'

const MyComponent = props => <Foo {...props} />

export default contextToProps(RefractContext.Consumer)(
    withEffects(aperture, { handler })(MyComponent)
)
```

```js
import MyComponent from './MyComponent' // includes effects AND context

const MyView = props => <MyComponent {...props} />
```

Which is definitely a lot nicer!

But we can do better - instead of importing and connecting our Refract context every time we use `withEffects`, we can enhance the default `withEffects` HoC by wrapping it with our context once in a `sideEffects.js` file:

```js
import { createContext } from 'react'
import { withEffects, compose } from 'refract-rxjs'
import { contextToProps } from 'react-zap'

const RefractContext = createContext()

const enhancedWithEffects = (aperture, { handler, errorHandler }) => BaseComponent =>
    compose(
        contextToProps(RefractContext.Consumer),
        withEffects(aperture, { handler, errorHandler })
    )(BaseComponent)

export {
    RefractProvider: RefractContext.Provider
    withEffects: enhancedWithEffects
}
```

We would now import this enhanced version instead of the plain one whenever creating a component with side-effects:

```js
import { withEffects } from './sideEffects'

const MyComponent = props => <Foo {...props} />

export default withEffects(aperture, { handler })(MyComponent) // now includes dependencies!
```
