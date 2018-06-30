# Dependency Injection

# Using `react-zap` for dependency injection

_Link to zap repo, plus explain why this is helpful._

**Note: refactor this so it's actually in line with recommendations!**

In a `sideEffects.js` file:

```js
import { contextToProps } from 'react-zap'
import { withEffects } from 'refract-rxjs'

const { Provider, Consumer } = createContext()

const withEffects = (handler, errorHandler) => aperture => Component =>
    contextToProps(Consumer)(
        withEffects(handler, errorHandler)(aperture)(Component)
    )

export {
    RefractProvider: Provider,
    withEffects
}
```

In a root App component:

```js
import { RefractProvider } from '~/sideEffects'

const App = () => (
    <ReduxProvider store={store}>
        <RefractProvider
            api={api}
            router={router}
            store={store}
            {...etc}
        >
            <Children>
        </RefractProvider>
    </ReduxProvider>
)
```

In any component:

```js
import { withEffects } from '~/sideEffects'

const Component = props => (
    <div>
        <h1>My component</h1>
        <AnotherComponent {...props} />
    </div>
)

export default withEffects(handler)(aperture)(Component)
```