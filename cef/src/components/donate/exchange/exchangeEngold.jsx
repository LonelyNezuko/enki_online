import React from 'react'

import _cef from '../../../modules/cef'

import './exchange.scss'

import { HiInformationCircle } from 'react-icons/hi'

export default function DonateExchangeEngold({ sToggle, show }) {
    const [ pageToggle, setPageToggle ] = React.useState(false)
    React.useEffect(() => {
        setPageToggle(sToggle)
    }, [sToggle])

    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        setToggle(show)

        setValueRub(1)
        setValueEngold(1 * course)
    }, [show])

    const [ course, setCourse ] = React.useState(3)
    React.useMemo(() => {
        _cef.on('ui::donate:exchange:engold:course', course => {
            setCourse(course)
            setValueEngold(valueRub * course)
        })
        _cef.on('ui::donate:exchange:engold:clear', () => {
            setValueRub(1)
            setValueEngold(1 * course)
        })
    }, [])

    const [ valueRub, setValueRub ] = React.useState(1)
    const [ valueEngold, setValueEngold ] = React.useState(3)

    return (
        <div style={{display: !pageToggle ? 'none' : 'flex'}} className={`exchange engold ${toggle && 'show'}`}>
            <div className="_coins top">
                <img src="assets/donate/exchange/engold.png" alt="" />
            </div>

            <div className="wrap">
                <div className="title">Обмен EnGold</div>
                <div className="desc">
                    <h1>Обменяйте свои рубли на EnGold</h1>
                    <HiInformationCircle />

                    <div className="info">
                        EnGold - Уникальное сокровище, за которое можно купить все!
                        <br />
                        <br />
                        Потратить cтоль драгоценное сокровище можно у NPC 'Хосе'
                        <br />
                        GPS - [ NPC ] Хосе
                        <br />
                        <br />
                        <br />
                        <span>Обмен нельзя отменить и/или вернуть средства обратно на аккаунт.</span>
                    </div>
                </div>
                <div className="input">
                    <section>
                        <span>Вы отдаете (Рубли)</span>
                        <input type="number" value={valueRub} onChange={event => {
                            let value = parseInt(event.target.value)

                            setValueRub(value)
                            setValueEngold(parseInt(value * course))
                        }} />
                    </section>
                    <h1>=</h1>
                    <section>
                        <span>Вы получаете (EnGold)</span>
                        <input type="number" value={valueEngold} onChange={event => {
                            let value = parseInt(event.target.value)

                            setValueEngold(value)
                            setValueRub(parseInt(value / course))
                        }} />
                    </section>
                </div>
                <div className="course">
                    1 RUB = {course.toLocaleString()} EnGold
                </div>
                <div className="buttons">
                    <button onClick={() => {
                        if(!isNaN(valueEngold) && valueEngold >= course) {
                            _cef.event('client::donate:buy', `14,${valueRub}`)
                        }
                    }} className={(!isNaN(valueEngold) && valueEngold >= course) ? "selected" : ""}>Обменять</button>
                </div>
            </div>
        </div>
    )
}