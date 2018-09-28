import {
    h,
    Component,
    ComponentFactory,
    ComponentConstructor,
    VNode
} from 'preact'

import configureComponent from './configureComponent'

import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'

export interface State {
    replace?: boolean
    props?: any
    children: VNode | null
}

const Empty = () => null

const isValidElement = (value: any): boolean =>
    Boolean(value) &&
    typeof value === 'object' &&
    'nodeName' in value &&
    'children' in value &&
    'attributes' in value &&
    'key' in value

export const withEffects = <P, E, CP = P>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (aperture: Aperture<P, E>) => (
    BaseComponent: ComponentFactory<CP & { pushEvent: PushEvent }> = Empty
): ComponentFactory<P> =>
    class WithEffects extends Component<P, State> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private reDecorateProps: (nextProps: P) => void
        private pushProps: (props: P) => void
        private getChildProps: () => CP & { pushEvent: PushEvent }
        private mounted: boolean = false
        private unmounted: boolean = false

        constructor(props: P) {
            super(props)

            configureComponent(handler, errorHandler)(
                aperture,
                this,
                isValidElement
            )
        }

        public componentDidMount() {
            this.mounted = true
            this.triggerMount()
        }

        public componentWillReceiveProps(nextProps) {
            this.reDecorateProps(nextProps)
        }

        public componentDidUpdate(prevProps: P) {
            this.pushProps(prevProps)
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
