import { from } from 'rxjs'
import {
    filter,
    map,
    mapTo,
    distinctUntilChanged,
    startWith
} from 'rxjs/operators'
import $$observable from 'symbol-observable'
import React__default, {
    useState,
    useContext,
    useLayoutEffect,
    isValidElement,
    createElement,
    Component
} from 'react'

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
        function(d, b) {
            d.__proto__ = b
        }) ||
    function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]
    }

function __extends(d, b) {
    extendStatics(d, b)
    function __() {
        this.constructor = d
    }
    d.prototype =
        b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
}

var __assign =
    Object.assign ||
    function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i]
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p]
        }
        return t
    }

var PROPS_EFFECT = '@@refract/effect/props'
var COMPONENT_EFFECT = '@@refract/effect/component'
var toProps = function(props) {
    return {
        type: PROPS_EFFECT,
        payload: {
            replace: false,
            props: props
        }
    }
}
var asProps = function(props) {
    return {
        type: PROPS_EFFECT,
        payload: {
            replace: true,
            props: props
        }
    }
}
var toComponent = function(data) {
    return {
        type: COMPONENT_EFFECT,
        payload: data
    }
}

var MOUNT_EVENT = '@@refract/event/mount'
var UNMOUNT_EVENT = '@@refract/event/unmount'
var DataType
;(function(DataType) {
    DataType['EVENT'] = 'event'
    DataType['PROPS'] = 'props'
    DataType['CALLBACK'] = 'callback'
})(DataType || (DataType = {}))
var isEvent = function(eventName) {
    return function(data, index) {
        return data.type === DataType.EVENT && data.payload.name === eventName
    }
}
var isProps = function(data) {
    return data.type === DataType.PROPS
}
var isCallback = function(propName) {
    return function(data) {
        return data.type === DataType.CALLBACK && data.payload.name === propName
    }
}
var createEventData = function(name, value) {
    return {
        type: DataType.EVENT,
        payload: {
            name: name,
            value: value
        }
    }
}
var createPropsData = function(props) {
    return {
        type: DataType.PROPS,
        payload: props
    }
}
var createCallbackData = function(name, args) {
    return {
        type: DataType.CALLBACK,
        payload: {
            name: name,
            args: args
        }
    }
}
var shallowEquals = function(left, right) {
    return (
        left === right ||
        (Object.keys(left).length === Object.keys(right).length &&
            Object.keys(left).every(function(leftKey) {
                return left[leftKey] === right[leftKey]
            }))
    )
}

var subscribeToSink = function(sink, next, error) {
    return sink.subscribe({
        next: next,
        error: error
    })
}
var getComponentBase = function(data, pushEvent) {
    var fromEvent = function(eventName, valueTransformer) {
        return data.pipe(
            filter(isEvent(eventName)),
            map(function(data) {
                var value = data.payload.value
                return valueTransformer ? valueTransformer(value) : value
            })
        )
    }
    return {
        mount: data.pipe(filter(isEvent(MOUNT_EVENT)), mapTo(undefined)),
        unmount: data.pipe(filter(isEvent(UNMOUNT_EVENT)), mapTo(undefined)),
        fromEvent: fromEvent,
        pushEvent: pushEvent,
        useEvent: function(eventName, seedValue) {
            var events$ = fromEvent(eventName)
            var pushEventValue = pushEvent(eventName)
            return [
                seedValue === undefined
                    ? events$
                    : events$.pipe(startWith(seedValue)),
                pushEventValue
            ]
        }
    }
}
var getObserve = function(instance, data) {
    return function observe(propName, valueTransformer) {
        if (propName && typeof instance.props[propName] === 'function') {
            return data().pipe(
                filter(isCallback(propName)),
                map(function(data) {
                    var args = data.payload.args
                    return valueTransformer ? valueTransformer(args) : args[0]
                })
            )
        }
        if (propName) {
            return data().pipe(
                filter(isProps),
                map(function(data) {
                    var prop = data.payload[propName]
                    return valueTransformer ? valueTransformer(prop) : prop
                }),
                distinctUntilChanged()
            )
        }
        return data().pipe(
            filter(isProps),
            map(function(data) {
                return data.payload
            }),
            distinctUntilChanged(shallowEquals)
        )
    }
}
var createComponent = function(instance, dataObservable, pushEvent) {
    var data = function() {
        return from(dataObservable)
    }
    return __assign(
        { observe: getObserve(instance, data) },
        getComponentBase(data(), pushEvent)
    )
}
var createBaseComponent = function(dataObservable, pushEvent) {
    return getComponentBase(from(dataObservable), pushEvent)
}

