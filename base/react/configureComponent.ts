import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { PROPS_EFFECT } from './effects'
import {
    Listener,
    Subscription,
    createComponent,
    ObservableComponent,
    subscribeToSink,
    Aperture,
    createObservable
} from './observable'
import {
    shallowEquals,
    createEventData,
    createPropsData,
    createCallbackData,
    MOUNT_EVENT,
    UNMOUNT_EVENT
} from './data'

const configureComponent = <Props, Effect, Context>(
    aperture: Aperture<Props, Effect, Context>,
    instance: any,
    isValidElement: (val: any) => boolean = () => false,
    isComponentClass: (val: any) => boolean = () => false,
    handler?: Handler<Props, Effect, Context>,
    errorHandler?: ErrorHandler<Props>,
    mergeProps?: boolean,
    decorateProps?: boolean,
    componentName: string = 'unknown component'
) => {
    instance.state = {
        renderEffect: false,
        children: null,
        props: {}
    }

    const setState = state => {
        if (instance.unmounted) {
            return
        }

        if (instance.mounted) {
            instance.setState(state)
        } else if (typeof state === 'function') {
            instance.state = state(instance.state)
        } else {
            instance.state = {
                ...instance.state,
                ...state
            }
        }
    }

    const finalHandler = (initialProps, initialContext) => {
        const effectHandler = handler
            ? handler(initialProps, initialContext)
            : () => void 0

        return effect => {
            if (isValidElement(effect)) {
                setState({
                    renderEffect: true,
                    children: effect
                })
            } else if (effect && effect.type === PROPS_EFFECT) {
                const { payload } = effect

                if (mergeProps) {
                    setState(prev => ({
                        replace: payload.replace,
                        props: {
                            ...prev.props,
                            ...payload.props
                        }
                    }))
                } else {
                    setState({
                        replace: payload.replace,
                        props: payload.props
                    })
                }
            } else {
                effectHandler(effect)
            }
        }
    }

    const decoratedProps: Partial<Props> = {}

    let listeners: Array<Listener<any>> = []

    const addListener = listener => {
        listeners = listeners.concat(listener)
    }
    const removeListener = listener => {
        listeners = listeners.filter(l => l !== listener)
    }

    const pushEvent = (eventName: string) => (val?: any) => {
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

    if (decorateProps) {
        Object.keys(instance.props).forEach(propName => {
            if (typeof instance.props[propName] === 'function') {
                decorateProp(decoratedProps, instance.props[propName], propName)
            }
        })
    }

    const dataObservable = createObservable((listener: Listener<any>) => {
        addListener(listener)

        listener.next(createPropsData(instance.props))

        return { unsubscribe: () => removeListener(listener) }
    })

    const component: ObservableComponent = createComponent(
        propName => instance.props[propName],
        dataObservable,
        pushEvent as PushEvent,
        decorateProps
    )

    const sinkObservable = aperture(component, instance.props, instance.context)

    if (!sinkObservable) {
        throw new Error(
            `Your Refract aperture didn't return an observable entity in ${componentName} (component).`
        )
    }

    const sinkSubscription: Subscription = subscribeToSink<Effect>(
        sinkObservable,
        finalHandler(instance.props, instance.context),
        errorHandler
            ? errorHandler(instance.props, instance.context)
            : undefined
    )

    instance.reDecorateProps = nextProps => {
        if (decorateProps) {
            Object.keys(nextProps).forEach(propName => {
                if (
                    typeof instance.props[propName] === 'function' &&
                    nextProps[propName] !== instance.props[propName]
                ) {
                    decorateProp(decoratedProps, nextProps[propName], propName)
                }
            })
        }
    }

    instance.pushProps = (props: Props) => {
        listeners.forEach(listener => {
            listener.next(createPropsData(props))
        })
    }

    instance.triggerMount = () => {
        ;(pushEvent as PushEvent)(MOUNT_EVENT)()
    }

    instance.triggerUnmount = () => {
        ;(pushEvent as PushEvent)(UNMOUNT_EVENT)()
        sinkSubscription.unsubscribe()
    }

    instance.getChildProps = () => {
        const { state } = instance
        const stateProps = state.props

        if (state.replace === true) {
            return { ...stateProps, pushEvent }
        }

        const additionalProps = {
            ...(decoratedProps as object),
            pushEvent
        }

        if (state.replace === false) {
            return {
                ...instance.props,
                ...additionalProps,
                ...stateProps
            }
        }

        return {
            ...instance.props,
            ...additionalProps
        }
    }

    instance.havePropsChanged = (newProps, newState) => {
        const { state } = instance

        if (state.renderEffect || newState.renderEffect) {
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
