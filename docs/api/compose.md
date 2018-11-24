# compose

Used for composing functions from right to left, it is a very useful utility for composing higher-order components in React, Inferno or Preact.

## Packages

`compose` is provided by our React, Inferno or Preact packages - `refract-*`, `refract-inferno-*`, `refract-preact-*`.

## Signature

`compose` will compose multiple function to create a function which takes a single argument.

```js
compose = (...functions) => arg => result
```

Using `compose` with three functions `f`, `g` and `h` is the equivalent of `arg => f(g(h(arg)))`

## Example

```js
import { connect } from 'react-redux'
import { withEffects, compose } from 'refract-rxjs'

const WrappedComponent = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withEffects(aperture)
)(BaseComponent)
```
