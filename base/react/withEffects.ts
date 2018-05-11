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
        private modifiedProps: object = {}
        private component: ObservableComponent
        private sinkSubscription: Subscription

        constructor(props: any, context: any) {
            super(props, context)

            this.listeners = {
                mount: [],
                unmount: [],
                props: {}
            }

            const mountObservable = createObservable<any>(listener => {
                this.listeners.mount = this.listeners.mount.concat(listener)

                return () => this.listeners.mount.filter(l => l !== listener)
            })

            const unmountObservable = createObservable<any>(listener => {
                this.listeners.unmount = this.listeners.unmount.concat(listener)

                return () => this.listeners.unmount.filter(l => l !== listener)
            })

            const createPropObservable = <T>(propName: string) =>
                typeof this.props[propName] === 'function'
                    ? createObservable<T>(listener => {
                          const initialProp =
                              this.modifiedProps[propName] ||
                              this.props[propName]

                          this.modifiedProps[propName] = (...args) => {
                              listener.next(args[0])

                              return initialProp(...args)
                          }

                          return () => {
                              this.modifiedProps[propName] = this.props[
                                  propName
                              ]
                          }
                      })
                    : createObservable<T>(listener => {
                          this.listeners.props[propName] = (
                              this.listeners.props[propName] || []
                          ).concat(listener)

                          return () => {
                              this.listeners.props[propName].filter(
                                  l => l !== listener
                              )
                          }
                      })

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
                Object.assign({}, this.props, this.modifiedProps)
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
    }
