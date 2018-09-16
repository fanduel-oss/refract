import { Component } from 'react'

class StateContainer extends Component {
    state = { activeTab: null }
    setActiveTab = activeTab => this.setState({ activeTab })
    setState = this.setState.bind(this)

    render() {
        const { activeTab } = this.state
        const { setActiveTab, setState } = this

        return this.props.children({
            activeTab,
            setActiveTab,
            setState
        })
    }
}

export default StateContainer
