import { Listeners, Handler, ErrorHandler, PushEvent } from './baseTypes'
import { PROPS_EFFECT } from './effects'
import {
    Subscription,
    createObservable,
    ObservableComponent,
    subscribeToSink,
    Aperture
} from './observable'

const configureComponent = <P, E>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (aperture: Aperture<P, E>, instance: any) => {
    instance.state = {
        children: null
    }

    const setState = state => {
        if (!instance.unmounted) {
            return
        }
        if (instance.mounted) {
            instance.setState(state)
        } else {
            instance.state = state
        }
    }

    const finalHandler = initialProps => {
        const effectHandler = handler(initialProps)

        return effect => {
            if (effect && effect.type === PROPS_EFFECT) {
                setState(effect.payload)
            } else {
                effectHandler(effect)
            }
        }
    }

    const listeners: Listeners = {
        mount: [],
        unmount: [],
        allProps: [],
        props: {},
        fnProps: {},
        event: {}
    }
    const decoratedProps: Partial<P> = {}
    const pushEvent: PushEvent = (eventName: string) => <T>(val: T) => {
        ;(listeners.event[eventName] || []).forEach(listener =>
            listener.next(val)
        )
    }

    const decorateProp = (prop, propName) => {
        if (propName === 'children') {
            return
        }

        decoratedProps[propName] = (...args) => {
            ;(listeners.fnProps[propName] || []).forEach(l => l.next(args[0]))

            return prop(...args)
        }
    }

    Object.keys(instance.props).forEach(propName => {
        if (typeof instance.props[propName] === 'function') {
            decorateProp(instance.props[propName], propName)
        }
    })

    const mountObservable = createObservable<any>(listener => {
        listeners.mount = listeners.mount.concat(listener)

        return () => listeners.mount.filter(l => l !== listener)
    })

    const unmountObservable = createObservable<any>(listener => {
        listeners.unmount = listeners.unmount.concat(listener)

        return () => listeners.unmount.filter(l => l !== listener)
    })

    const createPropObservable = <T>(propName?: string) => {
        const listenerType = propName
            ? typeof instance.props[propName] === 'function'
                ? 'fnProps'
                : 'props'
            : 'allProps'

        return createObservable<T>(listener => {
            if (listenerType === 'allProps') {
                listener.next(instance.props)

                listeners.allProps = listeners.allProps.concat(listener)

                return () => {
                    listeners.allProps.filter(l => l !== listener)
                }
            }

            if (listenerType === 'props') {
                listener.next(instance.props[propName])
            }

            listeners[listenerType][propName] = (
                listeners[listenerType][propName] || []
            ).concat(listener)

            return () => {
                listeners[listenerType][propName].filter(l => l !== listener)
            }
        })
    }

    const createEventObservable = <T>(eventName: string) => {
        return createObservable<T>(listener => {
            listeners.event[eventName] = (
                listeners.event[eventName] || []
            ).concat(listener)

            return () => {
                listeners.event[eventName].filter(l => l !== listener)
            }
        })
    }

    const component: ObservableComponent = {
        mount: mountObservable,
        unmount: unmountObservable,
        observe: createPropObservable,
        event: createEventObservable
    }

    const sinkObservable = aperture(instance.props)(component)

    const sinkSubscription: Subscription = subscribeToSink<E>(
        sinkObservable,
        finalHandler(instance.props),
        errorHandler ? errorHandler(instance.props) : undefined
    )

    const sendNext = (prevProps?: P) => {
        Object.keys(listeners.props).forEach(propName => {
            const prop = instance.props[propName]

            if (!prevProps || prevProps[propName] !== prop) {
                listeners.props[propName].forEach(l => l.next(prop))
            }
        })

        listeners.allProps.forEach(l => l.next(instance.props))
    }

    instance.reDecorateProps = nextProps => {
        Object.keys(nextProps).forEach(propName => {
            if (
                typeof instance.props[propName] === 'function' &&
                nextProps[propName] !== instance.props[propName]
            ) {
                decorateProp(nextProps[propName], propName)
            }
        })
    }

    instance.pushProps = prevProps => {
        sendNext(prevProps)
    }

    instance.triggerMount = () => {
        listeners.mount.forEach(l => l.next(undefined))
    }

    instance.triggerUnmount = () => {
        listeners.unmount.forEach(l => l.next(undefined))
        sinkSubscription.unsubscribe()
    }

    instance.getChildProps = () => {
        const { props = {}, replace } = instance.state

        if (replace === true) {
            return Object.assign({}, props, {
                pushEvent
            })
        } else if (replace === false) {
            return Object.assign({}, instance.props, decoratedProps, props, {
                pushEvent
            })
        }

        return Object.assign({}, instance.props, decoratedProps, {
            pushEvent
        })
    }
}

export default configureComponent
