import $ from 'jquery'
import random from './random'

export default function notify(text, type = 'info', time = 5000) {
    console.log('start')
    
    const key = random.textNumber(64)
    $('.notify').append(`
        <div class='elem ${type}' data-key='${key}'>
            <h1>${text}</h1>
        </div>
    `)

    setTimeout(() => {
        console.log('stop')
        $(`.notify .elem[data-key="${key}"]`).remove()
    }, time)
}