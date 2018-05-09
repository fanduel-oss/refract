import * as React from 'react'

import {
    Listener,
    Subscription,
    PropListeners,
    Listeners,
    EffectHandler
} from './baseTypes'
import {
    createObservable,
    ObservableComponent,
    toSubscribable,
    EffectFactory
} from './observable'

export const withEffects = <P, E>(effectHandler: EffectHandler<P, E>) => (
    effectFactory: EffectFactory<P, E>
) => (BaseComponent: React.ComponentType<P>): React.ComponentType<P> => {
    class WithEffects extends React.Component<P> {
        private listeners: Listeners
        private modifiedProps: object
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
                this.listeners.mount = this.listeners.mount.concat(listener)

                return () => this.listeners.mount.filter(l => l !== listener)
            })

            const createPropObservable = <T>(propName: string) =>
                typeof this.props[propName] === 'function'
                    ? createObservable<T>(listener => {
                          this.modifiedProps[propName] = (...args) => {
                              listener.next(args[0])

                              return (this.modifiedProps[propName] ||
                                  this.props[propName])(...args)
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

            this.sinkSubscription = toSubscribable<E>(sinkObservable).subscribe(
                {
                    next: effectHandler(this.props)
                }
            )
        }

        public componentDidMount() {
            this.listeners.mount.forEach(l => l.next())
        }

        public componentDidUpdate(prevProps) {
            Object.keys(this.listeners.props).forEach(propName => {
                const prop = this.props[propName]

                if (prevProps[propName] !== prop) {
                    this.listeners.props[propName].forEach(l => l.next(prop))
                }
            })
        }

        public componentWillUnmount() {
            this.listeners.unmount.forEach(l => l.next())
            this.sinkSubscription.unsubscribe()
        }

        public render() {
            return React.createElement(BaseComponent, this.props)
        }
    }

    return WithEffects
}
