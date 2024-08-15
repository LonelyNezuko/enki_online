import React from 'react'

import _cef from '../../modules/cef'
import BTNKey from '../../modules/btnkey'

import './hud.scss'

import { IoStar } from 'react-icons/io5'
import { IoStarOutline } from 'react-icons/io5'

export default function Hud() {
    const [ toggle, setToggle ] = React.useState(false)
    const [ toggleLogo, setToggleLogo ] = React.useState(false)

    const [ serverName, setServerName ] = React.useState('Royal')
    const [ id, setID ] = React.useState(2)
    const [ online, setOnline ] = React.useState(522)

    const [ needs, setNeeds ] = React.useState([ 23131, 85, 10, 98 ])
    const [ weapon, setWeapon ] = React.useState([ 24, 5827 ])

    const [ cash, setCash ] = React.useState(582757283)
    const [ wanted, setWanted ] = React.useState(0)

    const [ keysToggle, setKeysToggle ] = React.useState(1)
    const [ keys, setKeys ] = React.useState([
        [ "F10", "Скрыть подсказки" ],
        [ "M", "Личное меню" ],
        [ "Y", "Инвентарь" ],
        [ "arrowup", "Достать телефон" ],
        [ "P", "Служба поддержки" ],
        [ "F11", "Админ меню" ],
        [ "CTRL", "Завести транспорт" ],
        [ "ALT", "Вкл./выкл. фары" ],
        [ "N", "Ремень безопасности" ],
        [ "L", "Двери транспорта" ]
    ])

    React.useMemo(() => {
        _cef.on('ui::hud:toggle', toggle => setToggle(toggle))
        _cef.on('ui::hud:toggleLogo', toggle => setToggleLogo(toggle))

        _cef.on('ui::hud:logo:setName', name => setServerName(name))
        _cef.on('ui::hud:logo:setOnline', online => setOnline(online))
        _cef.on('ui::hud:logo:setID', id => setID(id))

        _cef.on('ui::hud:setStats', (health, armour, satiety, thirst) => setNeeds([ health, armour, satiety, thirst ]))
        _cef.on('ui::hud:setWeapon', (id, ammo) => setWeapon([ id, ammo ]))

        _cef.on('ui::hud:setCash', cash => setCash(cash))
        _cef.on('ui::hud:updateCash', newCash => {
            setCash(old => { return parseInt(old) + parseInt(newCash) })
        })

        _cef.on('ui::hud:setWanted', wanted => setWanted(wanted))

        _cef.on('ui::hud:keysToggle', toggle => setKeysToggle(toggle))
        _cef.on('ui::hud:keys', keys => {
            // key-name;key-name

            let tempKeys = []
            keys.split(';').map(item => {
                tempKeys.push(item.split('-'))
            })

            setKeys(tempKeys)
        })
    }, [])

    return (
        <div className="hud" style={{display: !toggle && !toggleLogo ? 'none' : 'block'}}>
            <div className="hud-right">
                <div className="hud-logo" style={{display: !toggleLogo ? "none" : 'flex'}}>
                    <img src="assets/hud/logo.png" />
                    <div>
                        <h1>ENKI ONLINE | {serverName}</h1>
                        <span id="hudLogoOnline">Онлайн: <span>{online}</span></span>
                        <span id="hudLogoID">Мой ID: <span>{id}</span></span>
                    </div>
                </div>

                <div className="hud-info" style={{display: !toggle ? "none" : 'flex'}}>
                    <div className="hud-health">
                        <section>
                            <div>
                                <span style={{width: (needs[0] > 100 ? 100 : needs[0]) + '%'}}></span>
                            </div>
                            <img style={{width: "33px", height: "33px", transform: "translateY(5px)"}} src="assets/hud/health/health.png" />
                        </section>
                        <section>
                            <div>
                                <span style={{width: (needs[1] > 100 ? 100 : needs[1]) + '%'}}></span>
                            </div>
                            <img style={{width: "33px", height: "33px"}} src="assets/hud/health/armour.png" />
                        </section>
                        <section>
                            <div>
                                <span style={{width: (needs[2] > 100 ? 100 : needs[2]) + '%'}}></span>
                            </div>
                            <img style={{width: "17px", height: "17px", transform: "translateX(-7px)", marginLeft: "19px"}} src="assets/hud/health/eat.png" />
                        </section>
                        <section>
                            <div>
                                <span style={{width: (needs[3] > 100 ? 100 : needs[3]) + '%'}}></span>
                            </div>
                            <img style={{width: "17px", height: "17px", transform: "translateX(-7px)", marginLeft: "19px"}} src="assets/hud/health/water.png" />
                        </section>
                    </div>
                    <div className="hud-weapon">
                        <section>
                            <img src={`assets/hud/weapons/${weapon[0]}.png`} />
                        </section>
                        <section>
                            <span>{weapon[1]}</span>
                        </section>
                    </div>
                </div>
                <div className="hud-cash" style={{display: !toggle ? "none" : 'flex'}}>
                    <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.0381 2.63621L8.22058 1.22161L7.94613 0.666867C7.76657 0.306284 7.32861 0.157378 6.96803 0.33694L2.32861 2.63621H3.0381Z" fill="#60EB54"/>
                        <path d="M9.82915 1.2627C9.76493 1.2627 9.70068 1.27145 9.63645 1.28897L8.41895 1.62182L4.70068 2.63641H8.92112H10.7605L10.5328 1.80138C10.4452 1.47583 10.1503 1.2627 9.82915 1.2627Z" fill="#60EB54"/>
                        <path d="M11.5212 3.14746H11.3547H11.1285H10.9022H9.17518H2.8292H1.99708H1.29635H1.16642H0.731387C0.50073 3.14746 0.294891 3.25403 0.160584 3.42191C0.0992701 3.49929 0.0525547 3.58834 0.0262774 3.68615C0.010219 3.74746 0 3.81169 0 3.87739V3.96498V4.7971V12.0102C0 12.4132 0.327007 12.7402 0.729927 12.7402H11.5197C11.9226 12.7402 12.2496 12.4132 12.2496 12.0102V9.97374H7.91825C7.23358 9.97374 6.67737 9.41753 6.67737 8.73286V8.06425V7.83797V7.61169V7.1095C6.67737 6.77374 6.81166 6.46864 7.0292 6.24529C7.2219 6.04673 7.48029 5.91242 7.76934 5.87885C7.81752 5.87302 7.86715 5.87009 7.91679 5.87009H11.6423H11.8686H12.0949H12.2496V3.87739C12.2511 3.47447 11.9241 3.14746 11.5212 3.14746Z" fill="#60EB54"/>
                        <path d="M12.7622 6.56818C12.6892 6.50103 12.6031 6.44993 12.5067 6.41635C12.4323 6.39155 12.3535 6.37695 12.2702 6.37695H12.2513H12.2367H12.0104H11.1943H7.91841C7.51547 6.37695 7.18848 6.70395 7.18848 7.10688V7.47037V7.69665V7.92292V8.73168C7.18848 9.1346 7.51547 9.46161 7.91841 9.46161H12.2513H12.2702C12.3535 9.46161 12.4323 9.44701 12.5067 9.42219C12.6031 9.39008 12.6892 9.33752 12.7622 9.27037C12.9082 9.13752 13.0002 8.94482 13.0002 8.7317V7.10688C13.0002 6.89373 12.9082 6.70101 12.7622 6.56818ZM9.4425 8.06453C9.4425 8.26599 9.279 8.42949 9.07753 8.42949H8.8352C8.63374 8.42949 8.47023 8.26599 8.47023 8.06453V7.82219C8.47023 7.70541 8.52425 7.60174 8.61038 7.53605C8.67315 7.48787 8.75054 7.45723 8.8352 7.45723H8.89651H9.07753C9.279 7.45723 9.4425 7.62072 9.4425 7.82219V8.06453Z" fill="#60EB54"/>
                    </svg>
                    <span>{cash.toLocaleString('de-DE')} $</span>
                </div>
                <div className="hud-wanted" style={{display: !wanted ? "none" : "block"}}>
                    <h1>В розыске</h1>
                    <section>
                        {new Array(6).fill(0).map((item, i) => {
                            if(wanted > i)return (<IoStar key={i} className="selected" />)
                            return (<IoStarOutline key={i} />)
                        })}
                    </section>
                </div>
                <div className="hud-keys" style={{display: !keysToggle ? 'flex' : 'none'}}>
                    {keys.map((item, i) => {
                        return (
                            <div className={`elem ${!i && 'hide'}`}>
                                <BTNKey keys={item[0]} />
                                <h1>{item[1]}</h1>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}