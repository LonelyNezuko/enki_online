import $ from 'jquery'

$(document).ready(() => {
    $(document).on('click', '.select', event => {
        $(document).find('.select').removeClass('show')
        $(document).find('.select ul').fadeOut({ duration: 300, easing: 'linear' })

        const target = $(event.currentTarget)
        const ul = target.children('ul')

        if(ul.css('display') === 'block') {
            target.removeClass('show')
            ul.fadeOut({ duration: 300, easing: 'linear' })
        }
        else {
            const
                windowWidth = $(window).width(),
                windowHeight = $(window).height(),

                targetPosition = target.offset()

            if(targetPosition.top > windowHeight / 2) {
                target.removeClass('ulbottom')
                target.addClass('ultop')
            }
            else {
                target.addClass('ulbottom')
                target.removeClass('ultop')
            }

            if(targetPosition.left > windowWidth / 2) {
                target.removeClass('ulleft')
                target.addClass('ulright')
            }
            else {
                target.addClass('ulleft')
                target.removeClass('ulright')
            }

            target.addClass('show')
            ul.fadeIn({ duration: 300, easing: 'linear' })
        }
    })
    $(document).on('click', '.select ul li', event => {
        const target = $(event.currentTarget)
        const
            title = target.children('span').text() || target.text(),
            subtitle = target.attr('data-title'),
            value = target.attr('data-value'),
            icon = target.children('.svg')
        
        const select = target.parent().parent()

        select.attr('data-value', value)
        select.attr('data-title', subtitle || title)

        if(!icon.length) select.children('.icon').html('')
        else select.children('.icon').html(icon.html())

        select.children('ul').children('li').removeClass('selected')
        target.addClass('selected')
    })
})