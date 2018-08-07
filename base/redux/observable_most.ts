import { from, Stream, Subscriber as Listener } from 'most'
import $$observable from 'symbol-observable'
import { Selector } from './baseTypes'

export interface ObserveFn {
    <T>(actionTypeOrListener: string | Selector<T>): Stream<T>
}

export const observeFactory = (store): ObserveFn => {
    const storeObservable = from(store)

    return <T>(actionOrSelector: string | Selector<T>): Stream<T> => {
        if (typeof actionOrSelector === 'string') {
            return from({
                subscribe(listener: Listener<T>) {
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
            return storeObservable
                .map(actionOrSelector)
                .startWith(actionOrSelector(store.getState()))
                .skipRepeats()
        }
    }
}
