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

export interface Config<P, E> {
    handler: Handler<P, E, any>
    errorHandler: ErrorHandler<P, any>
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

export const withEffects = <P, E, CP = P>(
    aperture: Aperture<P, E>,
    config: Partial<Config<P, E>> = {}
) => (
    BaseComponent: ComponentFactory<CP & { pushEvent: PushEvent }> = Empty
): ComponentFactory<P> =>
    class WithEffects extends Component<P, State> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private havePropsChanged: (nextProps: P, nextState: State) => boolean
        private reDecorateProps: (nextProps: P) => void
        private pushProps: (props: P) => void
        private getChildProps: () => CP & { pushEvent: PushEvent }
        private mounted: boolean = false
        private unmounted: boolean = false

        constructor(props: P) {
            super(props)

            configureComponent(config.handler, config.errorHandler)(
                aperture,
                this,
                isValidElement,
                isComponentClass
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
