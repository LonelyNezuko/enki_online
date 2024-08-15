import React from 'react'
import $ from 'jquery'

import Avatar from '../../../_avatar/avatar'
import Modal from '../../modules/modal/modal'

import _cef from '../../../../modules/cef'
import func from '../../../../modules/func'

import './cnn.scss'

export default function CNN({ sToggle, openApp, appData }) {
    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        $('.phone .app-cnn').removeClass('opened')
        if(sToggle) {
            setToggle(true)
            setTimeout(() => $('.phone .app-cnn').addClass('opened'), 100)
        }
        else setToggle(false)
    }, [sToggle, toggle])

    const [ cnnID, setCNNID ] = React.useState(-1)
    const [ cnn, setCNN ] = React.useState('')
    const [ text, setText ] = React.useState('')
    const [ price, setPrice ] = React.useState(0)

    const [ block, setBlock ] = React.useState(false)
    const [ error, setError ] = React.useState('')


    React.useMemo(() => {
        _cef.on('ui::phone:cnn:cnn', cnn => setCNN(cnn))
        _cef.on('ui::phone:cnn:cnnID', cnnID => setCNNID(cnnID))
        _cef.on('ui::phone:cnn:price', price => setPrice(price))

        _cef.on('ui::phone:cnn:block', block => setBlock(block))
        _cef.on('ui::phone:cnn:error', error => setError(error))

        _cef.on('ui::phone:cnn:text', text => setText(text))
    }, [])

    return (
        <div className="apppage app-cnn" style={{display: !toggle ? 'none' : 'block'}}>
             <Modal toggle={error.length ? true : false} text={error} btns={['Ок']} onClick={btn => setError('')} />

            <header>
                СМИ | Подача объявления
                <span>Отредактируют быстро и дешево</span>
            </header>
            <section style={{display: !block ? 'block' : 'none'}}>
                <div className="page">
                    <div className="elem" onClick={() => _cef.event('client::phone:cnn:choice')}>
                        <h1>Какое СМИ предпочитаете?</h1>
                        <input type="text" disabled value={cnn} placeholder="Выбрать СМИ" />
                    </div>
                    <div className="elem">
                        <h1>Что отправляем?</h1>
                        <textarea value={text} onChange={event => setText(event.target.value)} maxlength="144" rows={6} onKeyDown={event => event.key === 'Enter' && event.preventDefault()} />
                    </div>
                </div>
                <div className="price">
                    <h1>Расчет:</h1>
                    <h2>
                        Стоимость объвл.:
                        <span>{!price ? 'Выберите СМИ' : price.toLocaleString() + '$ / символ'}</span>
                    </h2>
                    <h2>
                        Вы заплатите:
                        <span>{!price ? 'Выберите СМИ' : (price * text.length).toLocaleString() + '$'}</span>
                    </h2>
                </div>
                <div className="btns">
                    <button onClick={() => {
                        if(!cnn.length || !text.length)return
                        _cef.event('client::phone:cnn', `${cnnID};${text}`)
                    }} className={!cnn.length || !text.length ? 'disabled' : ''}>Отправить объявление</button>
                </div>
            </section>
            <section style={{display: block ? 'block' : 'none'}}>
                <div className="error">Ваше объявление еще обрабатывается</div>
                <div className="btns">
                    <button onClick={() => _cef.event('client::phone:cnn:cancel')}>Отозвать мое объявление</button>
                </div>
            </section>
        </div>
    )
}