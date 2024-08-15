import React from 'react'

import $ from 'jquery'
import 'jquery-mousewheel'

import _cef from '../../../modules/cef'

import './vip.scss'

export default function DonateVip({ sToggle }) {
    const [ pageToggle, setPageToggle ] = React.useState(false)
    React.useEffect(() => {
        setPageToggle(sToggle)
    }, [sToggle])

    React.useMemo(() => {
        $('body').on('mousewheel', '.donate .vip', (event, delta) => {
            event.currentTarget.scrollLeft -= (delta * 40)
        })
    }, [])


    const [ course, setCourse ] = React.useState(2500)
    const [ prices, setPrices ] = React.useState([ 499, 999 ])
    const [ isVip, setIsVip ] = React.useState(0)

    React.useMemo(() => {
        _cef.on('ui::donate:vip:course', course => setCourse(course))
        _cef.on('ui::donate:vip:prices', prices => setPrices(prices.split(',')))
        _cef.on('ui::donate:vip:isvip', isvip => setIsVip(isvip))
    }, [])

    return (
        <div style={{display: !pageToggle ? 'none' : 'flex'}} className="vip">
            <div className="elem">
                <div className="title">Memory VIP</div>
                <div className="desc">Для тех, кто не хочет быть позади, но и не стремиться вырваться далеко вперед!</div>
                <div className="icon">
                    <img src="assets/donate/vip/memory.png" />
                </div>
                <div className="bonus">
                    <li>Бонус к зарплатам на начальных работах</li>
                    <li>Вы будете испытывать чувство голода реже</li>
                    <li>Субсидия на налоги любого имущества в <span>35%</span></li>
                    <li>Вы будете лечиться в больнице быстрее</li>
                    <li>Вы сможете иметь <span>2 транспорта</span> одновременно</li>
                    <li>Депозит счёт в банке увеличен до <span>10.000.000$</span></li>
                    <li>Чисто символические <span>{(100 * course).toLocaleString()}$</span> после покупки VIP статуса</li>
                </div>
                <div className={`buttons ${isVip && 'alreadybuying'}`}>
                    <div className="info">
                        <h1>Условия пользования</h1>
                        <div className="hover">
                            Данный VIP статус покупается на 30 дней, по истечению которых он будет снят с аккаунта.
                            <br />
                            Для продления необходимо будет повторно приобрести VIP статус в магазине.
                            <br />
                            Покупку нельзя отменить и/или вернуть средства на аккаунт.
                            <br />
                            <br />
                            Преимущества VIP статуса активны только во время активности самого VIP статуса.
                            <br />
                            Средства выдаваемые при покупке VIP статуса, транспорт купленный во время активности VIP статуса,
                            <br />
                            а так же деньги, положенные на депозит во время активности VIP статуса будут сохранены после истечения срока VIP статуса.
                            <br />
                            <br />
                            Покупая данный VIP статус Вы соглашаетесь со всеми условиями пользования!
                        </div>
                    </div>
                    <div className="wrap">
                        <button onClick={() => _cef.event('client::donate:buy', `15`)}>{isVip ? "VIP статус уже активен" : "Приобрести"}</button>
                        {!isVip ? (<button className="price">{prices[0].toLocaleString()} RUB</button>) : ''}
                    </div>
                </div>
            </div>
            <div className="elem">
                <div className="title">Atomic VIP</div>
                <div className="desc">Вы уверенный в себе человек, жаждающий власти и первенства во всем!</div>
                <div className="icon">
                    <img src="assets/donate/vip/atomic.png" />
                </div>
                <div className="bonus">
                    <li>Бонусы Memory VIP</li>
                    <li>Вы сможете иметь <span>3 транспорта</span> одновременно</li>
                    <li>Вы сможете иметь <span>2 дома</span> и <span>2 бизнеса</span> одновременно</li>
                    <li>Бонус к зарплатам на всех работах</li>
                    <li>Депозит счёт в банке увеличен до <span>30.000.000$</span></li>
                    <li>Каждый час (PayDay) Вы будете получать <span>+1 к опыту</span> аккаунта</li>
                    <li>Отдельный чат сервера для всех обладателей <span>Atomic VIP</span> и выше (/v)</li>
                    <li>При стадии смерти у Вас будет выбор: Оставаться на месте или сразу отправиться в больницу</li>
                    <li>Скидки на улучшения для персонажа в <span>10%</span></li>
                    <li>Чисто символические <span>{(400 * course).toLocaleString()}$</span> после покупки VIP статуса</li>
                </div>
                <div className={`buttons ${isVip && 'alreadybuying'}`}>
                    <div className="info">
                        <h1>Условия пользования</h1>
                        <div className="hover">
                            Данный VIP статус покупается на 30 дней, по истечению которых он будет снят с аккаунта.
                            <br />
                            Для продления необходимо будет повторно приобрести VIP статус в магазине.
                            <br />
                            Покупку нельзя отменить и/или вернуть средства на аккаунт.
                            <br />
                            <br />
                            Преимущества VIP статуса активны только во время активности самого VIP статуса.
                            <br />
                            Средства выдаваемые при покупке VIP статуса, транспорт, бизнесы, дома купленные во время активности VIP статуса,
                            <br />
                            деньги, положенные на депозит во время активности VIP статуса, а так же опыт, полученный во время активности VIP статуса
                            <br />
                            будут сохранены после истечения срока VIP статуса.
                            <br />
                            <br />
                            Покупая данный VIP статус Вы соглашаетесь со всеми условиями пользования!
                        </div>
                    </div>
                    <div className="wrap">
                        <button onClick={() => _cef.event('client::donate:buy', `16`)}>{isVip ? "VIP статус уже активен" : "Приобрести"}</button>
                        {!isVip ? (<button className="price">{prices[1].toLocaleString()} RUB</button>) : ''}
                    </div>
                </div>
            </div>
        </div>
    )
}