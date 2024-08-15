import React from 'react'

import _cef from '../../../modules/cef'

import './other.scss'

export default function DonateOther({ sToggle }) {
    const [ pageToggle, setPageToggle ] = React.useState(false)
    React.useEffect(() => {
        setPageToggle(sToggle)
    }, [sToggle])

    const [ prices, setPrices ] = React.useState([ 500, 1500, 0 ])
    React.useMemo(() => {
        _cef.on('ui::donate:other:prices', prices => setPrices(prices.split(',')))
    }, [])

    const [ username, setUsername ] = React.useState('')

    return (
        <div style={{display: !pageToggle ? 'none' : 'flex'}} className="other improvements">
            <div className="elem">
                <div className="icon">
                    <img src="assets/donate/other/changename.png" />
                </div>
                <div className="title">Смена личности</div>
                <div className="desc">Изменение Вашего Никнейма</div>
                <div className="buttons">
                    <div className="input">
                        <input type="text" placeholder="Введите новый никнейм" maxLength="24" value={username} onChange={event => setUsername(event.target.value)} />
                    </div>
                    <div className="wrap">
                        <button onClick={() => {
                            if(!username.length)return
                            _cef.event('client::donate:buy', `1,${username}`)
                        }}>Изменить</button>
                        <button className="price">{prices[0].toLocaleString()} RUB</button>
                    </div>
                </div>
            </div>
            <div className="elem">
                <div className="icon">
                    <img src="assets/donate/other/unwarn.png" />
                </div>
                <div className="title">Исправившийся</div>
                <div className="desc">Снимает с Вас одно предупреждение</div>
                <div className={`buttons ${!parseInt(prices[1]) && 'alreadybuying'}`}>
                    <div className="wrap">
                        <button onClick={() => _cef.event('client::donate:buy', `2`)}>{!parseInt(prices[1]) ? "У Вас нет предупреждений" : "Приобрести"}</button>
                        {!parseInt(prices[1]) ? '' : (<button className="price">{parseInt(prices[1]).toLocaleString()} RUB</button>)}
                    </div>
                </div>
            </div>
            <div className="elem">
                <div className="icon">
                    <img src="assets/donate/other/skills.png" />
                </div>
                <div className="title">Стрелок</div>
                <div className="desc">Прокачивает все Ваши навыки стрельбы на 100%</div>
                <div className={`buttons ${!parseInt(prices[2]) && 'alreadybuying'}`}>
                    <div className="wrap">
                        <button onClick={() => _cef.event('client::donate:buy', `6`)}>{!parseInt(prices[2]) ? "У Вас прокачены все навыки" : "Приобрести"}</button>
                        {!parseInt(prices[2]) ? '' : (<button className="price">{parseInt(prices[2]).toLocaleString()} RUB</button>)}
                    </div>
                </div>
            </div>
        </div>
    )
}