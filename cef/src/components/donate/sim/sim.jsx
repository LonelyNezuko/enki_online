import React from 'react'

import _cef from '../../../modules/cef'
import func from '../../../modules/func'

import './sim.scss'

import { RxUpdate } from 'react-icons/rx'

export default function DonateSim({ sToggle }) {
    const [ pageToggle, setPageToggle ] = React.useState(false)
    React.useEffect(() => {
        setPageToggle(sToggle)

        setNumbers([ '', func.random(10000, 99999), '' ])
    }, [sToggle])

    const [ prices, setPrices ] = React.useState([ 699, 299, 1599 ])
    React.useMemo(() => {
        _cef.on('ui::donate:sim:prices', prices => setPrices(prices.split(',')))
    }, [])

    const [ numbers, setNumbers ] = React.useState([ 0, 0, '' ])
    return (
        <div style={{display: !pageToggle ? 'none' : 'flex'}} className="sim improvements">
            <div className="elem">
                <div className="icon">
                    <img src="assets/donate/sim/sim5.png" />
                </div>
                <div className="right">
                    <div className="title">5ти значная сим-карта</div>
                    <div className="desc">5ти значная сим-карта на выбор</div>
                    <div className="buttons">
                        <div className="input">
                            <input type="text" placeholder="Введите номер" value={func.formatPhoneNumber(numbers[0])} onKeyDown={event => {
                                if(event.key === 'Backspace') {
                                    if(!numbers[0])return
                                    return setNumbers([ numbers[0].substring(0, numbers[2].length - 1), numbers[1], numbers[2] ])
                                }

                                const num = parseInt(event.key)
                                if(isNaN(num) || (!numbers[0] && num === 0) || numbers[0].length >= 5)return

                                setNumbers([ numbers[0] + event.key, numbers[1], numbers[2] ])
                            }} />
                        </div>
                        <div className="wrap">
                            <button onClick={() => _cef.event('client::donate:buy', `12,${numbers[0]}`)}>Приобрести</button>
                            <button className="price">{prices[0].toLocaleString()} RUB</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="elem">
                <div className="title">5ти значная сим-карта</div>
                <div className="desc">Рандомная 5ти значная сим-карта</div>
                <div className="buttons">
                    <div className="input">
                        <input type="text" disabled value={func.formatPhoneNumber(numbers[1])} />
                        <RxUpdate onClick={() => setNumbers([ numbers[0], func.random(10000, 99999), numbers[2] ])} />
                    </div>
                    <div className="wrap">
                        <button onClick={() => _cef.event('client::donate:buy', `11,${numbers[1]}`)}>Приобрести</button>
                        <button className="price">{prices[1].toLocaleString()} RUB</button>
                    </div>
                </div>
            </div>
            <div className="elem">
                <div className="title">Обычная сим-карта</div>
                <div className="desc">Обычная сим-карта на выбор</div>
                <div className="buttons">
                    <div className="input">
                        <input type="text" placeholder="Введите номер" value={func.formatPhoneNumber(numbers[2])} onKeyDown={event => {
                            if(event.key === 'Backspace') {
                                if(!numbers[2])return
                                return setNumbers([ numbers[0], numbers[1], numbers[2].substring(0, numbers[2].length - 1) ])
                            }

                            const num = parseInt(event.key)
                            if(isNaN(num) || (!numbers[2] && num === 0) || numbers[2].length >= 7)return

                            setNumbers([ numbers[0], numbers[1], numbers[2] + event.key ])
                        }} />
                    </div>
                    <div className="wrap">
                        <button onClick={() => _cef.event('client::donate:buy', `13,${numbers[2]}`)}>Приобрести</button>
                        <button className="price">{prices[2].toLocaleString()} RUB</button>
                    </div>
                </div>
            </div>
        </div>
    )
}