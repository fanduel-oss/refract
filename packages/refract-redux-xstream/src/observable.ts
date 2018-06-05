import xs, { Stream, Listener } from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import { Selector } from './baseTypes'

export interface ObserveFn {
    <T>(
        actionTypeOrListener: string | Selector<T>,
        withInitialValue?: boolean
    ): Stream<T>
}

export const observeFactory = (store): ObserveFn => {
    const storeObservable = xs.from(store)

    return <T>(actionOrSelector: string | Selector<T>): Stream<T> => {
        if (typeof actionOrSelector === 'string') {
            let unsubscribe

            return xs.create({
                start(listener: Partial<Listener<T>>) {
                    unsubscribe = store.addActionListener(
                        actionOrSelector,
                        listener.next.bind(listener)
                    )
                },

                stop() {
                    unsubscribe()
                }
            })
        }

        if (typeof actionOrSelector === 'function') {
            return storeObservable.map(actionOrSelector).compose(dropRepeats())
        }
    }
}
