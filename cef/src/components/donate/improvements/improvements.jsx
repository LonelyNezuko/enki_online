import React from 'react'

import _cef from '../../../modules/cef'

import './improvements.scss'

export default function DonateImprovements({ sToggle }) {
    const [ pageToggle, setPageToggle ] = React.useState(false)
    React.useEffect(() => {
        setPageToggle(sToggle)
    }, [sToggle])

    const [ prices, setPrices ] = React.useState([0])
    React.useMemo(() => {
        _cef.on('ui::donate:improvements:prices', prices => setPrices(prices.split(',')))
    }, [])

    return (
        <div style={{display: !pageToggle ? 'none' : 'flex'}} className="improvements">
            <div className="elem alive">
                <div className="bg">
                    <img src="assets/donate/improvements/alive_bg.jpg" />
                </div>
                <div className="bwrap">
                    <div className="icon">
                        <img src="assets/donate/improvements/alive.png" />
                    </div>
                    <div className="title">Живой</div>
                    <div className="desc">С данным улучшением потребности больше никогда не будут вас беспокоить.</div>
                    <div className={`buttons ${!parseInt(prices[0]) && 'alreadybuying'}`}>
                        <div className="info">
                            <h1>Условия пользования</h1>
                            <div className="hover">После покупки улучшение остается на аккаунте навсегда</div>
                        </div>
                        <div className="wrap">
                            <button onClick={() => _cef.event('client::donate:buy', `7`)}>{!parseInt(prices[0]) ? "Уже приобретено" : "Приобрести"}</button>
                            {!parseInt(prices[0]) ? '' : (<button className="price">{parseInt(prices[0]).toLocaleString()} RUB</button>)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}