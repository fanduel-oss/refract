import { useState } from 'react'

const StateContainer = props => {
    const [activeTab, setActiveTab] = useState(null)

    return props.children({
        activeTab,
        setActiveTab
    })
}

export default StateContainer
