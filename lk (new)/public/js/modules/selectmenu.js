const selectmenu = {
    add: (element, id, title, elems, settings = {}, callback = undefined) =>
    {
        if(!title.length
            || !elems.length
            || !id.length)return false
        if(!$('*').is(element))return false

        if(settings.selectID < 0 || settings.selectID >= elems.length) settings.selectID = undefined

        const newElement = $(element).append(`
            <div class="selectmenu ${settings.disabled ? "selectmenu-disabled" : ""}" id="${id}" ${settings.selectID !== undefined ? `data-id="${settings.selectID}"` : ""}>
                <h6>${settings.selectID !== undefined ? elems[settings.selectID].name : title}</h6>
                <div class="selectmenu-arrow">
                    <span></span>
                    <span></span>
                </div>

                <section></section>
            </div>`).find('.selectmenu:last-child')
        elems.forEach((item, i) =>
        {
            $(newElement).find('section').append(`<div ${settings.selectID === i ? "class='selectmenu-item-blocked'" : ""} data-id="${item.id}">${item.name}</div>`)
        })

        $(newElement).on('click', 'section div', item =>
        {
            if($(newElement).hasClass('selectmenu-disabled'))return false
            if($(item.currentTarget).hasClass('selectmenu-item-blocked'))return false

            const id = $(item.currentTarget).attr('data-id')

            $(newElement).find('h6').html($(item.currentTarget).html())
            $(newElement).attr('data-id', id)

            $(newElement).find('section div').removeClass('selectmenu-item-blocked')
            $(item.currentTarget).addClass('selectmenu-item-blocked')

            if(callback) callback(id)
        })
    },
    remove: id =>
    {
        if(!$('*').is(id))return false
        $(id).remove()
    },
    value: id =>
    {
        if(!$('*').is(id))return undefined
        return $(id).attr('data-id')
    }
}
