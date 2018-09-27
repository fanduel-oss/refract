import * as React from 'react'

import configureComponent from './configureComponent'

import { Handler, ErrorHandler, PushEvent } from './baseTypes'
import { Aperture } from './observable'

export const withEffects = <P, E>(
    handler: Handler<P, E>,
    errorHandler?: ErrorHandler<P>
) => (aperture: Aperture<P, E>) => (
    BaseComponent: React.ComponentType<P & { pushEvent: PushEvent }>
): React.ComponentClass<P> =>
    class WithEffects extends React.PureComponent<P> {
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

        public componentWillReceiveProps(nextProps: P) {
            this.reDecorateProps(nextProps)
        }

        public componentDidUpdate(prevProps: P) {
            this.pushProps(prevProps)
        }

        public componentWillUnmount() {
            this.triggerUnmount()
        }

        public render() {
            return React.createElement(BaseComponent, this.getChildProps())
        }
    }
