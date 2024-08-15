import React from 'react'
import $ from 'jquery'

import _cef from "../../modules/cef"

import './speedometr.scss'

import { FaWrench } from 'react-icons/fa'
import { FaGasPump } from 'react-icons/fa'

import { MdLightbulb } from 'react-icons/md'

export default function Speedometr() {
    const [ toggle, setToggle ] = React.useState(false)

    const [ health, setHealth ] = React.useState(100)
    const [ fuel, setFuel ] = React.useState([31, 100])

    const [ speed, setSpeed ] = React.useState(5)

    const [ status, setStatus ] = React.useState([ 1, 0, 1, 0 ])

    const [ nopark, setNopark ] = React.useState(1)
    const [ noparkText, setNoparkText ] = React.useState("NO PARK")

    React.useMemo(() => {
        _cef.on('ui::speedometr:toggle', toggle => setToggle(toggle))

        _cef.on('ui::speedometr:health', health => setHealth(health))
        _cef.on('ui::speedometr:fuel', fuel => {
            let array = fuel.split(',')
            array.map(item => item = parseInt(item))

            setFuel(array)
        })

        _cef.on('ui::speedometr:speed', speed => setSpeed(speed))

        _cef.on('ui::speedometr:status', status => {
            let array = status.split(',')
            array.map(item => item = parseInt(item))

            setStatus(array)
        })

        _cef.on('ui::speedometr:nopark', nopark => setNopark(nopark))
        _cef.on('ui::speedometr:noparktext', noparktext => setNoparkText(noparktext))
    }, [])

    return (
        <div className="speedometr" style={{display: !toggle ? 'none' : 'block'}}>
            <div className="mini">
                <div className="speedCount">
                    <div className="wear">
                        <div className="wearStatus health">
                            <FaWrench style={{color: health === 0 ? "#00000027" : health <= 30 ? "#f14d4d" : "#83ff48"}} />
                            <section>
                                <div style={{height: health / 100 * 100 + "%", backgroundColor: health <= 30 ? "#f14d4d" : "#83ff48"}}></div>
                            </section>
                        </div>
                        <div className="wearStatus fuel">
                            <FaGasPump style={{color: parseInt(fuel[0]) === 0 ? "#00000027" : (parseInt(fuel[0]) / parseInt(fuel[1]) * 100) <= 30 ? "#f14d4d" : "#2187c8"}} />
                            <section>
                                <div style={{height: parseInt(fuel[0]) / parseInt(fuel[1]) * 100 + "%", backgroundColor: (parseInt(fuel[0]) / parseInt(fuel[1]) * 100) <= 30 ? "#f14d4d" : "#2187c8"}}></div>
                            </section>
                        </div>
                    </div>
                    <div className="speed">
                        {Array.from(speed.toString().padStart(3, '-')).map((item, i) =>
                        {
                            if(item === '-' || speed === 0)return (<span>0</span>)
                            return (item)
                        })}
                    </div>
                </div>
                <div className="speedFill">
                    <div style={{width: speed}}></div>
                </div>
                <div className="bottom">
                    <div className="status">
                        <section className={`lights ${parseInt(status[0]) && 'on'}`}>
                            <MdLightbulb />
                        </section>
                        <section className={`engine ${parseInt(status[1]) && 'on'}`}>
                            <img src={`assets/speedometr/engine${parseInt(status[1]) ? 'fill' : ''}.png`} />
                        </section>
                        <section className={`doors ${parseInt(status[2]) && 'on'}`}>
                            <img src={`assets/speedometr/door${parseInt(status[2]) ? 'fill' : ''}.png`} />
                        </section>
                        <section className={`belt ${parseInt(status[3]) && 'on'}`}>
                            <img src={`assets/speedometr/belt${parseInt(status[3]) ? 'fill' : ''}.png`} />
                        </section>
                    </div>
                    <div className="nopark" style={{display: !nopark ? 'none' : 'block'}}>
                        <h1>{noparkText}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}