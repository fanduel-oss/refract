import * as React from 'react'

import { PropListeners, Listeners, EffectHandler } from './baseTypes'
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
    class WithEffects extends React.Component<P> {
        private listeners: Listeners
        private decoratedProps: Partial<P> = {}
        private component: ObservableComponent
        private sinkSubscription: Subscription

        constructor(props: any, context: any) {
            super(props, context)

            this.listeners = {
                mount: [],
                unmount: [],
                props: {},
                fnProps: {}
            }

            this.decoratedProps = Object.keys(props).reduce(
                (decoratedProps, propName) => {
                    const prop = props[propName]

                    if (typeof prop === 'function') {
                        decoratedProps[propName] = this.decorateProp(
                            prop,
                            propName
                        )
                    }

                    return decoratedProps
                },
                {}
            )

            const mountObservable = createObservable<any>(listener => {
                this.listeners.mount = this.listeners.mount.concat(listener)

                return () => this.listeners.mount.filter(l => l !== listener)
            })

            const unmountObservable = createObservable<any>(listener => {
                this.listeners.unmount = this.listeners.unmount.concat(listener)

                return () => this.listeners.unmount.filter(l => l !== listener)
            })

            const createPropObservable = <T>(propName: string) => {
                const listenerType =
                    typeof this.props[propName] === 'function'
                        ? 'fnProps'
                        : 'props'

                return createObservable<T>(listener => {
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
                observe: <T>(propName: string) =>
                    createPropObservable<T>(propName)
            }

            const sinkObservable = effectFactory(this.props)(this.component)

            this.sinkSubscription = subscribeToSink<E>(
                sinkObservable,
                effectHandler(this.props),
                errorHandler
            )

            this.sendNext()
        }

        public componentDidMount() {
            this.listeners.mount.forEach(l => l.next(undefined))
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
        }

        private decorateProp(prop, propName) {
            return (...args) => {
                const listeners = this.listeners.fnProps[propName] || []

                listeners.forEach(l => l.next(args[0]))

                return prop(...args)
            }
        }
    }
