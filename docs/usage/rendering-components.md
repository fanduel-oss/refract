# Rendering Components

Refract has built-in effect handlers:

*   To pass additional props, or replace props (see [Pushing to props](./pushing-to-props.md))
*   To render components

## Pushing Elements

Rendering components can be seen as the natural continuation of pushing props: instead of pushing props to a child component, we push elements! This effectively enables you to handle React in a fully reactive manner, from source to component.

Like with [Pushing to props](./pushing-to-props.md), it enables you to handle state by projecting it to components. Under the hood, Refract checks if a value emitted by your aperture is a valid element (React, Preact or Inferno) and renders it if it is.

The `BaseComponent` you supply to `withEffects` can be used as a placeholder (for example a loader) if your aperture doesn't synchronously emit an element to be rendered. If no base component is supplied, `null` will be rendered initially.

Below is the same counter example, pushing elements rather than props:

```js
import React from 'react'
import { withEffects } from 'refract-rxjs'
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
        map(Counter)
    )
}

export default withEffects(aperture)()
```
