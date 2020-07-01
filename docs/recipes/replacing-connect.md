# Replacing Redux Connect

It is possible to [handle local state](./handling-state.md) in Refract, and Refract enables you to [observe any data source](../usage/observing-anything.md): as a result, we can easily and reactively map any data source to props with Refract.

This recipe will show you how you can replace `connect` from the `react-redux` package using Refract. The syntax is not as compact as `connect`, but it has several benefits:

*   You have full control over when children are rendered: the required selectors don't have to be re-computed every single time or loaded upfront (you can lazy load selectors)
*   You can leverage Refract to handle other effects (network requests, analytics, etc.)
*   You can mix it with other data sources (props, other external sources)

We recommend you look at [Installation](../usage/installation.md) and [Observing Redux](../usage/observing-redux.md) if you haven't already.

`connect` takes three arguments (`mapStateToProps`, `mapDispatchToProps`, `mergeProps`) and we are going to go through how to replace each of them.

## Mapping state to props

Given that we have a Redux store available in our props (see [Injecting Dependencies](../usage/injecting-dependencies.md)) and that we have added the Refract store enhancer, we can observe selectors and map their output to props:

```js
import { combineLatest } from 'rxjs'
import { map } from 'rxjs/operators'
import { withEffects, toProps } from 'refract-rxjs'
import { getUser, getPosts } from './mySelectors'

const aperture = (component, initialProps) => {
    const { store } = initialProps

    const user$ = store.observe(getUser)
    const posts$ = store.observe(getPosts)

    return combineLatest(users$, posts$).pipe(
        map(([user, posts]) => ({
            user,
            posts
        })),
        map(toProps)
    )
}

const ContainerComponent = withEffects(aperture)(BaseComponent)
```

Let's look at the example above step by step:

*   We create two streams (`user$`, `posts$`) from two selectors (`getUser`, `getPosts`)
*   We combine these two streams into another stream where:
    *   We create an object containing users and posts (`{ user, posts }`)
    *   We pass each object to our component's props (with `toProps`)

The result is the same as `connect`: `users` and `posts` will be added to our component's props. The Refract way is more verbose in some cases, but there are a few things which can be leveraged from reactive programming:

*   Selective updates: you can choose when to listen to selectors
    *   We might only be interested in getting the first `user` value: `const user$ = store.observe(getUser).pipe(take(1))`
    *   We might want to only get posts per user


    ```js
    const posts$ = store.observe(getUser).pipe(
        map(user => user ? user.id : null),
        distinctUntilChanged(),
        switchMap(userId => userId ? store.observe(getPosts(userId)) : empty())
    )
    ```

*   Due to the point above, you no longer need to use thunks inside `mapStateToProps` and you no longer to use memoized selectors (using [reselect](https://github.com/reduxjs/reselect)): dependencies of a selector can be expressed using streams.

## Mapping action creators to props

Replacing `mapDispatchToProps` can be done in different ways. A first way would be to do it exactly like `connect` by binding `dispatch` to each action creator and pushing them to props using `toProps`.

Instead, we are going to look at a different way: dispatching is imperative and can be seen as a side-effect, so we are going to treat it as such and move its use to an effect handler. We push event callbacks to our component (using `pushEvent`), observe them, pass their values to their respective action creators and send the whole lot to be dispatched.

```js
import { withEffects, toProps } from 'refract-rxjs'
import { of, merge } from 'rxjs'
import { map } from 'rxjs/operators'
import { createAddPostAction, createRemovePostAction } from './actions'

const BaseComponent = ({ pushEvent }) => (
    <>
        <button onClick={pushEvent('addPost')()}>Add post</button>
        <button onClick={pushEvent('removePost')()}>Remove post</button>
    </>
)

const handler = initialProps => effect => {
    const { store } = initialProps

    if (effect.type === 'DISPATCH') {
        store.dispatch(effect.payload)
    }
}

const toDispatch = action => ({
    type: 'DISPATCH',
    payload: action
})

const aperture = component => {
    const [ addPostEvents$, addPost] = component.useEvent('addPost')
    const [ removePostEvents$, removePost] = component.useEvent('removePost')

    return merge(
        of({
            addPost,
            removePost
        }).pipe(map(toProps)),

        merge(
            addPostEvents$.pipe(map(createAddPostAction)),
            removePostEvents$.pipe(map(createRemovePostAction))
        ).pipe(map(toDispatch))
    })
}

const ContainerComponent = withEffects(aperture, { handler })(BaseComponent)
```

Again, it is a more verbose approach than `mapDispatchToProps`. But by separating action creation from dispatching logic, it enables you to hook other side-effects that you could otherwise find in a Redux middleware (like analytics events).

## Merging props

The third less-known argument of `connect` is `mergeProps`: it takes the component's props, the outputs of `mapStateToProps` and `mapDispatchToProps`, and merges them together (by default). It would typically be used for preventing some component's props to be passed down, or to perform extra computations. This is no longer needed, since you can map or replace props in Refract: see [Pusing to props](../usage/pushing-to-props.md).
