import { from, Stream, Subscriber as Listener, of } from 'most'
import { Selector, createObservable } from './baseTypes'

export interface ObserveFn {
    <T>(actionTypeOrListener: string | Selector<T>): Stream<T>
}

export const observeFactory = (store): ObserveFn => {
    return <T>(actionOrSelector: string | Selector<T>): Stream<T> => {
        if (typeof actionOrSelector === 'string') {
            return from(
                createObservable((listener: Listener<T>) => {
                    const unsubscribe = store.addActionListener(
                        actionOrSelector,
                        listener.next.bind(listener)
                    )

                    return { unsubscribe }
                })
            )
        }

        if (typeof actionOrSelector === 'function') {
            return from(store)
                .map(actionOrSelector)
                .skipRepeats()
        }
    }
}
