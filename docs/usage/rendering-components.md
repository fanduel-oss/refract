# Rendering Components

Refract has built-in effect handlers:

*   To pass additional props, or replace props (see [Pushing to props](./pushing-to-props))
*   To render components

## Pushing Elements

Rendering components can be seen as the natural continuation of pushing props: instead of pushing props to a child component, we push elements! This effectively enables you to handle React in a fully reactive manner, from source to component.

Like with [Pushing to props](./pushing-to-props), it enables you to handle state by projecting it to components. Under the hood, Refract checks if a value emitted by your aperture is a valid element (React, Preact or Inferno) and renders it if it is.

The `BaseComponent` you supply to `withEffects` can be used as a placeholder (for example a loader) if your aperture doesn't synchronously emit an element to be rendered. If no base component is supplied, `null` will be rendered initially.

Below is the same counter example, pushing elements rather than props:

```js
import React from 'react'
import { withEffects } from 'refract-rxjs'
import { reduce, map } from 'rxjs/operators'

const Counter = ({ count, addOne }) => <button onClick={addOne}>{count}</button>

const aperture = ({ initialCount }) => component => {
    const addOne = component.pushEvent('addOne')

    return component.fromEvent('addOne').pipe(
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
        map(Counter)
    )
}

const handler = () => () => {}

export default withEffects(handler)(aperture)()
```
