import { h, Component, ComponentFactory } from 'preact'

import configureComponent from './configureComponent'

import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'

export const withEffects = <P, E, CP = P>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (aperture: Aperture<P, E>) => (
    BaseComponent: ComponentFactory<CP & { pushEvent: PushEvent }>
): ComponentFactory<P> =>
    class WithEffects extends Component<P> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private reDecorateProps: (nextProps: P) => void
        private pushProps: (props: P) => void
        private getChildProps: () => CP & { pushEvent: PushEvent }

        constructor(props: P) {
            super(props)

            configureComponent(handler, errorHandler)(aperture, this)
        }

        public componentDidMount() {
            this.triggerMount()
        }

        public componentWillReceiveProps(nextProps) {
            this.reDecorateProps(nextProps)
        }

        public componentDidUpdate(prevProps: P) {
            this.pushProps(prevProps)
        }

        public componentWillUnmount() {
            this.triggerUnmount()
        }

        public render() {
            return h(BaseComponent, this.getChildProps())
        }
    }
