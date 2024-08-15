import React from 'react'
import $ from 'jquery'

import _cef from '../../../../modules/cef'
import func from '../../../../modules/func'

import './call.scss'

import { IoCall } from 'react-icons/io5'
import { IoBackspace } from 'react-icons/io5'

export default function Call({ sToggle, openApp, appData }) {
    const [ number, setNumber ] = React.useState('')

    function onCall(number) {
        if(isNaN(number))return
        _cef.event('client::phone:call', `${number}`)
    }
    function onAddContact(number) {
        if(isNaN(number))return
        openApp('contacts', { addContact: number })
    }

    React.useMemo(() => {
        _cef.on('ui::phone:call:setNumber', number => setNumber(number))
    }, [])
    

    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        $('.phone .app-call').removeClass('opened')
        if(sToggle) {
            setToggle(true)
            setTimeout(() => $('.phone .app-call').addClass('opened'), 100)
        }
        else setToggle(false)
    }, [sToggle, toggle])


    React.useEffect(() => {
        if(appData.number) {
            setNumber(appData.number.toString())
            onCall(parseInt(appData.number))
        }
        if(JSON.stringify(appData) === '{}') setNumber('')
    }, [appData])

    return (
        <div className='apppage app-call' style={{display: !toggle ? 'none' : 'block'}}>
            <div className="number">
                <section>
                    {!number.length ? (<>&nbsp;</>) : func.formatPhoneNumber(number)}
                </section>
                <h1 onClick={() => onAddContact(parseInt(number))}>Добавить контакт</h1>
            </div>
            <div className="buttons">
                {new Array(12).fill(0).map((item, i) => {
                    if(i == 9)return (
                        <button onClick={() => onCall(parseInt(number))} key={i} className="call">
                            <IoCall />
                        </button>
                    )
                    if(i == 11)return (
                        <button onClick={() => {
                            if(!number.length)return
                            setNumber(number.substring(0, number.length - 1))
                        }} key={i} className="backspace">
                            <IoBackspace />
                        </button>
                    )
                    return (<button onClick={() => {
                        if(number.length >= 7)return
                        setNumber(number + (i === 10 ? '0' : (i + 1).toString()))
                    }} key={i}>{i === 10 ? 0 : i + 1}</button>)
                })}
            </div>
        </div>
    )
}