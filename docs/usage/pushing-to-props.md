# Pushing to Props

By now, you should have a better understanding of what Refract does:

*   It allows you to observe data sources ([React](./observing-react.md), [redux](./observing-redux), [anything else](./observing-anything.md))
*   It allows you to push data to an effect handler (see [handling effects](./handling-effects.md))

Refract has four built-in effect handlers, to:

*   Pass additional props to the child it wraps
*   Replace props
*   Call props
*   Render components

This section focuses on adding and replacing props, and its applications. All React, Preact and Inferno packages export two effect creators: `toProps` and `asProps`. They both take an object of props.

Note that by default, props passed to `toProps` and `asProps` won't be merged with previous values: to enable this behaviour, you need to set `mergeProps` to `true` in `withEffects` config.

## Adding Props

Any value emitted by your aperture which has been wrapped with `toProps` will cause the wrapped component to re-render with the additional provided props. Let's see a very simple example where a prop `doubledValue` is computed from a prop `value`:

```js
import React from 'react'
import { withEffects, toProps } from 'refract-rxjs'
import { map } from 'rxjs/operators'

const DoubleValue = ({ value, doubledValue }) => (
    <div>Two times {value} is {doubledValue}</button>
)

const aperture = (component, { initialCount }) => {
    return component.observe('value').pipe(map(value => toProps({
        doubledValue: 2 * value
    })))
}

export default withEffects(aperture)(DoubleValue)
```

## Replacing Props

`asProps` is used exactly like `toProps`, except that the provided props will be the only ones passed to the child component.

It allows you to fully control what props are passed through, and can result in performance benefits by controlling exactly when a component re-renders.

Essentially, `toProps` and `asProps` allow you to inject data into components, by using existing props or external data sources (sideways data loading).

## Calling Props

`toCallbck` is used to declaratively tell Refract to call your component's props with some data.

In the example below, every time the `value` prop changes, the stream debounces the value for one second, and then calls `props.onCommit` with the new value.

```js
import React from 'react'
import { withEffects, toCallback } from 'refract-rxjs'
import { debounceTime, map } from 'rxjs/operators'

const Input = props => <input {...props} />

const aperture = component =>
    component
        .observe('value')
        .pipe(debounceTime(1000), map(toCallback('onCommit')))

export const DebouncedInput = withEffects(aperture)(Input)
```

## Stateful Apertures

With the ability to set component props and to listen to events (with `pushEvent` and `component.fromEvent(name)`), comes the ability to handle state: events are the source of truth, and state is a projection of these events.

The example below is a simple counter example: each time a button is clicked, the count is incremented. We use a reducer to persist state between events, and pass it as props. It will sound familiar if you've used Redux: we go from events to state to props, the same way Redux (with `connect`) goes from actions to state to props (see [Replacing react-redux connect HoC](../recipes/replacing-connect.md]) recipe). Refract can be used to bind together state from multiple sources.

Note the use of `component.useEvent(eventName)` which returns a tuple containing the result of `fromEvent(eventName)` and `pushEvent(eventName)` (and the use of `startWith` to ensure the `addOne` prop is passed to the component on initial render).

```js
import React from 'react'
import { withEffects, toProps } from 'refract-rxjs'
import { scan, startWith, map } from 'rxjs/operators'

const Counter = ({ count, addOne }) => <button onClick={addOne}>{count}</button>

const aperture = (component, { initialCount }) => {
    const [addOneEvents$, addOne] = component.useEvent('addOne')

    return addOneEvents$.pipe(
        startWith({
            count: initialCount,
            addOne
        }),
        scan(({ count, ...props }) => ({
            ...props,
            count: count + 1
        })),
        map(toProps)
    )
}

export default withEffects(aperture)(Counter)
```
