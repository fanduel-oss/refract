import { compose, createStore } from 'redux'
import { refractEnhancer } from 'refract-redux-rxjs'

import reducers from './store'

let composeEnhancers = compose

if (process.env.NODE_ENV !== 'production') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
}

const store = createStore(reducers, {}, composeEnhancers(refractEnhancer()))

export default store
