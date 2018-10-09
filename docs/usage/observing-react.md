# Observing React, Preact and Inferno

> This document focuses on React, but the same applies to Inferno and Preact

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
                onChange={newValue =>
                    this.setState({
                        currentValue: newValue
                    })
                }
                {...otherProps}
            />
        )
    }
}
```

## Observing Props

Refract's `component.observe` function lets you observe your React props. It handles three different use cases: observing values, observing functions, and observing all props.

`component.observe` takes two optional arguments:

*   `propName` _(string)_: an optional string, the name of the prop which you wish to observe.
*   `propTransformer` _(function)_: an optional function to transform each received value of `propName`

```js
const aperture = initialProps => component => {
    const onChange$ = component.observe('onChange')
    const value$ = component.observe('value')
    /* create effects here */
}
```

When observing values, the returned stream is initialised with the current observed prop value. If you wish to only observe subsequent changes, you can "drop" the first value: search for a `drop` operator in the reactive programming library you use.

### Observing Values

Values are the primitive props you pass into your components: numbers, strings, booleans, objects, etc.

When the prop you observe is a value, `component.observe` will return a stream of this prop's values as it changes over time.

Refract emits new prop values only if they have changed. The change detection is done using reference equality `===` - if you need a different change detection mechanism (to exclude more values), it is easy to filter them using a `filter` operator.

For example, if we want to observe the `value` prop in our aperture, and only cause an effect when the new string is at least five characters long:

```js
const aperture = initialProps => component => {
    const value$ = component.observe('value')

    return value$.pipe(filter(string => string.length > 5))
}
```

Prop values can be transformed using the second argument of `observe`, and only distinct values returned by the transformer will be emitted by the returned observable. It is handy for observing nested values:

```js
const userName$ = component.observe('user', user => user.name)
```

### Observing Functions

Functions are the callbacks you pass into your components: any function which is passed as props, such as an onClick handler or a setState function.

When the prop you observe is a function, `component.observe` will return a stream which emits a new value each time your function is called. This value will be the first argument passed to the function.

For example, if we want to observe arguments passed to the `onChange` prop to achieve the same effect as above:

```js
const aperture = initialProps => component => {
    const onChange$ = component.observe('onChange')

    return onChange$.pipe(filter(string => string.length > 5))
}
```

This example does not significantly differ from the `value` example above (the stream won't be initialised with a value), but in more complex situations it can be extremely useful to observe arguments passed to callbacks in addition to values passed via props.

If you want to observe a function taking multiple args, you can provide a second argument to `observe`:

```js
const args$ = component.observe('myFunc', args => args)
// By default the first argument is pushed: args => args[0]
```

### Observing All Props

In some cases, within your `aperture` you might wish to use the current value of all your component's props. While this is possible via manually calling `component.observe('prop')` for each of the props you wish to include and then combining all of the resulting streams, this is a lot of setup for a simple feature.

Instead, when you do not specify a `propName`, `component.observe` will return a stream which emits a new object each time _any_ prop changes. This object will contain all of your component's props. _(note: change detection in this case is determined by React: withEffects is implemented as a PureComponent)_

For example, if you wanted to just send all props through to your `handler` every time one of them changes:

```js
const aperture = initialProps => component => component.observe()
```

## Observing Events

In some cases you might want to observe a particular event such as a click on an hyperlink, without having a prop to observe. You might also want to use Refract for all your application mutations and effects, without piggy backing on existing mutations.

`withEffects` injects a method `pushEvent` to your components, so you can inform Refract of events happening inside your components. We use a callback because we aim to offer a universal solution not tied to a specific renderer (web, native). That way we don't have to use refs or low-level platform-specific primitives.

### Pushing events

`pushEvent` is a curried function which takes an event name (`eventName`) and a value:

```js
function MyComponent({ pushEvent }) {
    return <button onClick={pushEvent('buttonClick')}>Click me!</button>
}
```

### Observing events

In your aperture, you can observe events by simply invoking `component.event`. It takes two arguments (second one is optional):

*   `eventName` _(string)_: an optional string, the name of the event which you wish to observe
*   `eventTransformer` _(function)_: an optional function to transform the value of each `eventName` event

```js
const aperture = initialProps => component => {
    const buttonClick$ = component.event('buttonClick')

    return buttonClick$.pipe(mapTo('Button clicked!'))
}
```

## Observing Lifecycle Events

The remaining two properties on the `component` object are `component.mount` and `component.unmount`.

These are streams which emit an event, like a signal, either when the component mounts or when the component unmounts.

### Observing Component Mount

`component.mount` is a stream which will emit a single value when a component mounts.

It can be useful to defer any logic until a component has been mounted.

```js
const aperture = initialProps => component => {
    const mount$ = component.mount

    return mount$.pipe(mapTo('Component mounted!'))
}
```

### Observing Component Unmount

`component.unmount` is a stream which will emit a single value when a component unmounts.

It can be useful to trigger side-effects when a component is about to be unmounted.

```js
const aperture = initialProps => component => {
    const unmount$ = component.unmount

    return unmount$.pipe(mapTo('Component unmounted!'))
}
```

## Combining Observations

Refract's API is designed so that you have complete, fine-grained control over your side-effects. You are encouraged to observe multiple props simultaneously (both values and functions) alongside lifecycle events.

By combining these observable sources with the power of reactive programming, you can build complex side-effect logic in a clear and declarative fashion.
