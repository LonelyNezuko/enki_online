import React from 'react'
import $ from 'jquery'

import Moment from 'moment'
import 'moment/locale/ru'

import Avatar from '../../../_avatar/avatar'

import _cef from '../../../../modules/cef'
import func from '../../../../modules/func'

import './calling.scss'

import { FaMicrophoneSlash } from 'react-icons/fa'
import { IoVolumeHigh } from 'react-icons/io5'

import { FaPhone } from 'react-icons/fa'

export default function Calling({ sToggle, openApp, appData }) {
    React.useEffect(() => {
        setToggle(sToggle)
    }, [sToggle])
    const [ toggle, setToggle ] = React.useState(sToggle)

    const [ avatar, setAvatar ] = React.useState('assets/phone/defaultAvatar.png')

    const [ number, setNumber ] = React.useState(55523)
    const [ time, setTime ] = React.useState(0)

    const [ mute, setMute ] = React.useState(0)
    const [ volume, setVolume ] = React.useState(0)

    const [ incoming, setIncoming ] = React.useState(0)
    const [ outgoing, setOutgoing ] = React.useState(0)

    React.useMemo(() => {
        _cef.on('ui::phone:calling:mute', mute => setMute(parseInt(mute)))
        _cef.on('ui::phone:calling:volume', volume => setVolume(parseInt(volume)))

        _cef.on('ui::phone:calling:time', time => setTime(parseInt(time)))

        _cef.on('ui::phone:calling:number', number => setNumber(number))
        _cef.on('ui::phone:calling:avatar', avatar => setAvatar(avatar))

        _cef.on('ui::phone:calling:incoming', status => setIncoming(status))
        _cef.on('ui::phone:calling:outgoing', status => setOutgoing(status))
    }, [])

    return (
        <div className={`apppage app-calling ${incoming && 'incoming'}`} style={{display: !toggle ? 'none' : 'block'}}>
            <div className="info">
                <h2 style={{display: incoming ? "block" : "none"}}>Входящий вызов</h2>
                <Avatar image={avatar} type={!incoming ? "medium" : "big"} />
                <h1 className={`number ${isNaN(parseInt(number)) ? 'name' : ''}`}>{isNaN(parseInt(number)) ? number : func.formatPhoneNumber(number)}</h1>
                <span style={{display: incoming ? "none" : "block"}} className="time">{!outgoing ? Moment(new Date(time * 1000)).format("mm:ss") : 'Исходящий вызов'}</span>
            </div>
            <div className="action" style={{display: incoming ? "none" : "flex"}}>
                <div onClick={() => _cef.event('client::phone:calling:mute')} className={`section mute ${mute ? 'selected' : ''}`}>
                    <button>
                        <FaMicrophoneSlash />
                    </button>
                    <h1>Выкл. звук</h1>
                </div>
                <div onClick={() => _cef.event('client::phone:calling:volume')} className={`section volume ${volume ? 'selected' : ''}`}>
                    <button>
                        <IoVolumeHigh />
                    </button>
                    <h1>Динамик</h1>
                </div>
            </div>
            <div className="cancel" style={{display: incoming ? "none" : "flex"}}>
                <button onClick={() => _cef.event('client::phone:calling:cancel')}>
                    <FaPhone />
                </button>
            </div>
            <div className="cancel" style={{display: incoming ? "flex" : "none"}}>
                <button onClick={() => _cef.event('client::phone:calling:incoming:cancel')}>
                    <FaPhone />
                </button>
                <button style={{background: 'linear-gradient(180deg, #39C54F 0%, #048D1A 100%)'}} onClick={() => _cef.event('client::phone:calling:incoming:accept')}>
                    <FaPhone style={{transform: 'rotate(0deg) translate(0, 2px)'}} />
                </button>
            </div>
        </div>
    )
}