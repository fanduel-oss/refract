import React, { Component } from 'react'
import RefractContext from './Context'

export default class RefractProvider extends Component {
    constructor(props) {
        super(props)

        const { effectHandler, errorHandler, store } = props

        // should we pass dependencies through to the consumers?
        const dependencies = Object.assign({}, props.dependencies)

        if (store) {
            dependencies.store = { observe: store.observe }
        }

        this.context = {
            effectHandler: effectHandler(deps),
            errorHandler: errorHandler(deps),
            dependencies
        }
    }

    render() {
        return (
            <RefractContext.Provider value={{ refractContext: this.context }}>
                {this.props.children}
            </RefractContext.Provider>
        )
    }
}
