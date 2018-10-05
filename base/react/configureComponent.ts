import { Listeners, Handler, ErrorHandler, PushEvent } from './baseTypes'
import { PROPS_EFFECT } from './effects'
import {
    Subscription,
    createObservable,
    ObservableComponent,
    subscribeToSink,
    Aperture
} from './observable'

const shallowEquals = (left, right) =>
    left === right ||
    (Object.keys(left).length === Object.keys(right).length &&
        Object.keys(left).every(leftKey => left[leftKey] === right[leftKey]))

const configureComponent = <P, E>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (
    aperture: Aperture<P, E>,
    instance: any,
    isValidElement: (val: any) => boolean = () => false,
    isComponentClass: (val: any) => boolean = () => false
) => {
    instance.state = {
        children: null,
        props: {},
        decoratedProps: {}
    }

    const setState = state => {
        if (instance.unmounted) {
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
            if (isValidElement(effect)) {
                setState({
                    children: effect
                })
            } else if (effect && effect.type === PROPS_EFFECT) {
                const { payload } = effect

                setState({
                    replace: payload.replace,
                    props: payload.props,
                    decoratedProps: Object.keys(payload.props || {}).reduce(
                        (props, propName) => {
                            const prop = payload.props[propName]
                            const previousProp = instance.state.props[propName]

                            if (
                                typeof prop === 'function' &&
                                prop !== previousProp
                            ) {
                                decorateProp(props, prop, propName)
                            }

                            return props
                        },
                        {}
                    )
                })
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

    const decorateProp = (container, prop, propName) => {
        if (propName === 'children' || isComponentClass(prop)) {
            return
        }

        container[propName] = (...args) => {
            ;(listeners.fnProps[propName] || []).forEach(l => l.next(args[0]))

            return prop(...args)
        }
    }

    Object.keys(instance.props).forEach(propName => {
        if (typeof instance.props[propName] === 'function') {
            decorateProp(decoratedProps, instance.props[propName], propName)
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
        event: createEventObservable,
        pushEvent
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
                decorateProp(decoratedProps, nextProps[propName], propName)
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
        const { state } = instance
        const stateProps = {
            ...state.props,
            ...state.decoratedProps
        }

        if (state.replace === true) {
            return { ...stateProps, pushEvent }
        }

        const componentProps = {
            ...instance.props,
            ...(decoratedProps as object),
            pushEvent
        }

        if (state.replace === false) {
            return {
                ...componentProps,
                ...stateProps
            }
        }

        return componentProps
    }

    instance.havePropsChanged = (newProps, newState) => {
        const { state } = instance

        if (state.children || newState.children) {
            return state.children !== newState.children
        }

        const haveStatePropsChanged = !shallowEquals(
            state.props,
            newState.props
        )

        if (newState.replace === true) {
            return haveStatePropsChanged
        }

        const havePropsChanged = !shallowEquals(instance.props, newProps)

        if (newState.replace === false) {
            return havePropsChanged || haveStatePropsChanged
        }

        return havePropsChanged
    }
}

export default configureComponent
