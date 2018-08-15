import { Component, ComponentType, ComponentClass } from 'inferno'
import { createElement } from 'inferno-create-element'

import configureComponent from './configureComponent'

import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'

export const withEffects = <P, E>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (aperture: Aperture<P, E>) => (
    BaseComponent: ComponentType<P & { pushEvent: PushEvent }>
): ComponentClass<P> =>
    class WithEffects extends Component<P> {
        private triggerMount: () => void
        private triggerUnmount: () => void
        private reDecorateProps: (nextProps: P) => void
        private pushProps: (props: P) => void
        private getChildProps: () => P & { pushEvent: PushEvent }

        constructor(props: any, context: any) {
            super(props, context)

            configureComponent(handler, errorHandler)(aperture, this)
        }

        public componentDidMount() {
            this.triggerMount()
        }

        public componentWillUpdate(nextProps: P) {
            this.reDecorateProps(nextProps)
        }

        public componentDidUpdate(lastProps: P) {
            this.pushProps(lastProps)
        }

        public componentWillUnmount() {
            this.triggerUnmount()
        }

        public render() {
            return createElement(
                BaseComponent,
                this.getChildProps(),
                this.props.children
            )
        }
    }
