Had an idea for how we could use new context to make Refract more flexible in terms of how you can use it inside a component tree, while also enforcing use of a global `effectHandler`:

```js
import { RefractProvider } from 'refract'

const effectHandler = initialProps => effect => {
    // effecHandler stuff here
}

const errorHandler = initialProps => effect => {
    // errorHandler stuff here
}

const App = () => (
    <ReduxProvider store={store}>
        <RefractProvider
            effectHandler={effectHandler}
            errorHandler={errorHandler}
            store={store}
            dependencies={{ api, router }}
        >
            <App />
        </RefractProvider>
    <ReduxProvider>
)
```

The `RefractProvider` would wrap a context provider. It takes an `effectHandler` and an `errorHandler` plus any number of other `props`, and calls `effectHandler(props)` and `errorHandler(props)` in its constructor. It'd put the resulting functions (with signature `(effect) => void` or `(error) => void`) into context.

```js
import { Refract } from 'refract'

const effectFactory = initialProps => component => {
    // effectFactory stuff here
}

const MyComponent = props => (
    <div>
        <h1>Component title</h1>
        <OtherComponent />
        <Refract effectFactory={effectFactory} {...props}>
            {decoratedProps => (
                <div>
                    <p>Can use decorated props inside render callback</p>
                    <AnotherComponent onClick={decoratedProps.onClick} />
                </div>
            )}
        </Refract>
    </div>
)

export default MyComponent
```

The other main change is that you can use `Refract` as a component inside a component tree. It takes an `effectFactory` plus any number of `props` to observe. Same internal logic as the current `withEffects` hoc internally, but pulls the `effectHandler` and `errorHandler` out of the RefractContext. Decorated props are exposed via a render function.

```js
import { withRefract } from 'refract'

const effectFactory = initialProps => component => {
    // effectFactory stuff here
}

const MyComponent = props => (
    <div>
        <h1>Can also use the composable HOC as per previously</h1>
        <YetAnotherComponent />
    </div>
)

export default withRefract(effectFactory)(MyComponent)
```

The hoc API is still available, though now you only need to pass in an `effectFactory`!

Obviously all comes with the big caveat of not supporting <16.3... :/

Any thoughts on this? Not sure what the advantages of using the declarative `Refract` component would be, but that doesn't mean there aren't any. Like that it only passes the two handlers through context though, feels a lot cleaner than what I had in mind previously!
