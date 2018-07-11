# refractEnhancer

Used to enhance a Redux store, adding observable functionality which can be used inside Refract.

## Packages

`refractEnhancer` is provided by our Redux packages - `refract-redux-callbag`, `refract-redux-most`, `refract-redux-rxjs`, and `refract-redux-xstream`.

## Signature

```js
refractEnhancer = (options?) => {
    return StoreCreator
}
```

## Arguments

1. `options` _(object)_: an object which configures the Refract store enhancer.

    Currently, `refractEnhancer` only supports one option:

    * `eventsPrefix` _(string)_: defines an actionType prefix which marks actions which are _not_ intended to be forwarded to your reducers. Refract will intercept these, preventing them from touching your state, but will forward them on to any watching apertures. (default: `@@event/`)

## Returns

`StoreCreator` _(Redux store creator)_: a function which creates a redux store. Note that you should not be calling this function directly, and instead should be passing it into Redux `createStore`.

## Example

```js
import { createStore } from 'redux'
import { refractEnhancer } from 'refract-redux-rxjs'
import rootReducer from './reducers'
​
export default function configureStore() {
    const store = createStore(rootReducer, null, refractEnhancer())
    ​
    return store
}
```

[Read more about configuring your Redux store here!](https://redux.js.org/recipes/configuring-your-store)
