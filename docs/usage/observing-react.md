# Observing React

Refract exposes an object called `component` as your `aperture`'s second argument, which allows you to cause side-effects in response to changes within your React app.

```js
const aperture = initialProps => component => {
    /* ... */
}
```

This `component` object contains three properties: `observe`, `mount`, and `unmount`. The `observe` property is a function which let you observe your React props. The `mount` and `unmount` properties are streams which let you observe your React component's lifecycle.

## Example

The explanations below are all based on changing the `aperture` in the following example to observe different things:

```js
const Input = ({ value, onChange }) => (
    <input value={value} onChange={onChange} />
)

const InputWithEffects = withEffects(handler)(aperture)(Input)

class Container extends Component {
    state = { currentvalue: '' }

    render() {
        return (
            <InputWithEffects
                value={this.state.currentValue}
                onChange={(newValue) => this.setState({
                    currentValue: newValue
                })}
            />
        )
    }
}
```

## Observing Props

Refract's `component.observe` function lets you observe your React props. It handles two different use cases: observing values, and observing functions.

`component.observe` takes one required argument, plus an optional second argument:

*   `propName` _(string)_: the name of the prop which you wish to observe.
*   `options` _(object)_: an object which alters the stream returned by `component.observe`.

    Available options:

    *   `initialValue` _(boolean)_: specifies whether the stream should be initialised with the current observed prop value (default: `true`).

```js
const aperture = initialProps => component => {
    const onChange$ = component.observe('onChange')
    const value$ = component.observe('value', { initialValue: false })
    /* create effects here */
}
```

_(Note: those variables have a $ sign after them to signify that they are streams. If you're unfamiliar with streams, we recommend reading Andre Staltz's [The introduction to Reactive Programming you've been missing](https://gist.github.com/staltz/868e7e9bc2a7b8c1f754))_

### Observing Values

Values are the primitive props you pass into your components: numbers, strings, booleans, objects, etc.

When the prop you observe is a value, `component.observe` will return a stream of this prop's values as it changes over time.

Refract emits new prop values only if they have changed. The change detection is done using reference equality `===` - if you need a different change detection mechanism (to exclude more values), it is easy to filter them using a `filter` operator.

For example, if we want to observe the `value` prop in our aperture, and only cause an effect when the new string is at least five characters long:

```js
const aperture = initialProps => component => {
    const value$ = component.observe('value')

    return value$.pipe(
        filter(string => string.length > 5)
    )
}
```

### Observing Functions

Functions are the callbacks you pass into your components: any function which is passed as props, such as an onClick handler or a setState function.

When the prop you observe is a function, `component.observe` will return a stream which emits a new value each time your function is called. This value will be the first argument passed to the function.

For example, if we want to observe arguments passed to the `onChange` prop to achieve the same effect as above:

```js
const aperture = initialProps => component => {
    const onChange$ = component.observe('onChange')

    return onChange$.pipe(
        filter(string => string.length > 5)
    )
}
```

This example does not significantly differ from the `value` example above, but in more complex situations it can be extremely useful to observe arguments passed to callbacks in addition to values passed via props.

In the case of function props, the `initialValue` option is not applicable.

## Observing Lifecycle Events

The remaining two properties on the `component` object are `component.mount` and `component.unmount`.

These are streams which emit an event, like a signal, either when the component mounts or when the component unmounts.

### Observing Component Mount

`component.mount` is a stream which will emit a single value when a component mounts.

It can be useful to defer any logic until a component has been mounted.

```js
const aperture = initialProps => component => {
    const mount$ = component.mount

    return mount$.pipe(
        mapTo('Component mounted!')
    )
}
```

### Observing Component Unmount

`component.unmount` is a stream which will emit a single value when a component unmounts.

It can be useful to trigger side-effects when a component is about to be unmounted.

```js
const aperture = initialProps => component => {
    const unmount$ = component.unmount

    return unmount$.pipe(
        mapTo('Component unmounted!')
    )
}
```

## Combining Observations

Refract's API is designed so that you have complete, fine-grained control over your side-effects. You are encouraged to observe multiple props simultaneously (both values and functions) alongside lifecycle events.

By combining these observable sources with the power of reactive programming, you can build complex side-effect logic in a clear and declarative fashion.
