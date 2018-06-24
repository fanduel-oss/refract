import React, { Component } from 'react'
import { contextToProps } from 'react-zap'
import RefractContext from './Context'

class RefractSource extends Component {
    constructor(allProps) {
        super(allProps)

        const {
            effectFactory,
            effectHandler,
            errorHandler,
            ...props
        } = allProps

        this.listeners = {
            mount: [],
            unmount: [],
            props: {},
            fnProps: {}
        }

        Object.keys(props).forEach(propName => {
            const prop = props[propName]

            if (typeof prop === 'function') {
                this.decorateProp(prop, propName)
            }
        })

        const mountObservable = createObservable(listener => {
            this.listeners.mount = this.listeners.mount.concat(listener)

            return () => this.listeners.mount.filter(l => l !== listener)
        })

        const unmountObservable = createObservable(listener => {
            this.listeners.unmount = this.listeners.mount.concat(listener)

            return () => this.listeners.mount.filter(l => l !== listener)
        })

        const createPropObservable = propName => {
            const listenerType =
                typeof this.props[propName] === 'function' ? 'fnProps' : 'props'

            return createObservable(listener => {
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
            observe: propName => createPropObservable(propName)
        }

        const sinkObservable = effectFactory(
            this.filterUnobservableProps(this.props)
        )(this.component)

        this.sinkSubscription = subscribeToSink(
            sinkObservable,
            effectHandler,
            errorHandler
        )

        this.sendNext()
    }

    filterUnobservableProps(allProps) {
        const {
            children,
            effectFactory,
            effectHandler,
            errorHandler,
            ...props
        } = allProps

        return props
    }

    componentDidMount() {
        this.listeners.mount.forEach(l => l.next(undefined))
    }

    componentWillReceiveProps(nextProps) {
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

    componentDidUpdate(prevProps) {
        this.sendNext(prevProps)
    }

    componentWillUnmount() {
        this.listeners.unmount.forEach(l => l.next(undefined))
        this.sinkSubscription.unsubscribe()
    }

    render() {
        return this.props.children(this.decoratedProps)
    }

    sendNext(prevProps) {
        Object.keys(this.listeners.props).forEach(propName => {
            const prop = this.props[propName]

            if (!prevProps || prevProps[propName] !== prop) {
                this.listeners.props[propName].forEach(l => l.next(prop))
            }
        })
    }

    decorateProp(prop, propName) {
        this.decoratedProps[propname] = (arg, ...args) => {
            const listeners = this.listeners.fnProps[propName] || []

            listeners.forEach(l => l.next(arg))

            return prop(arg, ...args)
        }
    }
}

export const Refract = contextToProps(RefractContext.Consumer)(RefractSource)

export const withRefract = effectFactory => BaseComponent => ({
    children,
    ...props
}) => (
    <Refract effectFactory={effectFactory} {...props}>
        {decoratedProps => (
            <BaseComponent {...props} {...decoratedProps}>
                {children}
            </BaseComponent>
        )}
    </Refract>
)
