import { createStore } from 'redux'
import { refractEnhancer } from '../../../../packages/refract-redux-xstream/src'

describe('refract-redux-xstream', () => {
    it('should work', () => {
        interface State {
            name: string
        }
        const reducer = (state = { name: 'refract' }, action) => state
        const store = createStore(reducer, {}, refractEnhancer<State>())
        const getName = (state: State): string => state.name

        const name$ = store.observe<string>(getName)
    })
})