var configureComponent = function(handler, errorHandler) {
    return function(aperture, instance, isValidElement$$1, isComponentClass) {
        if (isValidElement$$1 === void 0) {
            isValidElement$$1 = function() {
                return false
            }
        }
        if (isComponentClass === void 0) {
            isComponentClass = function() {
                return false
            }
        }
        instance.state = {
            renderEffect: false,
            children: null,
            props: {}
        }
        var setState = function(state) {
            if (instance.unmounted) {
                return
            }
            if (instance.mounted) {
                instance.setState(state)
            } else {
                instance.state = __assign({}, instance.state, state)
            }
        }
        var finalHandler = function(initialProps, initialContext) {
            var effectHandler = handler(initialProps, initialContext)
            return function(effect) {
                if (isValidElement$$1(effect)) {
                    setState({
                        renderEffect: true,
                        children: effect
                    })
                } else if (effect && effect.type === PROPS_EFFECT) {
                    var payload = effect.payload
                    setState({
                        replace: payload.replace,
                        props: payload.props
                    })
                } else {
                    effectHandler(effect)
                }
            }
        }
        var decoratedProps = {}
        var listeners = []
        var addListener = function(listener) {
            listeners = listeners.concat(listener)
        }
        var removeListener = function(listener) {
            listeners = listeners.filter(function(l) {
                return l !== listener
            })
        }
        var pushEvent = function(eventName) {
            return function(val) {
                listeners.forEach(function(listener) {
                    listener.next(createEventData(eventName, val))
                })
            }
        }
        var decorateProp = function(container, prop, propName) {
            if (propName === 'children' || isComponentClass(prop)) {
                return
            }
            container[propName] = function() {
                var args = []
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i]
                }
                listeners.forEach(function(listener) {
                    listener.next(createCallbackData(propName, args))
                })
                return prop.apply(void 0, args)
            }
        }
        Object.keys(instance.props).forEach(function(propName) {
            if (typeof instance.props[propName] === 'function') {
                decorateProp(decoratedProps, instance.props[propName], propName)
            }
        })
        var dataObservable = ((_a = {
            subscribe: function(listener) {
                addListener(listener)
                listener.next(createPropsData(instance.props))
                return {
                    unsubscribe: function() {
                        return removeListener(listener)
                    }
                }
            }
        }),
        (_a[$$observable] = function() {
            return this
        }),
        _a)
        var component = createComponent(instance, dataObservable, pushEvent)
        var sinkObservable = aperture(instance.props, instance.context)(
            component
        )
        var sinkSubscription = subscribeToSink(
            sinkObservable,
            finalHandler(instance.props, instance.context),
            errorHandler
                ? errorHandler(instance.props, instance.context)
                : undefined
        )
        instance.reDecorateProps = function(nextProps) {
            Object.keys(nextProps).forEach(function(propName) {
                if (
                    typeof instance.props[propName] === 'function' &&
                    nextProps[propName] !== instance.props[propName]
                ) {
                    decorateProp(decoratedProps, nextProps[propName], propName)
                }
            })
        }
        instance.pushProps = function(props) {
            listeners.forEach(function(listener) {
                listener.next(createPropsData(props))
            })
        }
        instance.triggerMount = function() {
            pushEvent(MOUNT_EVENT)(undefined)
        }
        instance.triggerUnmount = function() {
            pushEvent(UNMOUNT_EVENT)(undefined)
            sinkSubscription.unsubscribe()
        }
        instance.getChildProps = function() {
            var state = instance.state
            var stateProps = state.props
            if (state.replace === true) {
                return __assign({}, stateProps, { pushEvent: pushEvent })
            }
            var additionalProps = __assign({}, decoratedProps, {
                pushEvent: pushEvent
            })
            if (state.replace === false) {
                return __assign({}, instance.props, stateProps, additionalProps)
            }
            return __assign({}, instance.props, additionalProps)
        }
        instance.havePropsChanged = function(newProps, newState) {
            var state = instance.state
            if (state.renderEffect) {
                return state.children !== newState.children
            }
            var haveStatePropsChanged = !shallowEquals(
                state.props,
                newState.props
            )
            if (newState.replace === true) {
                return haveStatePropsChanged
            }
            var havePropsChanged = !shallowEquals(instance.props, newProps)
            if (newState.replace === false) {
                return havePropsChanged || haveStatePropsChanged
            }
            return havePropsChanged
        }
        var _a
    }
}

