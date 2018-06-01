import React from 'react'

import Tabs from './Tabs'

const Layout = ({ activeTab, setActiveTab }) => (
    <div>
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab}>
            <Tabs.Item name="ObiWan">
                <p>This is not the tab you're looking for.</p>
            </Tabs.Item>
            <Tabs.Item name="Yoda">
                <p>Seagulls... stop it now!</p>
            </Tabs.Item>
            <Tabs.Item name="Artoo">
                <p>Bleep bloop beep beep boop.</p>
            </Tabs.Item>
        </Tabs>

        <p>
            As a side-effect of selecting a tab, the URL changes. The state is
            also synced when the browser's back or forward buttons are clicked.
        </p>
    </div>
)

export default Layout
