import React from 'react'
import $ from 'jquery'
import { Link, useLocation } from 'react-router-dom'

import Moment from 'moment'
import 'moment/locale/ru'

import Loader from '../../components/loader/loader'
import Avatar from '../../components/avatar/avatar'
import AgeText from '../../modules/ageText'
import { returnInvItemDataForModel } from '../../modules/invItems'
import AccountBanModal from '../../components/_modals/accountBan/accountBan'
import Logs from '../../components/logs/logs'

import './index.scss'
import returnJobNames from '../../modules/jobNames'

import { TbShieldLockFilled } from 'react-icons/tb'

export default function IndexRoute() {
    const location = useLocation()

    const [ loadStatus, setLoadStatus ] = React.useState({
        account: false
    })
    const CONFIG = require('../../config.json')

    const [ account, setAccount ] = React.useState({
        pID: 1,
        pName: 'LonelyNezuko',
        pEmail: '@mail.ru',

        pRegDate: '2023-05-07 10:55:32',

        pSex: 0,
        pAge: 23,

        pLevel: 1,
        pExp: 0,
        
        pSkin: 18,

        pCash: 200,
        
        pWarn: 0,
        pWarnTime: 0,

        pLastEnter: new Date() - 1000000000000000,

        pMute: 3600,
        pJail: 0,

        pFraction: -1,
        pRank: 0,

        pSetSpawn: 0,
        
        pDonate: 0,

        pBank: 0,
        pBankCash: 0,

        pOnline: -1,
        pJob: 0,

        pDeposit: 0,
        pAcs: '0, 19350, 0, 0, 3026, 0',

        pWanted: 2,
        pWantedData: '-,-',

        pWedding: 2,
        pWeddingName: 'Nezuko_Kamado',

        pSkills: '1000, 1000, 232, 0, 513, 0, 758',

        pGoogleAuth: 0,

        pUpExp: 0,
        pPrison: 105923,

        invModel: '20, 21, 22, 23, 24, 26',
        invCustom: '',
        invQuantity: '',
        invSimCost: ''
    })
    const [ otherDataPage, setOtherDataPage ] = React.useState(0)

    const [ accountBan, setAccountBan ] = React.useState({})

    // const [ logs, setLogs ] = React.useState([
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    //     { date: Moment(new Date()).format('DD.MM.YYYY, HH.mm.SS'), text: 'Вышел с IP: такой то' },
    // ])

    // эмуляция загрузки данных
    React.useMemo(() => {
        console.log('start')
        setLoadStatus({...loadStatus, account: false})
        setTimeout(() => {
            console.log('stop')
            setLoadStatus({...loadStatus, account: true})
        }, 0)
    }, [])
    return (
        <>
            {location.hash.indexOf('#banInfo') !== -1 && accountBan.banPlayerID ? (
                <AccountBanModal props={accountBan} />
            ) : ''}
            {!loadStatus.account ? (
                <div className="_center">
                    <Loader />
                </div>
            ) : ''}
            <div id="indexPage" style={{display: !loadStatus.account ? 'none' : 'block'}}>
                <div className="body main">
                    <div className="wrapCover">
                        {accountBan.banPlayerID ? (
                            <div className="baninfo">
                                <div className="desc">
                                    <div className="icon">
                                        <TbShieldLockFilled />
                                    </div>
                                    <div className="info">
                                        <h1>Аккаунт заблокирован</h1>
                                        <span>Данный аккаунт заблокирован администратором <Link to={`/account/${accountBan.banAdminID}`} className="link">{accountBan.banAdminName}</Link></span>
                                    </div>
                                </div>
                                <div className="button">
                                    <Link to="#banInfo" className="btn color">Подробнее</Link>
                                </div>
                            </div>
                        ) : ''}
                        <div className="wrap">
                            <div className="wrapper">
                                <div className="mainInfo">
                                    <div className="account">
                                        <Avatar status={account.pOnline === -1 ? 'offline' : 'online'} type="big" image={`/assets/skins/${account.pSkin}.png`} size="200" position={{x: 0, y: 30}} />
                                        <div className="desc">
                                            <section>
                                                <span>Имя аккаунта (UID)</span>
                                                <h1>{account.pName} ({account.pID})</h1>
                                            </section>
                                            <section>
                                                <span>Активные привязки</span>
                                                <div>
                                                    <button className={`btn nothover ${account.pEmail.length ? 'selected' : 'disable'}`}>Email</button>
                                                    <button className={`btn nothover ${account.pGoogleAuth ? 'selected' : 'disable'}`}>GAuthenticator</button>
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                    <div className="licensess">
                                        <div className={`license ${account.invModel.indexOf('20') !== -1 || account.invModel.indexOf('21') !== -1
                                                || account.invModel.indexOf('22') !== -1 || account.invModel.indexOf('23') !== -1
                                                || account.invModel.indexOf('24') !== -1 || account.invModel.indexOf('26') !== -1 ? 'selected' : ''}`}>
                                            <div className="img">
                                                <img src={`/assets/licensess/drive${
                                                    account.invModel.indexOf('20') !== -1 || account.invModel.indexOf('21') !== -1
                                                    || account.invModel.indexOf('22') !== -1 || account.invModel.indexOf('23') !== -1
                                                    || account.invModel.indexOf('24') !== -1 || account.invModel.indexOf('26') !== -1
                                                    ? '_on' : ''
                                                }.png`} alt="Лицензия на вождение" />
                                            </div>
                                            <h1>Лицензия на вождение</h1>

                                            <section>
                                                <div className={`img ${account.invModel.indexOf(21) !== -1 && 'selected'}`}>
                                                    <img src={`/assets/licensess/drive_a${account.invModel.indexOf('21') !== -1 ? '_on' : ''}.png`} alt="Лицензия на вождение категории A" />
                                                    <span>A</span>
                                                </div>
                                                <div className={`img ${account.invModel.indexOf(20) !== -1 && 'selected'}`}>
                                                    <img src={`/assets/licensess/drive_b${account.invModel.indexOf('20') !== -1 ? '_on' : ''}.png`} alt="Лицензия на вождение категории B" />
                                                    <span>B</span>
                                                </div>
                                                <div className={`img ${account.invModel.indexOf(22) !== -1 && 'selected'}`}>
                                                    <img src={`/assets/licensess/drive_c${account.invModel.indexOf('22') !== -1 ? '_on' : ''}.png`} alt="Лицензия на вождение категории C" />
                                                    <span>C</span>
                                                </div>
                                                <div className={`img ${account.invModel.indexOf(23) !== -1 && 'selected'}`}>
                                                    <img src={`/assets/licensess/drive_d${account.invModel.indexOf('23') !== -1 ? '_on' : ''}.png`} alt="Лицензия на вождение категории D" />
                                                    <span>D</span>
                                                </div>
                                                <div className={`img ${account.invModel.indexOf(24) !== -1 && 'selected'}`}>
                                                    <img src={`/assets/licensess/drive_e${account.invModel.indexOf('24') !== -1 ? '_on' : ''}.png`} alt="Лицензия на вождение категории E" />
                                                    <span>E</span>
                                                </div>
                                                <div className={`img ${account.invModel.indexOf(26) !== -1 && 'selected'}`}>
                                                    <img src={`/assets/licensess/drive_f${account.invModel.indexOf('26') !== -1 ? '_on' : ''}.png`} alt="Лицензия на вождение категории F" />
                                                    <span>F</span>
                                                </div>
                                            </section>
                                        </div>
                                        <div className={`license ${account.invModel.indexOf(5555555) !== -1 ? 'selected' : ''}`}>
                                            <div className="img">
                                                <img src={`/assets/licensess/gun${account.invModel.indexOf(5555555) !== -1 ? '_on' : ''}.png`} alt="Разрешение на оружие" />
                                            </div>
                                            <h1>Разрешение на оружие</h1>
                                        </div>
                                        <div className={`license ${account.invModel.indexOf(5555555) !== -1 ? 'selected' : ''}`}>
                                            <div className="img">
                                                <img src={`/assets/licensess/plane${account.invModel.indexOf(5555555) !== -1 ? '_on' : ''}.png`} alt="Управление пилотными т/c" />
                                            </div>
                                            <h1>Управление пилотными т/c</h1>
                                        </div>
                                        <div className={`license ${account.invModel.indexOf(5555555) !== -1 ? 'selected' : ''}`}>
                                            <div className="img">
                                                <img src={`/assets/licensess/boat${account.invModel.indexOf(5555555) !== -1 ? '_on' : ''}.png`} alt="Лицензия на водный т/с" />
                                            </div>
                                            <h1>Лицензия на водный т/с</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="wrapper">
                                <div className="subinfo">
                                    <div className="dataInfo">
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/email.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Почта</span>
                                                <h1>{account.pEmail}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/level.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Уровень</span>
                                                <h1>{account.pLevel}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/exp.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Опыт</span>
                                                <h1>{account.pExp} / {(account.pLevel + 1) * 4}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/cash.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Наличные</span>
                                                <h1>{account.pCash.toLocaleString()} $</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/bankcash.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Банковская карта</span>
                                                <h1>{!account.pBank ? 'Не имеется' : account.pBankCash.toLocaleString() + ' $'}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/depositecash.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Депозитный счет</span>
                                                <h1>{!account.pLevel < 5 ? 'Не имеется' : account.pDeposit.toLocaleString() + ' $'}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/donate.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Донат счет</span>
                                                <h1>{account.pDonate.toLocaleString()} рублей</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/fraction.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Фракция</span>
                                                <h1>{account.pFraction === -1 ? 'Не имеется' : account.pFractionData.name}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/rank.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Должность</span>
                                                <h1>{account.pFraction === -1 ? 'Не имеется' : account.pFractionData.rankName + `(${account.pRank})`}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/gender.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Пол</span>
                                                <h1>{!account.pSex ? 'Мужской' : 'Женский'}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/date.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Возраст</span>
                                                <h1>{account.pAge} {AgeText(account.pAge)}</h1>
                                            </div>
                                        </div>
                                        <div className="elem">
                                            <img src="/assets/accountDataInfo/date.png" alt="Информация" />
                                            <div className="desc">
                                                <span>Последний вход</span>
                                                <h1>{!account.pLastEnter ? 'Неизвестно' : Moment(new Date(account.pLastEnter)).fromNow()}</h1>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="accessories">
                                        <div className="text">
                                            <h1>Аксессуары</h1>
                                            <span>Отображено наличие активных аксессуаров, в использовании на данных момент!</span>
                                        </div>
                                        <div className="wrap">
                                            {account.pAcs.replace(' ', '').split(',').map((item, i) => {
                                                return (
                                                    <div key={i} className={`acs ${!parseInt(item) ? '' : 'selected'}`} data-title={!parseInt(item) ? '' : returnInvItemDataForModel(parseInt(item))[3]}>
                                                        {!parseInt(item) ? '' : (<img src={`/assets/invItems/${parseInt(item)}.png`} />)}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="wrapper">
                        <div className="otherData">
                            <h1 className="_title">Прочее</h1>
                            <div className="info">
                                <div className="wrap" style={{transform: `translateX(-${otherDataPage * 100}%)`}}>
                                    <div className="elem">
                                        <span>Дата регистрации</span>
                                        <h1>{Moment(new Date(account.pRegDate)).format('DD.MM.YYYY')}</h1>
                                    </div>
                                    <div className="elem">
                                        <span>Предупреждений</span>
                                        <h1>{account.pWarn} / 3</h1>
                                    </div>
                                    <div className="elem">
                                        <span>Работа</span>
                                        <h1>{!account.pJob ? 'Не имеется' : returnJobNames(account.pJob)}</h1>
                                    </div>
                                    <div className="elem">
                                        <span>Место спавна</span>
                                        <h1>{CONFIG.spawnNames[account.pSetSpawn]}</h1>
                                    </div>
                                    <div className="elem">
                                        <span>Брак</span>
                                        <h1>{account.pWedding === -1 ? 'Не имеется' : (
                                            <>
                                                <span style={{marginRight: '4px', opacity: '1'}}>с</span>
                                                <Link className="link color" to={`/account/${account.pWedding}`}>{account.pWeddingName}</Link>
                                            </>
                                        )}</h1>
                                    </div>
                                    <div className="elem">
                                        <span>x2 опыт</span>
                                        <h1>{!account.pUpExp ? 'Нет' : 'Да'}</h1>
                                    </div>
                                    <div className="elem">
                                        <span>Розыск</span>
                                        <h1>{!account.pWanted ? 'Законопослушный' : `В розыске ${account.pWanted} уровня`}</h1>
                                    </div>
                                </div>
                                <div className="wrap" style={{transform: `translateX(-${otherDataPage * 100}%)`}}>
                                    <div className="elem">
                                        <span>Блокировка чата</span>
                                        <h1>{!account.pMute ? 'Нет' : 'Пройдет ' + Moment(new Date()).to(new Date(+new Date + account.pMute * 1000))}</h1>
                                    </div>
                                    <div className="elem">
                                        <span>Деморган</span>
                                        <h1>{!account.pJail ? 'Нет' : 'Освободитесь ' + Moment(new Date()).to(new Date(+new Date + account.pJail * 1000))}</h1>
                                    </div>
                                    <div className="elem">
                                        <span>КПЗ</span>
                                        <h1>{!account.pPrison ? 'Нет' : 'Освободитесь ' + Moment(new Date()).to(new Date(+new Date + account.pPrison * 1000))}</h1>
                                    </div>
                                </div>
                            </div>
                            <div className="nav">
                                <button onClick={() => setOtherDataPage(0)} className={otherDataPage === 0 && 'selected'}></button>
                                <button onClick={() => setOtherDataPage(1)} className={otherDataPage === 1 && 'selected'}></button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <div className="wrapper">
                        <h1 className="_title">Навыки владения оружием</h1>
                        <Skills skills={account.pSkills} />
                    </div>
                </div>
                <div className="body">
                    <div className="wrapper">
                        <h1 className="_title">Управление аккаунтом</h1>
                        <div className="management">
                            <button className="btn nothover" style={{backgroundColor: '#FF3E3E', color: 'white'}}>Привязать Google Authenticator</button>
                            <button className="btn nothover" style={{backgroundColor: '#d0e98b'}}>Изменить пароль</button>
                            <button className="btn nothover" style={{backgroundColor: '#C7EBFF'}}>Изменить Email</button>
                        </div>
                    </div>
                </div>
                <div className="body">
                    <div className="wrapper">
                        <h1 className="_title">Логи аккаунта</h1>
                        <Logs />
                    </div>
                </div>
            </div>
        </>
    )
}


function Skills({ skills }) {
    skills = skills.replace(' ', '').split(',')
    return (
        <div className="skills">
            <div className={`elem ${skills[0] < 1000 ? '' : 'selected'}`}>
                <div className="img">
                    <img src="/assets/weapons/pistol.png" alt="Pistol 9mm" />
                </div>
                <div className="desc">
                    <h1>
                        Pistol 9mm
                        <span>{skills[0] >= 999 ? '100' : parseInt(skills[0] / 10)}%</span>
                    </h1>
                    <section>
                        <section style={{width: skills[0] >= 999 ? '100' : parseInt(skills[0] / 10) + '%'}}></section>
                    </section>
                </div>
            </div>
            <div className={`elem ${skills[1] < 1000 ? '' : 'selected'}`}>
                <div className="img">
                    <img src="/assets/weapons/deagle.png" alt="Desert Eagle" />
                </div>
                <div className="desc">
                    <h1>
                        Desert Eagle
                        <span>{skills[1] >= 999 ? '100' : parseInt(skills[1] / 10)}%</span>
                    </h1>
                    <section>
                        <section style={{width: skills[1] >= 999 ? '100' : parseInt(skills[1] / 10) + '%'}}></section>
                    </section>
                </div>
            </div>
            <div className={`elem ${skills[2] < 1000 ? '' : 'selected'}`}>
                <div className="img">
                    <img src="/assets/weapons/shotgun.png" alt="ShotGun" />
                </div>
                <div className="desc">
                    <h1>
                        ShotGun
                        <span>{skills[2] >= 999 ? '100' : parseInt(skills[2] / 10)}%</span>
                    </h1>
                    <section>
                        <section style={{width: skills[2] >= 999 ? '100' : parseInt(skills[2] / 10) + '%'}}></section>
                    </section>
                </div>
            </div>
            <div className={`elem ${skills[3] < 1000 ? '' : 'selected'}`}>
                <div className="img">
                    <img src="/assets/weapons/mp5.png" alt="MP5" />
                </div>
                <div className="desc">
                    <h1>
                        MP5
                        <span>{skills[3] >= 999 ? '100' : parseInt(skills[3] / 10)}%</span>
                    </h1>
                    <section>
                        <section style={{width: skills[3] >= 999 ? '100' : parseInt(skills[3] / 10) + '%'}}></section>
                    </section>
                </div>
            </div>
            <div className={`elem ${skills[4] < 1000 ? '' : 'selected'}`}>
                <div className="img">
                    <img src="/assets/weapons/ak47.png" alt="AK-47" />
                </div>
                <div className="desc">
                    <h1>
                        AK-47
                        <span>{skills[4] >= 999 ? '100' : parseInt(skills[4] / 10)}%</span>
                    </h1>
                    <section>
                        <section style={{width: skills[4] >= 999 ? '100' : parseInt(skills[4] / 10) + '%'}}></section>
                    </section>
                </div>
            </div>
            <div className={`elem ${skills[5] < 1000 ? '' : 'selected'}`}>
                <div className="img">
                    <img src="/assets/weapons/m4.png" alt="M4" />
                </div>
                <div className="desc">
                    <h1>
                        M4
                        <span>{skills[5] >= 999 ? '100' : parseInt(skills[5] / 10)}%</span>
                    </h1>
                    <section>
                        <section style={{width: skills[5] >= 999 ? '100' : parseInt(skills[5] / 10) + '%'}}></section>
                    </section>
                </div>
            </div>
            <div className={`elem ${skills[6] < 1000 ? '' : 'selected'}`}>
                <div className="img">
                    <img src="/assets/weapons/tec.png" alt="TEC 9" />
                </div>
                <div className="desc">
                    <h1>
                        TEC 9
                        <span>{skills[6] >= 999 ? '100' : parseInt(skills[6] / 10)}%</span>
                    </h1>
                    <section>
                        <section style={{width: skills[6] >= 999 ? '100' : parseInt(skills[6] / 10) + '%'}}></section>
                    </section>
                </div>
            </div>
        </div>
    )
}