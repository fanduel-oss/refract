import { createStore, combineReducers } from 'redux'
import { refractEnhancer } from '../../../../packages/refract-redux-rxjs/src'

describe('refract-redux-rxjs', () => {
    interface State {
        name: string
    }
    const NAME = 'NAME'
    const nameActionCreator = name => ({
        type: NAME,
        payload: name
    })
    const nameReducer = (state = '', action) => {
        if (action.type === NAME) {
            return action.payload
        }

        return state
    }
    const getName = (state: State): string => state.name

    it('should work', () => {
        interface State {
            name: string
        }
        const store = createStore(
            combineReducers({
                name: nameReducer
            }),
            {},
            refractEnhancer<State>()
        )

        const nextName = jest.fn()
        const nextNameAction = jest.fn()

        const nameSubscription = store.observe<string>(getName).subscribe({
            next: nextName
        })
        const nameActionSubscription = store.observe<string>(NAME).subscribe({
            next: nextNameAction
        })

        expect(nextNameAction).not.toHaveBeenCalled()
        expect(nextName).toHaveBeenCalledTimes(1)
        expect(nextName).toHaveBeenCalledWith('')

        store.dispatch(nameActionCreator('Alfred'))

        expect(nextNameAction).toHaveBeenCalledTimes(1)
        expect(nextNameAction).toHaveBeenCalledWith({
            type: NAME,
            payload: 'Alfred'
        })
        expect(nextName).toHaveBeenCalledTimes(2)
        expect(nextName).toHaveBeenCalledWith('Alfred')

        nameSubscription.unsubscribe()
        nameActionSubscription.unsubscribe()

        store.dispatch(nameActionCreator('Jose'))

        expect(nextNameAction).toHaveBeenCalledTimes(1)
        expect(nextName).toHaveBeenCalledTimes(2)
    })
})
