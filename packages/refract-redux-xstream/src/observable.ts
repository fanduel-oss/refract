import xs, { Stream, Listener } from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import { Selector, ObserveOptions } from './baseTypes'

export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        options: Partial<ObserveOptions>
    ): Stream<T>
}

export const observeFactory = (store): ObserveFn => {
    const storeObservable = xs.from(store)

    return <T>(
        actionOrSelector: string | Selector<T>,
        opts: Partial<ObserveOptions>
    ): Stream<T> => {
        const options: ObserveOptions = {
            initialValue: true,
            ...opts
        }
        if (typeof actionOrSelector === 'string') {
            let unsubscribe

            return xs.create({
                start(listener: Partial<Listener<T>>) {
                    unsubscribe = store.addActionListener(
                        listener.next.bind(listener)
                    )
                },

                stop() {
                    unsubscribe()
                }
            })
        }

        if (typeof actionOrSelector === 'function') {
            const selectorObservable = storeObservable.map(actionOrSelector)

            return options.initialValue
                ? selectorObservable
                      .startWith(actionOrSelector(store.getState()))
                      .compose(dropRepeats())
                : selectorObservable.compose(dropRepeats())
        }
    }
}
