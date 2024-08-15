import $ from 'jquery'
import {Howl} from 'howler';

import _cef from './modules/cef'

$(document).ready(() => {
    $('body').on('click', '.copied', elem =>
    {
        if($(elem.currentTarget).hasClass('copied-show'))return

        $(elem.currentTarget).addClass('copied-show')
        const text = $(elem.currentTarget).text()

        const copiedArea = document.createElement('textarea')
        document.body.appendChild(copiedArea)

        copiedArea.value = text
        copiedArea.select()

        document.execCommand('copy')
        document.body.removeChild(copiedArea)

        setTimeout(() =>
        {
            $(elem.currentTarget).removeClass('copied-show')
        }, 2000)
    })

    $('body').on('keydown', event => {
        if(event.key === '='
            && !$('body').find('input').is(':focus')) _cef.event('client::focusout')
    })
})