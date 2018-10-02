# Pushing to props

By now, you should have a better understanding of what Refract does:

*   It allows you to observe data sources ([React](./observing-react.md), [redux](./observing-redux), [anything else](./observing-anything.md))
*   It allows you to push data to an effect handler (see [handling effects](./handling-effects.md))

Refract has three built-in effect handlers, to:

*   Pass additional props to the child it wraps
*   Replace props
*   Render components

This section focuses on adding and replacing props, and its applications. All React, Preact and Inferno packages export a `toProps` function and a `asProps` one. Both these functions take an object of props.

## Adding props

Any value emitted by your aperture which has been wrapped with `toProps` will cause the wrapped component to re-render with the additional provided props. Let's see a very simple example where a prop `doubledValue` is computed from a prop `value`:

```js
import React from 'react'
import { withEffects, toProps } from 'refract-rxjs'
import { map } from 'rxjs/operators'

const DoubleValue = ({ value, doubledValue }) => (
    <div>Two times {value} is {doubledValue}</button>
)

const aperture = ({ initialCount }) => component => {
    component.observe('value').pipe(map(value => toProps({
        doubledValue: 2 * value
    })))
}

const handler = () => () => {}

export default withEffects(handler)(aperture)(DoubleValue)
```

## Replacing props

`asProps` is used exactly like `toProps`, except that the provided props will be the only ones passed to the child component.

It allows to fully control what props are passed through, and can result in performance benefits by controlling exactly when a component re-renders.

Essentially, `toProps` and `asProps` allow to inject data into components, by using existing props or external data sources (sideways data loading).

## Stateful apertures

The ability to set component props combined with the ability to listen to events (with `pushEvent` and `component.event(name)`), comes the ability of handling state: events are the source of truth, and state is a projection of these events.

The example below is a simple counter example: each time a button is clicked, the count is incremented. We use a reducer to persist state between events, and pass it as props. It will sound familiar if you've used Redux: we go from events to state to props, the same way Redux (with `connect`) goes from actions to state to props (see [Replacing react-redux connect HoC](../recipes/replacing-connect.md]) recipe).

```js
import React from 'react'
import { withEffects, toProps } from 'refract-rxjs'
import { reduce, map } from 'rxjs/operators'

const Counter = ({ count, addOne }) => (
    <button onClick={plusOne}>{count}</button>
)

const aperture = ({ initialCount }) => component => {
    const addOne = component.pushEvent('addOne')

    return component.event('addOne').pipe(
        reduce(
            ({ count, ...props }) => ({
                ...props,
                count: count + 1
            }),
            {
                count: initialCount,
                addOne
            }
        ),
        map(toProps)
    )
}

const handler = () => () => {}

export default withEffects(handler)(aperture)()
```