var isComponentClass = function(ComponentClass) {
    return Boolean(
        ComponentClass &&
            ComponentClass.prototype &&
            ComponentClass.prototype.isReactComponent
    )
}
var Empty = function() {
    return null
}
var withEffects = function(handler, errorHandler, Context) {
    return function(aperture) {
        return function(BaseComponent) {
            if (BaseComponent === void 0) {
                BaseComponent = Empty
            }
            return (
                (_a = /** @class */ (function(_super) {
                    __extends(WithEffects, _super)
                    function WithEffects(props, context) {
                        var _this = _super.call(this, props, context) || this
                        _this.mounted = false
                        _this.unmounted = false
                        configureComponent(handler, errorHandler)(
                            aperture,
                            _this,
                            isValidElement,
                            isComponentClass
                        )
                        return _this
                    }
                    WithEffects.prototype.componentDidMount = function() {
                        this.mounted = true
                        this.triggerMount()
                    }
                    WithEffects.prototype.componentWillReceiveProps = function(
                        nextProps
                    ) {
                        this.reDecorateProps(nextProps)
                        this.pushProps(nextProps)
                    }
                    WithEffects.prototype.shouldComponentUpdate = function(
                        nextProps,
                        nextState
                    ) {
                        return this.havePropsChanged(nextProps, nextState)
                    }
                    WithEffects.prototype.componentWillUnmount = function() {
                        this.unmounted = true
                        this.triggerUnmount()
                    }
                    WithEffects.prototype.render = function() {
                        if (this.state.children) {
                            return this.state.children
                        }
                        return createElement(
                            BaseComponent,
                            this.getChildProps()
                        )
                    }
                    return WithEffects
                })(Component)),
                (_a.contextType = Context),
                _a
            )
            var _a
        }
    }
}

var identity = function(arg) {
    return arg
}
var compose = function() {
    var fns = []
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i]
    }
    if (fns.length === 0) {
        return identity
    }
    if (fns.length === 1) {
        return fns[0]
    }
    return function(arg) {
        return fns.reduceRight(function(previousResult, fn) {
            return fn(previousResult)
        }, arg)
    }
}

var configureHook = function(handler, errorHandler, aperture, props, context) {
    var data = {}
    var setComponentData
    var finalHandler = function(initialProps, initialContext) {
        var effectHandler = handler(initialProps, initialContext)
        return function(effect) {
            if (effect && effect.type === COMPONENT_EFFECT) {
                if (setComponentData) {
                    setComponentData(effect.payload)
                } else {
                    data = effect.payload
                }
            } else {
                effectHandler(effect)
            }
        }
    }
    var listeners = []
    var addListener = function(listener) {
        listeners = listeners.concat(listener)
    }
    var removeListener = function(listener) {
        listeners = listeners.filter(function(l) {
            return l !== listener
        })
    }
    var pushEvent = function(eventName) {
        return function(val) {
            listeners.forEach(function(listener) {
                listener.next(createEventData(eventName, val))
            })
        }
    }
    var dataObservable = ((_a = {
        subscribe: function(listener) {
            addListener(listener)
            return {
                unsubscribe: function() {
                    return removeListener(listener)
                }
            }
        }
    }),
    (_a[$$observable] = function() {
        return this
    }),
    _a)
    var component = createBaseComponent(dataObservable, pushEvent)
    var sinkObservable = aperture(props, context)(component)
    var sinkSubscription = subscribeToSink(
        sinkObservable,
        finalHandler(props, context),
        errorHandler ? errorHandler(props, context) : undefined
    )
    var pushMountEvent = function() {
        pushEvent(MOUNT_EVENT)(undefined)
    }
    var pushUnmountEvent = function() {
        pushEvent(UNMOUNT_EVENT)(undefined)
    }
    return {
        data: data,
        unsubscribe: function() {
            pushUnmountEvent()
            sinkSubscription.unsubscribe()
        },
        pushMountEvent: pushMountEvent,
        registerSetData: function(setData) {
            setComponentData = function(data) {
                return setData({ data: data })
            }
        }
    }
    var _a
}

// @ts-ignore
var EmptyContext = React__default.createContext({})
var createRefractHook = function(handler, errorHandler, DependencyContext) {
    if (DependencyContext === void 0) {
        DependencyContext = EmptyContext
    }
    var useRefract = function(aperture, initialProps) {
        var dependencies = useContext(DependencyContext)
        var _a = useState(
                configureHook(
                    handler,
                    errorHandler,
                    aperture,
                    initialProps,
                    dependencies
                )
            ),
            hook = _a[0],
            setData = _a[1]
        useLayoutEffect(function() {
            hook.registerSetData(setData)
            hook.pushMountEvent()
            return function() {
                return hook.unsubscribe()
            }
        }, [])
        return hook.data
    }
    return useRefract
}

export {
    withEffects,
    compose,
    asProps,
    toProps,
    PROPS_EFFECT,
    createRefractHook,
    toComponent,
    COMPONENT_EFFECT
}
