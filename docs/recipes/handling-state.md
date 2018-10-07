# Handling local state

State in React is a never-ending story: you can use Redux, vanilla local state, higher-order components built on top of local state, use the new context API...

We believe state strongly coupled to components is best colocated: it is easier to reason about, easier to maintain and enables you to cleanly isolate sections of an application. Refract makes it possible to handle local state reactively, and it might even challenge some of your asumptions.

## Source of truth

Redux popularised state as a source of truth: in a Redux app, state is indeed the source of truth of your view, because a hard separation is enforced. However, actions (which are like events) are the source of truth of your reducers and therefore state.

In any application, events are the source of truth! Any application projects them (reduces them if you prefer!) to state. And state can be represented in different ways: an object, or a React element.

A counter for instance will have `'click'` events resulting in a value being incremented (`{count: 1}`) and rendered `<span>{count}</span>`: from event, to representation.

## Stateful apertures

Refract can observe "events" (see [Observing React](../usage/observing-react.md)) and has built-in effects: to [map and replace props](../usage/pushing-to-props.md) and to [render components](../usage/rendering-components.md); it allows you to handle the different transformation steps, from events to presentation, in one place.

The example below is a very basic example of a toggle. We have a `Toggle` component which can reveal content (`children`).

```js
import React from 'react'

export default function Toggle({ isExpanded, toggle, children }) {
    return (
        <div>
            <button onClick={toggle}>{isExpanded ? 'Hide' : 'Reveal'}</button>

            {isExpanded ? children : null}
        </div>
    )
}
```

We wrap this component with Refract, so we can provide the `toggle` callback, and map state to props.

```js
import React from 'react'
import { withEffects, toProps } from 'refract-rxjs'
import { reduce, map } from 'rxjs/operators'
import Toggle from './Toggle'

const hander = () => () => {}

const aperture = initialProps => component => {
    const toggle = component.pushEvent('toggle')
    const toggleEvents$ = component.event('toggle')

    return toggleEvents$.pipe(
        reduce(
            props => ({
                ...props,
                isExpanded: !props.isExpanded
            }),
            {
                toggle,
                isExpanded: false
            }
        ),
        map(toProps)
    )
}

const ToggleWithState = withEffects(handler)(aperture)(Toggle)

export default ToggleWithState
```

## Using context

When handling local state, it can be cumbersome to have to pass props through several layers of components (this is known as "prop drilling"). React's new context API can help with it, and you can leverage is with Refract by using rendering effects.

The example below puts a counter state in context. In the aperture, we create a context object from `'count'` events and combine them with the values of `children` received to set the value of a context provider.

```js
import React from 'react'
import { withEffects } from 'refract-rxjs'
import { combineLatest } from 'rxjs'
import { reduce, map } from 'rxjs/operators'

const { Provider, Consumer: CounterStateConsumer } = React.createContext({})

const handler = () => () => {}
const aperture = initialProps => component => {
    const children$ = component.observe('children')

    const countEvents$ = component.event('count')
    const countUp = component.pushEvent('count')
    const context$ = countEvents$.pipe(
        reduce(
            context => ({
                ...context,
                count: context.count + 1
            }),
            {
                countUp,
                count: initialProps.initialCount
            }
        )
    )

    return combineLatest(context$, children$).pipe(
        map(([context, children]) => (
            <Provider value={context}>{children}</Provider>
        ))
    )
}

const CounterStateProvider = withEffects(handler)(aperture)()

export { CounterStateProvider, CounterStateConsumer }
```
