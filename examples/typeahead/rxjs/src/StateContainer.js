import { Component } from 'react'

class StateContainer extends Component {
    state = { search: '', selection: '', sugestions: [], user: null }
    setState = this.setState.bind(this)

    render() {
        const { search, selection, suggestions, user } = this.state
        const { setState } = this

        return this.props.children({
            search,
            selection,
            suggestions,
            user,
            setState
        })
    }
}

export default StateContainer
