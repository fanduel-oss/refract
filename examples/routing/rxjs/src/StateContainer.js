import { useState } from 'react'

const StateContainer = props => {
    const [activeTab, setActiveTab] = useState("ObiWan")

    return props.children({
        activeTab,
        setActiveTab
    })
}

export default StateContainer
