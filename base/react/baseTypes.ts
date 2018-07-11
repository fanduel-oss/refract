import { Listener } from './observable'

export interface PropListeners {
    [key: string]: Array<Partial<Listener<any>>>
}

export interface Listeners {
    mount: Array<Partial<Listener<any>>>
    unmount: Array<Partial<Listener<any>>>
    props: PropListeners
    fnProps: PropListeners
}

export type Handler<P, E> = (intialProps: P) => (val: E) => void

export interface ObserveOptions {
    initialValue: boolean
}
