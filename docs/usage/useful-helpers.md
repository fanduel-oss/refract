# Useful Helpers

_Maybe include some useful helper functions - if there are enough we could just put these in a `refract-utils` lib._

# Using `react-zap` to pass

_Link to zap repo, plus explain why this is helpful._

```js
const withEffects = (handler, errorHandler) => aperture => Component =>
    contextToProps(Consumer)(
        withEffects(handler, errorHandler)(aperture)(Component)
    )
```
