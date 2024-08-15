import React from 'react'

import './modal.scss'

export default function Modal({ toggle = false, text, btns = [ 'Ок' ], onClick, type="default", inputvalue='' }) {
    const [ value, setValue ] = React.useState(inputvalue)

    return (
        <div className="phoneModal" style={{display: !toggle ? 'none' : 'flex'}}>
            <div className="phoneModalWrapper">
                <div className="body">
                    <h1 dangerouslySetInnerHTML={{__html: text}}></h1>
                    {type === 'input' ? (
                        <input type="text" value={value} onChange={event => setValue(event.target.value)} />
                    ) : ''}
                </div>
                <div className="buttons">
                    {btns.map((item, i) => {
                        return (<button onClick={() => onClick(i, value)} key={i}>{item}</button>)
                    })}
                </div>
            </div>
        </div>
    )
}