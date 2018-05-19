import { from, Stream, Subscriber as Listener } from 'most'
import $$observable from 'symbol-observable'
import { Selector } from './baseTypes'

export const observe = store => {
    const storeObservable = from(store)

    return <T>(actionOrSelector: string | Selector<T>): Stream<T> => {
        if (typeof actionOrSelector === 'string') {
            return from({
                subscribe(listener: Listener<T>) {
                    const unsubscribe = store.addActionListener(
                        actionOrSelector
                    )

                    return { unsubscribe }
                },
                [$$observable]() {
                    return this
                }
            })
        }

        if (typeof actionOrSelector === 'function') {
            return storeObservable.map(actionOrSelector).skipRepeats()
        }
    }
}
