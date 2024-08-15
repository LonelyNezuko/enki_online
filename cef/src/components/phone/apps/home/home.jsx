import React from 'react'
import $ from 'jquery'

import _cef from '../../../../modules/cef'

import './home.scss'

export default function Home({ sToggle, openApp }) {
    const [ applist, setApplist ] = React.useState([
        { id: 'weather', icon: 'weather.png', name: 'Погода' },
        { id: 'stats', icon: 'stats.png', name: 'Статистика' },
        { id: 'skills', icon: 'skills.png', name: 'Навыки' },
        { id: 'taxi', icon: 'taxi.png', name: 'Такси' },
        { id: 'delivery', icon: 'delivery.png', name: 'Доставка еды' },
        { id: 'radio', icon: 'radio.png', name: 'Радио' },
        { id: 'bank', icon: 'internet.png', name: 'Интернет банкинг' },
        { id: 'cnn', icon: 'cnn.png', name: 'СМИ' },

        { id: 'call', icon: 'call.png', name: 'Звонки', pin: true },
        { id: 'sms', icon: 'sms.png', name: 'Сообщения', pin: true },
        { id: 'contacts', icon: 'contacts.png', name: 'Контакты', pin: true },
        { id: 'settings', icon: 'settings.png', name: 'Настройки', pin: true }
    ])

    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        if(sToggle) {
            if(!toggle) $('.phone .app-home').addClass('animate')
            setTimeout(() => {
                setToggle(true)
            }, !toggle ? 400 : 0)
        }
        else {
            $('.phone .app-home').removeClass('animate')
            setToggle(false)
        }
    }, [sToggle, toggle])

    const [ wallpaper, setWallpaper ] = React.useState('')
    React.useMemo(() => {
        _cef.on('ui::phone:home:wallpaper', wallpaper => setWallpaper(wallpaper))
    }, [])

    return (
        <div className="apppage app-home" style={{display: !toggle ? 'none' : 'block'}}>
            <div className="logoblur">
                <img src="assets/logo.png" />
            </div>
            <div className="wallpaper" style={{backgroundImage: `url(${wallpaper})`, opacity: !wallpaper.length ? 0 : 1}}></div>

            <div className="applist-wrap">
                <div className="applist">
                    {applist.filter(e => !e.pin).map((item, i) => {
                        return (
                            <div key={i} onClick={() => openApp(item.id)} className="item">
                                <img src={`assets/phone/appicons/${item.icon}`} />
                                <h1>{item.name}</h1>
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className="bottom">
                {applist.filter(e => e.pin).map((item, i) => {
                    return (
                        <div key={i} onClick={() => openApp(item.id)} className="item">
                            <img src={`assets/phone/appicons/${item.icon}`} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}