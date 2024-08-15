import React from 'react'
import $ from 'jquery'

import func from '../../modules/func'
import _cef from '../../modules/cef'

import './notify.scss'

export default function Notify() {
    const [ notify, setNotify ] = React.useState([])
    function addNotify(text, type = 'error', time = 5000) {
        text = text.replaceAll(/{[a-f0-9]{6}\b}/gi, (elem, $1) => {
            return `<span style="color: #${elem.replace('{', '').replace('}', '')}; width: 100%; margin: 0;" />`
        })  

        const id = func.random(0, 9999999999)
		setNotify(old => { return [...old, [type, text, id, setTimeout(() => {
			setNotify(old => {
                return old.filter(el => el[2] !== id)
            })
		}, time)]] })
    }

    React.useMemo(() => {
        _cef.on('ui::notify', (text, type, time) => addNotify(text, type, time))
    }, [])

    return (
        <div className="notify" data-array={JSON.stringify(notify)}>
            {notify.map((item, i) => {
                return (<div key={i} className={`elem ${item[0]}`}>
                    <img src={`assets/notify/${item[0]}.png`} />
                    <h1 dangerouslySetInnerHTML={{__html: item[1]}}></h1>
                </div>)
            })}
        </div>
    )
}