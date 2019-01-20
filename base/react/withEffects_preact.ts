import { h, Component, ComponentFactory, VNode } from 'preact'

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
    handler?: Handler<Props, Effect, any>
    errorHandler?: ErrorHandler<Props, any>
    mergeProps?: boolean
    decorateProps?: boolean
}

const Empty = () => null

const isValidElement = (value: any): boolean =>
    Boolean(value) &&
    typeof value === 'object' &&
    'nodeName' in value &&
    'children' in value &&
    'attributes' in value &&
    'key' in value

const isComponentClass = (ComponentClass: any): boolean =>
    Boolean(
        ComponentClass &&
            ComponentClass.prototype &&
            ComponentClass.prototype.componentDidMount
    )

export const withEffects = <Props, Effect, CurrentProps = Props>(
    aperture: Aperture<Props, Effect>,
    config: Config<Props, Effect> = {}
) => (
    BaseComponent: ComponentFactory<
        CurrentProps & { pushEvent: PushEvent }
    > = Empty
): ComponentFactory<Props> =>
    class WithEffects extends Component<Props, State> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private havePropsChanged: (
            nextProps: Props,
            nextState: State
        ) => boolean
        private reDecorateProps: (nextProps: Props) => void
        private pushProps: (props: Props) => void
        private getChildProps: () => CurrentProps & { pushEvent: PushEvent }
        private mounted: boolean = false
        private unmounted: boolean = false

        constructor(props: Props) {
            super(props)

            configureComponent(
                aperture,
                this,
                isValidElement,
                isComponentClass,
                config.handler,
                config.errorHandler,
                config.mergeProps,
                config.decorateProps !== false
            )
        }

        public componentDidMount() {
            this.mounted = true
            this.triggerMount()
        }

        public componentWillReceiveProps(nextProps) {
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

            return h(BaseComponent, this.getChildProps())
        }
    }
