import React from 'react'
import $ from 'jquery'

import './blocked.scss'

export default function Blocked({ sToggle, openApp }) {
    const [ toggle, setToggle ] = React.useState(true)
    React.useEffect(() => {
        if(!sToggle) {
            $('.phone .app-blocked').addClass('animate')
            setTimeout(() => {
                setToggle(false)
            }, 700)
        }
        else {
            $('.phone .app-blocked').removeClass('animate')
            setToggle(true)
        }
    }, [sToggle])

    return (
        <div onClick={() => {
            openApp('home')
        }} className="apppage app-blocked" style={{display: !toggle ? 'none' : 'flex'}}>
            <div className="logo">
                <img src="assets/logo_smile.png" />
                <div>
                    <h2>Факт дня:</h2>
                    <span>По состоянию на май 2008 года в Каире, где проживает больше 18 миллионов человек, насчитывалось 9 светофоров.</span>
                </div>
            </div>
            <h1>Нажми на экран</h1>
        </div>
    )
}