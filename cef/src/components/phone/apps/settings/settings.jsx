import React from 'react'
import $ from 'jquery'

import Avatar from '../../../_avatar/avatar'
import Modal from '../../modules/modal/modal'

import _cef from '../../../../modules/cef'
import func from '../../../../modules/func'

import './settings.scss'

export default function Settings({ sToggle, openApp, appData }) {
    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        $('.phone .app-settings').removeClass('opened')
        if(sToggle) {
            setToggle(true)
            setTimeout(() => $('.phone .app-settings').addClass('opened'), 100)
        }
        else setToggle(false)
    }, [sToggle, toggle])

    React.useMemo(() => {
        _cef.on('ui::phone:settings:wallpaper', link => setImage({...image, link: link}))
        _cef.on('ui::phone:settings:flight', flight => setFlight(flight))

        _cef.on('ui::phone:settings:brightness', brightness => setBrightness(brightness))

        _cef.on('ui::phone:settings:number', number => setNumber(number))
        _cef.on('ui::phone:settings:cash', cash => setCash(cash))
    }, [])

    const [ number, setNumber ] = React.useState(55555)
    const [ cash, setCash ] = React.useState(23124313)

    const [ image, setImage ] = React.useState({
        toggle: false,
        link: ''
    })

    const [ flight, setFlight ] = React.useState(false)
    React.useEffect(() => {
        _cef.event('client::phone:settings:flight', `${!flight ? 0 : 1}`)
    }, [flight])

    const [ brightness, setBrightness ] = React.useState(1)

    return (
        <div className="apppage app-settings" style={{display: !toggle ? 'none' : 'block'}}>
            <Modal type="input" inputvalue={image.link} toggle={image.toggle} text="Введите ссылку на изображение:" btns={[ 'Отмена', 'Ок' ]} onClick={(btn, value) => {
                if(btn === 1) {
                    setImage({...image, link: value})
                    _cef.event('client::phone:settings:wallpaper', `${value}`)
                }
                setImage({ ...image, toggle: false })
            }} />

            <header>
                <h1>Настройки</h1>
            </header>
            <div className="simnumber">
                <h2>Ваш номер телефона</h2>
                <h1>
                    {number}
                    <span>{cash.toLocaleString()}$</span>
                </h1>
            </div>
            <div className="menu">
                <div className="elem" onClick={() => setImage({...image, toggle: true})}>
                    <div className="right">
                        <div className="image">
                            <img src="assets/phone/settings/wallpaper.png" />
                        </div>
                        <h1>Изменить обои</h1>
                    </div>
                </div>
                <div className="elem wrap">
                    <div className="right">
                        <div className="image">
                            <img src="assets/phone/settings/brightness.png" />
                        </div>
                        <h1>Яркость</h1>
                    </div>
                    <div className="left">
                        <input type="range" min="0.3" max="1" step="0.1" value={brightness} onChange={event => {
                            setBrightness(event.target.value)
                            _cef.event('client::phone:settings:brightness', event.target.value)
                        }} />
                    </div>
                </div>
                <div className="elem" onClick={() => setFlight(!flight)}>
                    <div className="right">
                        <div className="image">
                            <img src="assets/phone/settings/flight.png" />
                        </div>
                        <h1>Режим "В самолете"</h1>
                    </div>
                    <div className="left">
                        <input onChange={event => setFlight(event.target.checked)} checked={flight} type="checkbox" className="switch" />
                    </div>
                </div>
                <div className="elem" onClick={() => _cef.event('client::phone:settings:sim')}>
                    <div className="right">
                        <div className="image">
                            <img src="assets/phone/settings/sim.png" />
                        </div>
                        <h1>Вытащить сим-карту</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}