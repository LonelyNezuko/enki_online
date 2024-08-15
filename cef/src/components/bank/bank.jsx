import React from 'react'

import $ from 'jquery'
import 'jquery-mousewheel'

import func from '../../modules/func'
import _cef from '../../modules/cef'

import './bank.scss'

import { IoClose } from 'react-icons/io5'
import { IoCloseCircle } from 'react-icons/io5'

import { CgInfinity } from 'react-icons/cg'

import { IoCard } from 'react-icons/io5' // перевод на карту
import { MdSmartphone } from 'react-icons/md' // пополнить сим карту
import { TbBrandCashapp } from 'react-icons/tb' // пополнить карту
import { FaCoins } from 'react-icons/fa' // снять с карты

import { GiPiggyBank } from 'react-icons/gi' // пополнить депозит
import { FaPiggyBank } from 'react-icons/fa' // снять с депозита

import { MdBusinessCenter } from 'react-icons/md' // бизнес
import { IoBusinessSharp } from 'react-icons/io5' // ТК
import { TiGroup } from 'react-icons/ti' // фракция

import { SiAnalogue } from 'react-icons/si' // налоги

import { TbLock } from 'react-icons/tb'

export default function Bank() {
    const [ toggle, setToggle ] = React.useState(false)

    const [ cash, setCash ] = React.useState(0)
    const [ deposite, setDeposite ] = React.useState(0)

    const [ accountName, setAccountName ] = React.useState('')
    const [ accountLevel, setAccountLevel ] = React.useState(0)

    const [ biz, setBiz ] = React.useState(false)
    const [ tk, setTK ] = React.useState(false)
    const [ fraction, setFraction ] = React.useState(false)

    const [ history, setHistory ] = React.useState([
        { type: 'incash', count: 50293, desc: "Счет был пополнен 14.06.2023 в 4:41. Комиссия банка составила: 1%", title: "Пополнение счета" },
        { type: 'outcash', count: -2333, desc: "Со счета было снято 14.06.2023 в 4:41. Комиссия банка составила: 1%", title: "Снятие со счета" },
        { type: 'sim', count: -50, desc: "Пополнение услуг связи 14.06.2023 в 4:41. Номер телефона: 8-800-555-35-35", title: "Сотовая связь" },
        { type: 'nalog', count: -750, desc: "Оплата налогов на Дом 14.06.2023 в 4:41", title: "Оплата налогов" },
        { type: 'fractionin', count: 18592039, desc: "Пополнение счета фракции Los Santos Police Deportment. Время: 14.06.2023 в 4:41. Комиссия банка: 1%", title: "Счет фракции" },
        { type: 'fractionout', count: -58293, desc: "Снятие со счета фракции Los Santos Police Deportment. Время: 14.06.2023 в 4:41. Комиссия банка: 1%", title: "Счет фракции" },
        { type: 'depositein', count: 59999, desc: "Пополнение депозитного счета 14.06.2023 в 4:41. Комиссия банка составила: 5%", title: "Депозитный счет" },
        { type: 'depositeout', count: -100000, desc: "Снятие с депозитного счета 14.06.2023 в 4:41. Комиссия банка составила: 5%", title: "Депозитный счет" },
        { type: 'bizin', count: 59999, desc: "Пополнение счета бизнеса #231 14.06.2023 в 4:41. Комиссия банка составила: 1%", title: "Бизнес" },
        { type: 'bizout', count: -100000, desc: "Снятие со счета бизнеса #231 14.06.2023 в 4:41. Комиссия банка составила: 1%", title: "Бизнес" },
        { type: 'tkin', count: 59999, desc: "Пополнение счета Транспортной компании #2 14.06.2023 в 4:41. Комиссия банка составила: 1%", title: "Транс. компания" },
        { type: 'tkout', count: -100000, desc: "Снятие со счета Транспортной компании #2 #231 14.06.2023 в 4:41. Комиссия банка составила: 1%", title: "Транс. компания" }
    ])

    const [ cardSelected, setCardSelected ] = React.useState(0)
    const [ menuSelected, setMenuSelected ] = React.useState(0)

    const [ incash, setIncash ] = React.useState({
        toggle: 0,
        cash: ''
    })
    function incashSubmit() {
        if(!incash.cash.length)return false
        
        const count = parseInt(incash.cash)

        if(isNaN(count))return notifyAdd('Не верная сумма')
        if(incash.toggle === 2 && count > cash)return notifyAdd('У Вас не хватает средств на счету')

        if(incash.toggle === 1) _cef.event('client::bank:incash', `${count}`)
        else if(incash.toggle === 2) _cef.event('client::bank:outcash', `${count}`)
    }

    const [ transfer, setTransfer ] = React.useState({
        toggle: false,

        username: '',
        cash: ''
    })
    function transferSubmit() {
        transfer.username = transfer.username.replaceAll(';', '')

        if(!transfer.username.length
            || !transfer.cash.length)return false
        
        const count = parseInt(transfer.cash)

        if(isNaN(count))return notifyAdd('Не верная сумма')
        if(count > cash)return notifyAdd('У Вас не хватает средств на счету')

        _cef.event('client::bank:transfer', `${transfer.username};${count}`)
    }


    const [ notify, setNotify ] = React.useState([])
    function notifyAdd(text, type = 'error') {
        const id = func.random(0, 9999999999)
		setNotify(old => { return [...old, [type, text, id, setTimeout(() => {
			const arr = JSON.parse($('.banknotify').attr('data-array')).filter(el => el[2] !== id)
			setNotify(i => { return [...arr] })
		}, 5000)]] })
    }


    React.useMemo(() => {
        $('body').on('mousewheel', '.bank #bankHistoryDiv', (event, delta) => {
            event.currentTarget.scrollLeft -= (delta * 30)
        })
        $(document).keyup(event => {
            if($('.bank').css('display') !== 'none'
                && event.key === 'Escape') _cef.event('client::bank:close')
        })

        _cef.on('ui::bank:toggle', toggle => {
            setCardSelected(0)
            setMenuSelected(0)

            setIncash({
                toggle: 0,
                cash: ''
            })
            setTransfer({
                toggle: 0,

                username: '',
                cash: ''
            })

            setToggle(toggle)
        })
        _cef.on('ui::bank:notifyAdd', (text, type) => notifyAdd(text, type))

        _cef.on('ui::bank:cash', cash => setCash(parseInt(cash)))
        _cef.on('ui::bank:deposite', deposite => setDeposite(parseInt(deposite)))
        _cef.on('ui::bank:accountName', accountName => setAccountName(accountName))
        _cef.on('ui::bank:accountLevel', accountLevel => setAccountLevel(parseInt(accountLevel)))
        _cef.on('ui::bank:biz', biz => setBiz(biz))
        _cef.on('ui::bank:tk', tk => setTK(tk))
        _cef.on('ui::bank:fraction', fraction => setFraction(fraction))


        let tempHistory = []
        _cef.on('ui::bank:history:clear', () => {
            tempHistory = []
        })
        _cef.on('ui::bank:history:insert', data => {
            // 'type;count;desc;title'

            let array = data.split(';')
            tempHistory.push({ type: array[0], count: parseInt(array[1]), desc: array[2], title: array[3] })
        })
        _cef.on('ui::bank:history:add', data => {
            // 'type;count;desc;title'

            let array = data.split(';')
            setHistory(old => {
                return [{ type: array[0], count: parseInt(array[1]), desc: array[2], title: array[3] }, ...old]
            })
        })
        _cef.on('ui::bank:history:submit', () => {
            setHistory(tempHistory)
        })

        _cef.on('ui::bank:clearIncash', () => setIncash({ toggle: true, cash: '' }))
        _cef.on('ui::bank:clearTransfer', () => setTransfer({ ...transfer, cash: '' }))
    }, [])

    return (
        <div className="bank" style={{display: !toggle ? 'none' : 'block'}}>
            <header>
                <div className="empty">&nbsp;</div>
                <div className="logo">
                    <img src="assets/bank/logo.png" />
                </div>
                <div className="close" onClick={() => _cef.event('client::bank:close')}>
                    <IoClose />
                </div>
            </header>
            <div className="body">
                <div className="cardmenu">
                    <div className="wrapper">
                        <div className="cardlist">
                            <div className="card" style={{transform: `translateX(${cardSelected * -100}%)`}}>
                                <div className="type">
                                    <h1 className="cash">{cash.toLocaleString()}$</h1>
                                    <img src="assets/bank/visa.png" />
                                </div>
                                <div className="number">
                                    <span>****</span>
                                    <span>****</span>
                                    <span>****</span>
                                    <span>CARD</span>
                                </div>
                                <div className="data">
                                    <div className="owner">
                                        <span>Держатель</span>
                                        <h1>{accountName}</h1>
                                    </div>
                                    <div className="time">
                                        <span>Срок</span>
                                        <h1>
                                            <CgInfinity />
                                        </h1>
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{backgroundImage: 'url(assets/bank/cardbg/deposite.png)', transform: `translateX(${cardSelected * -100}%)`, display: accountLevel < 5 ? "none" : 'flex'}}>
                                <div className="type">
                                    <h1 className="cash">{deposite.toLocaleString()}$</h1>
                                    <img src="assets/bank/visa.png" />
                                </div>
                                <div className="number">
                                    <span>****</span>
                                    <span>****</span>
                                    <span>****</span>
                                    <span>DEPOSITE</span>
                                </div>
                                <div className="data">
                                    <div className="owner">
                                        <span>Держатель</span>
                                        <h1>{accountName}</h1>
                                    </div>
                                    <div className="time">
                                        <span>Срок</span>
                                        <h1>
                                            <CgInfinity />
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="nav" style={{display: accountLevel < 5 ? "none" : 'flex'}}>
                            <button onClick={() => setCardSelected(0)} className={cardSelected === 0 && 'selected'}></button>
                            <button onClick={() => setCardSelected(1)} className={cardSelected === 1 && 'selected'}></button>
                        </div>
                    </div>
                    <div className="wrapper">
                        <div className="menulist">
                            <div className="menu" style={{transform: `translateX(${menuSelected * -100}%)`}}>
                                <button onClick={() => {
                                    if(accountLevel < 4)return

                                    setTransfer({ toggle: true, username: '', cash: '' })
                                    _cef.event('client::bank:menu', `1`)
                                }} className={accountLevel < 4 && 'blocked'}>
                                    <IoCard />
                                    <h1>
                                        Перевод на карту
                                        <span style={{display: accountLevel >= 4 ? 'none' : 'block'}}>Будет доступно после 4 уровня</span>
                                    </h1>
                                    {accountLevel < 4 ? (<TbLock />) : ''}
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `2`)}>
                                    <MdSmartphone />
                                    <h1>Сотовая связь</h1>
                                </button>
                                <button onClick={() => setIncash({ toggle: 1, cash: '' }, _cef.event('client::bank:menu', `3`))}>
                                    <TbBrandCashapp />
                                    <h1>Пополнить счет</h1>
                                </button>
                                <button onClick={() => setIncash({ toggle: 2, cash: '' }, _cef.event('client::bank:menu', `4`))}>
                                    <FaCoins />
                                    <h1>Снять со счета</h1>
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `5`)}>
                                    <SiAnalogue />
                                    <h1>Оплатить налоги</h1>
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `6`)} style={{backgroundColor: "#3072b3"}}>
                                    <TiGroup />
                                    <h1>Пополнить счет фракции</h1>
                                </button>
                            </div>
                            <div className="menu" style={{transform: `translateX(${menuSelected * -100}%)`}}>
                                <button onClick={() => _cef.event('client::bank:menu', `7`)} className={accountLevel < 5 ? 'blocked' : ''}>
                                    <GiPiggyBank />
                                    <h1>
                                        Пополнить депозит
                                        <span style={{display: accountLevel >= 5 ? 'none' : 'block'}}>Будет доступно с 5 уровня</span>
                                    </h1>
                                    {accountLevel < 5 ? (<TbLock />) : ''}
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `8`)} className={accountLevel < 5 ? 'blocked' : ''}>
                                    <FaPiggyBank />
                                    <h1>
                                        Снять с депозита
                                        <span style={{display: accountLevel >= 5 ? 'none' : 'block'}}>Будет доступно с 5 уровня</span>
                                    </h1>
                                    {accountLevel < 5 ? (<TbLock />) : ''}
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `9`)} className={!biz && 'blocked'} style={{backgroundColor: "#2f9543"}}>
                                    <MdBusinessCenter />
                                    <h1>
                                        Пополнить счет бизнеса
                                        <span style={{display: biz ? 'none' : 'block'}}>У Вас нет бизнесов</span>
                                    </h1>
                                    {!biz ? (<TbLock />) : ''}
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `10`)} className={!biz && 'blocked'} style={{backgroundColor: "#2f9543"}}>
                                    <MdBusinessCenter />
                                    <h1>
                                        Снять со счета бизнеса
                                        <span style={{display: biz ? 'none' : 'block'}}>У Вас нет бизнесов</span>
                                    </h1>
                                    {!biz ? (<TbLock />) : ''}
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `11`)} className={!tk && 'blocked'} style={{backgroundColor: "#459b93"}}>
                                    <IoBusinessSharp />
                                    <h1>
                                        Пополнить счет ТК
                                        <span style={{display: tk ? 'none' : 'block'}}>У Вас нет ТК</span>
                                    </h1>
                                    {!tk ? (<TbLock />) : ''}
                                </button>
                                <button onClick={() => _cef.event('client::bank:menu', `12`)} className={!tk && 'blocked'} style={{backgroundColor: "#459b93"}}>
                                    <IoBusinessSharp />
                                    <h1>
                                        Снять со счета ТК
                                        <span style={{display: tk ? 'none' : 'block'}}>У Вас нет ТК</span>
                                    </h1>
                                    {!tk ? (<TbLock />) : ''}
                                </button>
                            </div>
                            <div className="menu" style={{transform: `translateX(${menuSelected * -100}%)`, alignItems: "flex-start"}}>
                                <button onClick={() => _cef.event('client::bank:menu', `13`)} className={!fraction && 'blocked'} style={{backgroundColor: "#3072b3"}}>
                                    <TiGroup />
                                    <h1>
                                        Снять со счета фракции
                                        <span style={{display: fraction ? 'none' : 'block'}}>Вы не лидер фракции</span>
                                    </h1>
                                    {!fraction ? (<TbLock />) : ''}
                                </button>
                            </div>
                        </div>
                        <div className="nav">
                            <button onClick={() => setMenuSelected(0)} className={menuSelected === 0 && 'selected'}></button>
                            <button onClick={() => setMenuSelected(1)} className={menuSelected === 1 && 'selected'}></button>
                            <button onClick={() => setMenuSelected(2)} className={menuSelected === 2 && 'selected'}></button>
                        </div>
                    </div>
                </div>
                <div className="history">
                    <div className="title">История операций</div>
                    <div className="list" id="bankHistoryDiv">
                        {history.map((item, i) => {
                            return (
                                <div className="elem">
                                    <div className="icon">
                                        <img src={`assets/bank/historyIcons/${item.count < 0 ? 'cashout' : 'cashin'}.png`} />
                                    </div>
                                    <div className="desc">
                                        <h1>
                                            {item.title}
                                            <span className={`cash ${item.count < 0 && 'remove'}`}>{item.count.toLocaleString()}$</span>
                                        </h1>
                                        <h2>{item.desc}</h2>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="modal modalIncash" style={{display: !incash.toggle ? 'none' : 'flex'}}>
                <div className="wrapper">
                    <div className="titleimg">
                        <img src="assets/bank/modalInCash.png" />
                    </div>
                    <div className="cardinfo">
                        <img src="assets/bank/cardbg/mini.png" />
                        <div className="desc">
                            <h1>**** **** **** CARD</h1>
                            <h2 className="cash">{cash.toLocaleString()}$</h2>
                        </div>
                    </div>
                    <div className="form">
                        {incash === 1 ? (<TbBrandCashapp />) : (<FaCoins />)}
                        <input type="number" placeholder={`Введите сумму для ${incash.toggle === 1 ? "пополнения" : "снятия"}`} value={incash.cash} onChange={event => setIncash({...incash, cash: event.target.value})} />
                    </div>
                    <div className="action">
                        <button onClick={() => setIncash({ toggle: 0, cash: '' })}>Отмена</button>
                        <button onClick={() => incashSubmit()}>{incash.toggle === 1 ? "Пополнить" : "Снять"}</button>
                    </div>
                </div>
            </div>
            <div className="modal modalTransfer" style={{display: !transfer.toggle ? 'none' : 'block'}}>
                <div className="title">Перевод на карту</div>
                <div className="elem">
                    <div className="subtitle">Реквизиты:</div>
                    <div className="data">
                        <div className="form">
                            <IoCard />
                            <input type="text" placeholder="Ник игрока" value={transfer.username} onChange={event => setTransfer({...transfer, username: event.target.value})} />
                            <div className="clear" onClick={() => setTransfer({...transfer, username: ''})}>
                                <IoCloseCircle />
                            </div>
                        </div>
                        <div className="form">
                            <TbBrandCashapp />
                            <input type="number" placeholder="Переводимая сумма" value={transfer.cash} onChange={event => setTransfer({...transfer, cash: event.target.value})} />
                            <div className="clear" onClick={() => setTransfer({...transfer, cash: ''})}>
                                <IoCloseCircle />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="elem cardlist">
                    <div className="subtitle">С карты:</div>
                    <div className="list">
                        <div className="cardinfo">
                            <img src="assets/bank/cardbg/mini.png" />
                            <div className="desc">
                                <h1>**** **** **** CARD</h1>
                                <h2 className="cash">{cash.toLocaleString()}$</h2>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="action">
                    <button onClick={() => setTransfer({ toggle: false, username: '', cash: '' })}>Отмена</button>
                    <button onClick={() => transferSubmit()}>Перевести</button>
                </div>
            </div>

            <div className="banknotify" data-array={JSON.stringify(notify)}>
                {notify.map((item, i) => {
                    return (<div className={item[0]}>{item[1]}</div>)
                })}
            </div>
        </div>
    )
}