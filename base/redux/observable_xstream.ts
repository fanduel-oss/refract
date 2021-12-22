import xs, { Stream, Listener } from 'xstream'
import dropRepeats from 'xstream/extra/dropRepeats'
import { Selector } from './baseTypes'

export interface StoreObserveFunction {
    <Type>(actionTypeOrListener: string | Selector<Type>): Stream<
        Type | unknown
    >
}

export const observeFactory = (store): StoreObserveFunction => {
    return <Type>(actionOrSelector) => {
        if (typeof actionOrSelector === 'string') {
            let unsubscribe

            return xs.create({
                start(listener: Partial<Listener<Type>>) {
                    unsubscribe = store.addActionListener(
                        actionOrSelector,
                        listener.next.bind(listener)
                    )
                },

                stop() {
                    unsubscribe()
                },
            })
        }

        if (typeof actionOrSelector === 'function') {
            return xs.from(store).map(actionOrSelector).compose(dropRepeats())
        }
    }
}
