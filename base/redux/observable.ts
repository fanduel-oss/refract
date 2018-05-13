import { from, Observable, PartialObserver as Listener } from 'rxjs'
import { map, distinctUntilChanged } from 'rxjs/operators'
import { Selector } from './baseTypes'

export const observe = store => {
    const storeObservable = from(store)

    return <T>(actionOrSelector: string | Selector<T>): Observable<T> => {
        if (typeof actionOrSelector === 'string') {
            return Observable.create((Listener: Partial<Listener<T>>) => {
                const unsubscribe = store.addActionListener(actionOrSelector)

                return unsubscribe
            })
        }

        if (typeof actionOrSelector === 'function') {
            return storeObservable.pipe(
                map(actionOrSelector),
                distinctUntilChanged()
            )
        }
    }
}
