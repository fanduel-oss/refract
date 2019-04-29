import { from, Stream, Subscriber as Listener } from 'most'
import $$observable from 'symbol-observable'
import { Selector } from './baseTypes'

export interface StoreObserveFunction {
    <Type>(actionTypeOrListener: string | Selector<Type>): Stream<Type>
}

export const observeFactory = (store): StoreObserveFunction => {
    return <Type>(actionOrSelector: string | Selector<Type>): Stream<Type> => {
        if (typeof actionOrSelector === 'string') {
            return from({
                subscribe(listener: Listener<Type>) {
                    const unsubscribe = store.addActionListener(
                        actionOrSelector,
                        listener.next.bind(listener)
                    )

                    return { unsubscribe }
                },
                [$$observable]() {
                    return this
                }
            })
        }

        if (typeof actionOrSelector === 'function') {
            return from(store)
                .map(actionOrSelector)
                .skipRepeats()
        }
    }
}
