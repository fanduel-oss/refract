import { from, Stream, Subscriber as Listener } from 'most'
import $$observable from 'symbol-observable'
import { Selector, ObserveOptions } from './baseTypes'

export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        options?: Partial<ObserveOptions>
    ): Stream<T>
}

export const observeFactory = (store): ObserveFn => {
    const storeObservable = from(store)

    return <T>(
        actionOrSelector: string | Selector<T>,
        opts?: Partial<ObserveOptions>
    ): Stream<T> => {
        const options: ObserveOptions = {
            initialValue: true,
            ...opts
        }

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
            const observable = storeObservable.map(actionOrSelector)

            return options.initialValue
                ? observable
                      .startWith(actionOrSelector(store.getState()))
                      .skipRepeats()
                : observable.skipRepeats()
        }
    }
}
