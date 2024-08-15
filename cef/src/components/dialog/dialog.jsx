import React from "react"
import $ from 'jquery'
import 'jquery.scrollto'

import _cef from '../../modules/cef'
import './dialog.scss'

export default function Dialog() {
    const dialog = {
        show: (dialogid = 0, style = 0, title = '', body = '', btn1 = '', btn2 = '') =>
        {
            dialog.hide()
            if(!body.length)return
    
            const styleNames = [ "", "dialog-section-input", "dialog-section-list", "dialog-section-input", "dialog-section-list dialog-section-tablist", "dialog-section-list dialog-section-tablist" ]
    
            $('.dialog header').html(title)
    
            $('.dialog .dialog-section').attr('class', `dialog-section ${styleNames[style]}`)
            $('.dialog .dialog-section').attr('data-style', style)
            $('.dialog .dialog-section').attr('data-dialogid', dialogid)
    
            if(!btn2.length)
            {
                $('.dialog .dialog-btns').html(`
                    <button class="dialog-btns-closed">${btn1}</button>`)
            }
            else
            {
                $('.dialog .dialog-btns').html(`
                    <button>${btn1}</button>
                    <button class="dialog-btns-closed">${btn2}</button>`)
            }
    
            let colors = body.match(/{[a-f0-9]{6}\b}/gi)
            if(colors)
            {
                colors.forEach(item =>
                {
                    body = body.replaceAll(item, `<span style="color: #${item.replace('{', '').replace('}', '')}; width: 100%; margin: 0;" />`)
                })
            }
            body = body.trim()
    
            let status = false
            if(style === 0 || style === 1 || style === 3)
            {
                status = false
                while(!status)
                {
                    if(body.indexOf("\n") !== -1) body = body.replaceAll('\n', '<br />')
                    else
                    {
                        if(body.indexOf("\t") !== -1) body = body.replaceAll('\t', '<span style="margin: 0 20px;">&#160;</span>')
                        else status = true
                    }
                }
            }
            else if(style === 2)
            {
                status = false
                while(!status)
                {
                    if(body.indexOf("\t") !== -1) body = body.replaceAll('\t', '<span style="margin: 0 20px;">&#160;</span>')
                    else status = true
                }
    
                const elems = body.split('\n')
                body = ''
    
                elems.forEach(item =>
                {
                    body += `<div>${item}</div>`
                })
            }
            else if(style === 4 || style === 5)
            {
                let elems = body.split('\n')
                elems.forEach((item, i) =>
                {
                    elems[i] = item.split('\t')
                })
    
                body = '<table>'
                if(style === 5) {
                    body += '<thead><tr>'
                    elems[0].forEach(el => {
                        body += `<th>${el}</th>`
                    })
                    body += '</thead></tr>'

                    elems.shift()
                }

                body += '<tbody>'
                elems.forEach((item, i) =>
                {
                    body += '<tr>'
                    item.forEach((el, eli) => {
                        if(eli !== 0) body += `<th style='transform: translateX(-1px);'>${el}</th>`
                        else body += `<th>${el}</th>`
                    })
                    body += '</tr>'
                })

                body += '</tbody>'
                body += '</table>'
            }
    
            if(style === 1) body += '<div class="dialog-input"><input type="text"></div>'
            else if(style === 3) body += '<div class="dialog-input"><input type="password"></div>'
    
            $('.dialog .dialog-section').html(body)

            $(`.dialog .dialog-section tbody tr:${style === 5 ? "nth-child(1)" : "first-child"}`).addClass('dialog-section-list-select')
            $(`.dialog .dialog-section-list div:${style === 5 ? "nth-child(2)" : "first-child"}`).addClass('dialog-section-list-select')
    
            if(style === 1 || style === 3) setTimeout(() => $('.dialog .dialog-section input').focus(), 100)

            $('.dialog .dialog-section').scrollTo(0)
            $('.dialog').show()

            if(style === 1 || style === 3) {
                $('.dialog .dialog-input').append(`
                    <div class="dialog-error"></div>
                `)
            }
        },
        hide: () => $('.dialog').hide(),
    
        submit: status =>
        {
            const dialogid = parseInt($('.dialog .dialog-section').attr('data-dialogid'))
            let
                listitem = 0,
                inputtext = $('.dialog .dialog-section input').val() || '',
                style = parseInt($('.dialog .dialog-section').attr('data-style'))
    
            $('.dialog .dialog-section tbody tr, .dialog .dialog-section-list div').each((i, item) =>
            {
                if($(item).hasClass('dialog-section-list-select')) listitem = i
            })

            if(!inputtext.length) {
                if(style === 2) inputtext = $($('.dialog .dialog-section div')[listitem]).text()
                else if(style === 4
                    || style === 5) inputtext = $($('.dialog .dialog-section table tbody tr')[listitem]).text()
            }
    
            _cef.event('client::dialog', `${dialogid}:${!status ? 0 : 1}:${listitem}:${inputtext}`)
        },

        error: message => {
            const
                style = parseInt($('.dialog .dialog-section').attr('data-style'))
            
            if(style !== 1 && style !== 3)return

            $('.dialog .dialog-input .dialog-error').text(message)
            $('.dialog .dialog-input .dialog-error').addClass('dialog-error-show')
        },
        errorHide: () => {
            const
                style = parseInt($('.dialog .dialog-section').attr('data-style'))
            
            if(style !== 1 && style !== 3)return

            $('.dialog .dialog-input .dialog-error').text('')
            $('.dialog .dialog-input .dialog-error').removeClass('dialog-error-show')
        }
    }

    React.useMemo(() => {
        // setTimeout(() => {
        //     dialog.show(0, 3, "Test", "Сервер закрыт паролем.\nДля продолжения - введите пароль:\n\n{afafaf}В случае не верного ввода Вы будете отключены от сервера", "Да", "нет")
        // }, 100)

        _cef.on('ui::dialog:show', (dialogid, type, title, text, btn1, btn2) => dialog.show(dialogid, type, title, text, btn1, btn2))
        _cef.on('ui::dialog:hide', () => dialog.hide())

        _cef.on('ui::dialog:error', message => dialog.error(message))
        _cef.on('ui::dialog:errorHide', () => dialog.errorHide())

        $('#root').on('click', '.dialog .dialog-btns button', elem =>
        {
            dialog.submit(!$(elem.currentTarget).hasClass('dialog-btns-closed'))
        })
        $('#root').on('click', '.dialog .dialog-section tbody tr, .dialog .dialog-section-list div', elem =>
        {
            if($(elem.currentTarget).hasClass('dialog-section-list-select'))return dialog.submit(true)

            $('.dialog .dialog-section tbody tr, .dialog .dialog-section-list div').removeClass('dialog-section-list-select')
            $(elem.currentTarget).addClass('dialog-section-list-select')
        })

        $('#root').on('input', '.dialog .dialog-input input', event => {
            const style = parseInt($('.dialog .dialog-section').attr('data-style'))
            const target = event.currentTarget
            const cyrillicPattern = /[а-яА-ЯЁё]/

            if(style === 3) {
                if(cyrillicPattern.test(target.value) === true) dialog.error('У Вас в тексте присутствует кириллица')
            }

            if(style !== 3 || (style === 3 && !cyrillicPattern.test(target.value))) dialog.errorHide()
        })

        $(document).keyup(elem =>
        {
            if($('.dialog').css('display') !== 'none'
                && ($('.dialog .dialog-section').attr('data-style') === "2"
                    || $('.dialog .dialog-section').attr('data-style') === "4"
                    || $('.dialog .dialog-section').attr('data-style') === "5"))
            {
                let
                    nextDiv = $('.dialog .dialog-section tbody tr.dialog-section-list-select').next(),
                    prevDiv = $('.dialog .dialog-section tbody tr.dialog-section-list-select').prev()
                
                if(!nextDiv.length) nextDiv = $('.dialog .dialog-section-list div.dialog-section-list-select').next()
                if(!prevDiv.length) prevDiv = $('.dialog .dialog-section-list div.dialog-section-list-select').prev()

                let status

                if(elem.keyCode === 40
                    && nextDiv.length)
                {
                    $('.dialog .dialog-section tbody tr, .dialog .dialog-section-list div').removeClass('dialog-section-list-select')
                    nextDiv.addClass('dialog-section-list-select')

                    status = nextDiv
                }
                else if(elem.keyCode === 38
                    && prevDiv.length)
                {
                    $('.dialog .dialog-section tbody tr, .dialog .dialog-section-list div').removeClass('dialog-section-list-select')
                    prevDiv.addClass('dialog-section-list-select')

                    status = prevDiv
                }

                if(status
                    && (status.position().top < 0 || status.position().top > $('.dialog .dialog-section').height())) $('.dialog .dialog-section').scrollTop($('.dialog .dialog-section').scrollTop() + status.position().top)
            }

            if($('.dialog').css('display') !== 'none'
                && elem.keyCode === 13) dialog.submit(true)
            if($('.dialog').css('display') !== 'none'
                && elem.keyCode === 27) dialog.submit(false)
        });
    }, [])

    return (
        <div className="dialog" style={{display: 'none'}}>
            <header>Информация</header>
            <section className="dialog-section"></section>
            <section className="dialog-btns">
                <button>Далее</button>
                <button className="dialog-btns-closed">Закрыть</button>
            </section>
        </div>
    )
}