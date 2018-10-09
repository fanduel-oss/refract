import $$observable from 'symbol-observable'
import { Listeners, Handler, ErrorHandler, PushEvent } from './baseTypes'
import { PROPS_EFFECT } from './effects'
import {
    Listener,
    Subscription,
    createComponent,
    ObservableComponent,
    subscribeToSink,
    Aperture
} from './observable'
import {
    shallowEquals,
    createEventData,
    createPropsData,
    createCallbackData,
    MOUNT_EVENT,
    UNMOUNT_EVENT
} from './data'

const identity = _ => _
const selectFirstArg = args => args[0]

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

    const decoratedProps: Partial<P> = {}

    let listeners: Array<Listener<any>> = []

    const addListener = listener => {
        listeners = listeners.concat(listener)
    }
    const removeListener = listener => {
        listeners = listeners.filter(l => l !== listener)
    }

    const pushEvent: PushEvent = (eventName: string) => <T>(val: T) => {
        listeners.forEach(listener => {
            listener.next(createEventData(eventName, val))
        })
    }

    const decorateProp = (container, prop, propName) => {
        if (propName === 'children' || isComponentClass(prop)) {
            return
        }

        container[propName] = (...args) => {
            listeners.forEach(listener => {
                listener.next(createCallbackData(propName, args))
            })

            return prop(...args)
        }
    }

    Object.keys(instance.props).forEach(propName => {
        if (typeof instance.props[propName] === 'function') {
            decorateProp(decoratedProps, instance.props[propName], propName)
        }
    })

    const dataObservable = {
        subscribe(listener: Listener<any>) {
            addListener(listener)

            listener.next(createPropsData(instance.props))

            return { unsubscribe: () => removeListener(listener) }
        },
        [$$observable]() {
            return this
        }
    }

    const component: ObservableComponent = createComponent(
        instance,
        dataObservable,
        pushEvent
    )

    const sinkObservable = aperture(instance.props)(component)

    const sinkSubscription: Subscription = subscribeToSink<E>(
        sinkObservable,
        finalHandler(instance.props),
        errorHandler ? errorHandler(instance.props) : undefined
    )

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

    instance.pushProps = (props: P) => {
        listeners.forEach(listener => {
            listener.next(createPropsData(props))
        })
    }

    instance.triggerMount = () => {
        pushEvent(MOUNT_EVENT)(undefined)
    }

    instance.triggerUnmount = () => {
        pushEvent(UNMOUNT_EVENT)(undefined)
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
