# Connecting To React

## Background

Refract builds upon two ideas which have been embraced by the React community: `separating presentational and container components`, plus `higher-order components` (hocs).

If you're unfamiliar with these concepts, the best places to start are [`Dan Abramov's article explaining presentational/container components`](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), and the [`React documentation page explaining hocs`](https://reactjs.org/docs/higher-order-components.html). These concepts are important, and will help you build more scalable applications, so don't skip those links!

## Where Refract Belongs

The key insight behind presentational/container components is that your application's `state` and its `view` should be separated. In React, your state is typically passed into your view as props.

Refract sits between your state and your view, allowing you to observe the changes to those props over time. To achieve this, you simply wrap your view with Refract's `withEffects` higher-order component.

For example, given a simple view component:

```js
const Counter = ({ count, increment }) => (
    <button onClick={increment}>Count: {count}</button>
)
```

If we want to cause side-effects in response to changes in the props being passed into our `Counter`, we use `withEffects` to create an enhanced version of the component:

```js
import { withEffects } from 'refract-rxjs'

const CounterWithEffects = withEffects(handler)(aperture)(Counter)
```

This new `CounterWithEffects` component now includes the side-effect logic included in our `handler` and `aperture` (which we will explore shortly), and renders the original `Counter` presentational component unaltered. It can be used just like any other component:

```js
class Container extends Component {
    state = { count: 0 }

    increment = () => this.setState(
        ({ count }) => ({ count: count + 1 })
    )

    render() {
        return (
            <CounterWithEffects
                count={this.state.count}
                increment={this.increment}
            />
        )
    }
}
```

[Now we're ready to observe changes inside React!](observing-react.md)
