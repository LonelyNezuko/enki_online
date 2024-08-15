import React from 'react'
import $ from 'jquery'

import './googleAuthCode.scss'

export default function GoogleAuthCode({ id, callback }) {
    function onInput(elem) {
        const val = $(elem.currentTarget).val().toString()
        if($(elem.currentTarget).is(':last-child') && val.length > 1)return $(elem.currentTarget).val(val.substring(0, 1))

        if(val.length !== 0)
        {
            function _callback()
            {
                const value = $(`.googleauth-code#${id} input:nth-child(1)`).val() +
                    $(`.googleauth-code#${id} input:nth-child(2)`).val() +
                    $(`.googleauth-code#${id} input:nth-child(3)`).val() +
                    $(`.googleauth-code#${id} input:nth-child(4)`).val() +
                    $(`.googleauth-code#${id} input:nth-child(5)`).val() +
                    $(`.googleauth-code#${id} input:nth-child(6)`).val()
                if(callback) callback(parseInt(value))

                $(`.googleauth-code#${id} input:last-child`).focus()
            }

            if(val.length === 6)
            {
                let count = 0
                $(`.googleauth-code#${id} input`).each((i, item) =>
                {
                    if(count < val.length)
                    {
                        $(item).val(val[i])
                        count ++
                    }
                })

                if(count !== 6) $(`.googleauth-code#${id} input:nth-child(${count + 1})`).focus()
                else _callback()
            }
            else
            {
                if($(elem.currentTarget).next().length === 0) _callback()
                else {
                    if(val.length > 1) $(elem.currentTarget).val(val.substring(1, 2))
                    $(elem.currentTarget).next().focus()
                }
            }
        }
    }
    function onKeyup(event) {
        if(event.key === 'Backspace') {
            const elem = $(event.currentTarget)
            const prev = elem.prev()

            if(!elem.is(':first-child') && prev.length) {
                $(prev).focus()
            }
        }
    }
    
    return (
        <section className="googleauth-code" id={id}>
            <img src="assets/googleauth.png" />
            <div>
                <input onKeyUp={onKeyup} onChange={onInput} type="text" placeholder=" " />
                <input onKeyUp={onKeyup} onChange={onInput} type="text" placeholder=" " />
                <input onKeyUp={onKeyup} onChange={onInput} type="text" placeholder=" " />
                <input onKeyUp={onKeyup} onChange={onInput} type="text" placeholder=" " />
                <input onKeyUp={onKeyup} onChange={onInput} type="text" placeholder=" " />
                <input onKeyUp={onKeyup} onChange={onInput} type="text" placeholder=" " />
            </div>
        </section>
    )
}