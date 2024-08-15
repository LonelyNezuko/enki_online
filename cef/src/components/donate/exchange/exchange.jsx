import React from 'react'

import _cef from '../../../modules/cef'

import './exchange.scss'

import { HiInformationCircle } from 'react-icons/hi'

export default function DonateExchange({ sToggle, show }) {
    const [ pageToggle, setPageToggle ] = React.useState(false)
    React.useEffect(() => {
        setPageToggle(sToggle)
    }, [sToggle])

    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        setToggle(show)

        setValueRub(1)
        setValueVirt(1 * course)
    }, [show])


    const [ course, setCourse ] = React.useState(2500)
    React.useMemo(() => {
        _cef.on('ui::donate:exchange:virt:course', course => {
            setCourse(course)
            setValueVirt(valueRub * course)
        })
        _cef.on('ui::donate:exchange:virt:clear', () => {
            setValueRub(1)
            setValueVirt(1 * course)
        })
    }, [])

    const [ valueRub, setValueRub ] = React.useState(1)
    const [ valueVirt, setValueVirt ] = React.useState(2500)

    return (
        <div style={{display: !pageToggle ? 'none' : 'flex'}} className={`exchange virt ${toggle && 'show'}`}>
            <div className="_coins top">
                <img src="assets/donate/exchange/top.png" alt="" />
            </div>
            <div className="_coins bottomLeft">
                <img src="assets/donate/exchange/bottomLeft.png" alt="" />
            </div>
            <div className="_coins bottomRight">
                <img src="assets/donate/exchange/bottomRight.png" alt="" />
            </div>

            <div className="wrap">
                <div className="title">Обмен валюты</div>
                <div className="desc">
                    <h1>Обменяйте свои рубли на вирты</h1>
                    <HiInformationCircle />

                    <div className="info">
                        <span>Обмен нельзя отменить и/или вернуть средства обратно на аккаунт.</span>
                    </div>
                </div>
                <div className="input">
                    <section>
                        <span>Вы отдаете (Рубли)</span>
                        <input type="number" value={valueRub} onChange={event => {
                            let value = parseInt(event.target.value)

                            setValueRub(value)
                            setValueVirt(parseInt(value * course))
                        }} />
                    </section>
                    <h1>=</h1>
                    <section>
                        <span>Вы получаете (Вирты)</span>
                        <input type="number" value={valueVirt} onChange={event => {
                            let value = parseInt(event.target.value)

                            setValueVirt(value)
                            setValueRub(parseInt(value / course))
                        }} />
                    </section>
                </div>
                <div className="course">
                    1 RUB = {course.toLocaleString()}$
                </div>
                <div className="buttons">
                    <button onClick={() => {
                        if(!isNaN(valueVirt) && valueVirt >= course) {
                            _cef.event('client::donate:buy', `0,${valueRub}`)
                        }
                    }} className={(!isNaN(valueVirt) && valueVirt >= course) ? "selected" : ""}>Обменять</button>
                </div>
            </div>
        </div>
    )
}