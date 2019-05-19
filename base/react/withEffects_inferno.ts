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

export interface Config<Props, Effect> {
    handler?: Handler<Props, Effect>
    errorHandler?: ErrorHandler<Props, Effect>
    mergeProps?: boolean
    decorateProps?: boolean
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

export const withEffects = <Props, Effect, ChildProps = Props>(
    aperture: Aperture<Props, Effect>,
    config: Config<Props, Effect> = {}
) => (
    BaseComponent: ComponentType<ChildProps & { pushEvent: PushEvent }> = Empty
): ComponentClass<Props> =>
    class WithEffects extends Component<Props, State> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private havePropsChanged: (
            nextProps: Props,
            nextState: State
        ) => boolean
        private reDecorateProps: (nextProps: Props) => void
        private pushProps: (props: Props) => void
        private getChildProps: () => ChildProps & { pushEvent: PushEvent }
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
                config.mergeProps,
                config.decorateProps !== false,
                BaseComponent.name
            )
        }

        public componentDidMount() {
            this.mounted = true
            this.triggerMount()
        }

        public componentWillReceiveProps(nextProps: Props) {
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
