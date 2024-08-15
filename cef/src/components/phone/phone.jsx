import React from 'react'
import $ from 'jquery'

import Moment from 'moment'
import 'moment/locale/ru'

import Modal from './modules/modal/modal'
import _cef from '../../modules/cef'

import App404 from './apps/404/404'

import Blocked from './apps/blocked/blocked'
import Home from './apps/home/home'
import Call from './apps/call/call'
import Calling from './apps/calling/calling'
import Contacts from './apps/contacts/contacts'
import SMS from './apps/sms/sms'
import Settings from './apps/settings/settings'
import CNN from './apps/cnn/cnn'

import './phone.scss'

import { MdNetworkCell } from 'react-icons/md'
import { MdFlight } from 'react-icons/md'
import { MdSignalWifiStatusbarNull } from 'react-icons/md'

export default function Phone() {
    const [ toggle, setToggle ] = React.useState(false)
    
    const [ app, setApp ] = React.useState('blocked')
    const [ appData, setAppData ] = React.useState({})

    const [ time, setTime ] = React.useState(new Date())
    const [ flight, setFlight ] = React.useState(false)

    const [ brightness, setBrightness ] = React.useState(1)

    function onClickHomeBTN() {
        if(app !== 'calling') openApp('home')
        else _cef.event('client::phone:close')
    }
    function openApp(name, data = {}) {
        if(name == 'sms'
            && data.open
            && data.open.phone)return _cef.event('client::phone:sms:open:number', `${data.open.phone}`)

        _cef.event('client::phone:openApp', name)
        setAppData(data)

        // временно
        // setApp(name)
    }

    React.useMemo(() => {
        setInterval(() => {
            setTime(new Date())
        }, 40000)

        _cef.on('ui::phone:setApp', name => setApp(name))
        _cef.on('ui::phone:toggle', toggle => setToggle(toggle))

        _cef.on('ui::phone:flight', flight => setFlight(flight))
        _cef.on('ui::phone:brightness', brightness => setBrightness(brightness))

        _cef.on('ui::phone:error', error => setError(error))

        $(document).keyup(event => {
            if($('.phone').css('display') !== 'none'
                && event.key === 'Escape') _cef.event('client::phone:close')
        })
    }, [])

    const [ error, setError ] = React.useState('')

    return (
        <div className={`phone ${toggle && 'phone-open'}`}>
            <div className="fringe"></div>

            <div className="phonebuttons">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className="display" style={{opacity: brightness}}>
                <div className="statusbar">
                    <div className="time">{Moment(time).format('HH:mm')}</div>
                    <div className="network">
                        {/* <MdSignalWifiStatusbarNull /> */}
                        {!flight ? (<MdNetworkCell />) : (<MdFlight />)}
                    </div>
                </div>
                <div className="app">
                    <Modal toggle={!error.length ? false : true} text={error} onClick={() => setError('')} />

                    <App404 sToggle={app !== 'blocked'
                        && app !== 'home'
                        && app !== 'call'
                        && app !== 'calling'
                        && app !== 'contacts'
                        && app !== 'settings'
                        && app !== 'cnn'
                        && app !== 'sms' ? true : false} openApp={openApp} appData={appData} />

                    <Blocked sToggle={app === 'blocked' ? true : false} openApp={openApp} appData={appData} />
                    <Home sToggle={app === 'home' ? true : false} openApp={openApp} appData={appData} />
                    <Call sToggle={app === 'call' ? true : false} openApp={openApp} appData={appData} />
                    <Calling sToggle={app === 'calling' ? true : false} openApp={openApp} appData={appData} />
                    <Contacts sToggle={app === 'contacts' ? true : false} openApp={openApp} appData={appData} />
                    <SMS sToggle={app === 'sms' ? true : false} openApp={openApp} appData={appData} />
                    <Settings sToggle={app === 'settings' ? true : false} openApp={openApp} appData={appData} />
                    <CNN sToggle={app === 'cnn' ? true : false} openApp={openApp} appData={appData} />

                    <div style={{display: app === 'home' || app === 'blocked' ? 'none' : 'block'}} onClick={() => onClickHomeBTN()} className="homebtn"></div>
                </div>
            </div>
        </div>
    )
}