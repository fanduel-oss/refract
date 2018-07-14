import * as React from 'react'

import {
    PropListeners,
    Listeners,
    EffectHandler,
    ObserveOptions
} from './baseTypes'
import {
    Subscription,
    Listener,
    createObservable,
    ObservableComponent,
    subscribeToSink,
    EffectFactory
} from './observable'

export const withEffects = <P, E>(
    effectHandler: EffectHandler<P, E>,
    errorHandler?: (err: any) => void
) => (effectFactory: EffectFactory<P, E>) => (
    BaseComponent: React.ComponentType<P>
): React.ComponentClass<P> =>
    class WithEffects extends React.PureComponent<P> {
        private listeners: Listeners
        private decoratedProps: Partial<P> = {}
        private component: ObservableComponent
        private sinkSubscription: Subscription

        constructor(props: any, context: any) {
            super(props, context)

            this.listeners = {
                mount: [],
                unmount: [],
                allProps: [],
                props: {},
                fnProps: {}
            }

            Object.keys(props).forEach(propName => {
                const prop = props[propName]

                if (typeof prop === 'function') {
                    this.decorateProp(prop, propName)
                }
            })

            const mountObservable = createObservable<any>(listener => {
                this.listeners.mount = this.listeners.mount.concat(listener)

                return () => this.listeners.mount.filter(l => l !== listener)
            })

            const unmountObservable = createObservable<any>(listener => {
                this.listeners.unmount = this.listeners.unmount.concat(listener)

                return () => this.listeners.unmount.filter(l => l !== listener)
            })

            const createPropObservable = <T>(
                propName: string,
                opts: Partial<ObserveOptions>
            ) => {
                const options: ObserveOptions = {
                    initialValue: true,
                    ...opts
                }
                const listenerType = propName
                    ? typeof this.props[propName] === 'function'
                        ? 'fnProps'
                        : 'props'
                    : 'allProps'

                return createObservable<T>(listener => {
                    if (options.initialValue) {
                        if (listenerType === 'props') {
                            listener.next(this.props[propName])
                        }

                        if (listenerType === 'allProps') {
                            listener.next(this.props)
                        }
                    }

                    if (listenerType === 'allProps') {
                        this.listeners.allProps.concat(listener)

                        return () => {
                            this.listeners.allProps.filter(l => l !== listener)
                        }
                    }

                    this.listeners[listenerType][propName] = (
                        this.listeners[listenerType][propName] || []
                    ).concat(listener)

                    return () => {
                        this.listeners[listenerType][propName].filter(
                            l => l !== listener
                        )
                    }
                })
            }

            this.component = {
                mount: mountObservable,
                unmount: unmountObservable,
                observe: <T>(
                    propName: string,
                    options: Partial<ObserveOptions>
                ) => createPropObservable<T>(propName, options)
            }

            const sinkObservable = effectFactory(this.props)(this.component)

            this.sinkSubscription = subscribeToSink<E>(
                sinkObservable,
                effectHandler(this.props),
                errorHandler
            )
        }

        public componentDidMount() {
            this.listeners.mount.forEach(l => l.next(undefined))
        }

        public componentWillReceiveProps(nextProps) {
            // Note: this will be replaced by getDerivedStateFromProps
            // but for now, we want to support React < 16.3.0
            Object.keys(nextProps).forEach(propName => {
                if (
                    typeof this.props[propName] === 'function' &&
                    nextProps[propName] !== this.props[propName]
                ) {
                    this.decorateProp(nextProps[propName], propName)
                }
            })
        }

        public componentDidUpdate(prevProps: P) {
            this.sendNext(prevProps)
        }

        public componentWillUnmount() {
            this.listeners.unmount.forEach(l => l.next(undefined))
            this.sinkSubscription.unsubscribe()
        }

        public render() {
            return React.createElement(
                BaseComponent,
                Object.assign({}, this.props, this.decoratedProps)
            )
        }

        private sendNext(prevProps?: P) {
            Object.keys(this.listeners.props).forEach(propName => {
                const prop = this.props[propName]

                if (!prevProps || prevProps[propName] !== prop) {
                    this.listeners.props[propName].forEach(l => l.next(prop))
                }
            })

            if (this.listeners.allProps.length) {
                this.listeners.allProps.forEach(l => l.next(this.props))
            }
        }

        private decorateProp(prop, propName) {
            this.decoratedProps[propName] = (...args) => {
                const listeners = this.listeners.fnProps[propName] || []

                listeners.forEach(l => l.next(args[0]))

                return prop(...args)
            }
        }
    }
