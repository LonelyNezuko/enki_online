import React from 'react'
import $ from 'jquery'

import _cef from '../../modules/cef'

import './donate.scss'

import { IoClose } from 'react-icons/io5'

import DonateExchange from './exchange/exchange'
import DonateExchangeEngold from './exchange/exchangeEngold'
import DonateVip from './vip/vip'
import DonateImprovements from './improvements/improvements'
import DonateSim from './sim/sim'
import DonateAccessories from './accessories/accessories'
import DonateOther from './other/other'

export default function Donate() {
    const [ toggle, setToggle ] = React.useState(false)

    const [ page, setPage ] = React.useState('exchange')
    const [ exchangeSwitch, setExchangeSwitch ] = React.useState(false)

    const [ balance, setBalance ] = React.useState(29582832)
    React.useMemo(() => {
        _cef.on('ui::donate:toggle', toggle => {
            setToggle(toggle)
            setPage('exchange')
        })

        _cef.on('ui::donate:balance', balance => setBalance(balance))

        $(document).keyup(elem =>
        {
            if($('.donate').css('display') !== 'none'
                && elem.key === 'Escape') _cef.event('client::donate:close')
        });
    }, [])

    return (
        <div className="donate" style={{display: !toggle ? 'none' : 'flex'}}>
            <div className="nav">
                <div className="header">Магазин</div>
                <nav>
                    <li onClick={() => setPage('exchange')} className={page === 'exchange' ? "selected" : ''}>Обменник</li>
                    <li onClick={() => setPage('vip')} className={page === 'vip' ? "selected" : ''}>VIP статусы</li>
                    <li onClick={() => setPage('improvements')} className={page === 'improvements' ? "selected" : ''}>Улучшения</li>
                    <li onClick={() => setPage('accessories')} className={page === 'accessories' ? "selected" : ''}>Аксессуары</li>
                    <li onClick={() => setPage('sim')} className={page === 'sim' ? "selected" : ''}>Сим-карты</li>
                    <li onClick={() => setPage('other')} className={page === 'other' ? "selected" : ''}>Прочее</li>
                </nav>
            </div>
            <div className="wrapper">
                <div className="header">
                    <div className="donateScore">
                        <h1>Ваш баланс:</h1>
                        <button>{balance.toLocaleString()} RUB</button>
                    </div>
                    <div className="switch" style={{display: page !== 'exchange' ? 'none' : 'flex'}}>
                        <h1>Валюта</h1>
                        <input type="checkbox" className="switch" checked={exchangeSwitch} onChange={event => setExchangeSwitch(event.target.checked)} />
                        <h1>EnGold</h1>
                    </div>
                    <div className="close" onClick={() => _cef.event('client::donate:close')}>
                        <IoClose />
                    </div>
                </div>
                <div className="body">
                    <DonateExchange sToggle={page === 'exchange' ? true : false} show={!exchangeSwitch ? true : false} />
                    <DonateExchangeEngold sToggle={page === 'exchange' ? true : false} show={exchangeSwitch ? true : false} />
                    <DonateVip sToggle={page === 'vip' ? true : false} />
                    <DonateImprovements sToggle={page === 'improvements' ? true : false} />
                    <DonateSim sToggle={page === 'sim' ? true : false} />
                    <DonateOther sToggle={page === 'other' ? true : false} />
                    <DonateAccessories sToggle={page === 'accessories' ? true : false} />
                </div>
            </div>
        </div>
    )
}