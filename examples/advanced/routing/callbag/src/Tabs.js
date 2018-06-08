import React from 'react'

const TabItem = ({ children }) => children

const Tabs = ({ activeTab, children, defaultTab, setActiveTab }) => {
    const allChildren = React.Children.toArray(children)
    const showTab = activeTab ? false : defaultTab

    const { content, tabs } = allChildren.reduce(
        (acc, child, i) => {
            if (child.type.name === 'TabItem') {
                let active = false
                if (activeTab === child.props.name || showTab === i) {
                    active = true
                    acc.content = child
                }

                acc.tabs.push(
                    <button
                        key={child.props.name}
                        onClick={() => setActiveTab(child.props.name)}
                        className={active ? 'active' : null}
                    >
                        {child.props.name}
                    </button>
                )
            }

            return acc
        },
        { content: null, tabs: [] }
    )

    return (
        <div>
            <p>{tabs}</p>
            {content}
        </div>
    )
}

Tabs.defaultProps = {
    defaultTab: 0
}

Tabs.Item = TabItem

export default Tabs
