# Dependencies

Refract lets you inject your own dependencies, such as your Redux store, your router, your API, and so on.

To expose any dependencies for use inside Refract, you simply pass them as props into any component wrapped with the `withEffects` higher-order component.

_Include examples_

_Also explain how and why the store needs to be exposed, note that this is likely to change in future when Redux moves to React new context API._

## Recommendation: Use `react-zap`

We recommend using `react-zap` for easy dependency injection via React's new context API. To see an in-depth example of how to do this, take a look at our [dependency injection recipe](../recipes/dependency-injection.md)
