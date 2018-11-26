import { Component, ComponentType, ComponentClass, VNode } from 'inferno'
import { createElement } from 'inferno-create-element'

import configureComponent from './configureComponent'

import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'

export interface State {
    replace?: boolean
    props: object
    renderEffect: boolean
    children: VNode | null
}

export interface Config<P, E> {
    handler?: Handler<P, E>
    errorHandler?: ErrorHandler<P, E>
    mergeProps?: boolean
}

const Empty = () => null

const isValidElement = (value: any): boolean =>
    Boolean(value) &&
    typeof value === 'object' &&
    'children' in value &&
    'childFlags' in value &&
    'flags' in value &&
    'parentVNode' in value

const isComponentClass = (ComponentClass: any): boolean =>
    Boolean(
        ComponentClass &&
            ComponentClass.prototype &&
            ComponentClass.prototype.componentDidMount
    )

export const withEffects = <P, E, CP = P>(
    aperture: Aperture<P, E>,
    config: Config<P, E> = {}
) => (
    BaseComponent: ComponentType<CP & { pushEvent: PushEvent }> = Empty
): ComponentClass<P> =>
    class WithEffects extends Component<P, State> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private havePropsChanged: (nextProps: P, nextState: State) => boolean
        private reDecorateProps: (nextProps: P) => void
        private pushProps: (props: P) => void
        private getChildProps: () => CP & { pushEvent: PushEvent }
        private mounted: boolean = false
        private unmounted: boolean = false

        constructor(props: any, context: any) {
            super(props, context)

            configureComponent(
                aperture,
                this,
                isValidElement,
                isComponentClass,
                config.handler,
                config.errorHandler,
                config.mergeProps
            )
        }

        public componentDidMount() {
            this.mounted = true
            this.triggerMount()
        }

        public componentWillReceiveProps(nextProps: P) {
            this.reDecorateProps(nextProps)
            this.pushProps(nextProps)
        }

        public shouldComponentUpdate(nextProps, nextState) {
            return this.havePropsChanged(nextProps, nextState)
        }

        public componentWillUnmount() {
            this.unmounted = true
            this.triggerUnmount()
        }

        public render() {
            if (this.state.children) {
                return this.state.children
            }

            return createElement(BaseComponent, this.getChildProps())
        }
    }
