import React from 'react'

import './404.scss'

export default function App404({ sToggle, openApp }) {
    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        setToggle(sToggle)
    }, [sToggle])

    return (
        <div className="apppage app-404" style={{display: !toggle ? 'none' : 'flex'}}>
            <section>
                <img src="assets/phone/logoblur.png" />
                <h1>Упс, пока такого приложения еще не накодили :(</h1>
            </section>
        </div>
    )
}