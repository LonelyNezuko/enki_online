const dialog = {
    show: (title, desc, body, btnSuccess, btnCancel = '', callback = undefined) =>
    {
        $('.dialog h1').html(title)
        $('.dialog h2').html(desc)

        $('.dialog .dialog-inputs').html('')
        body.forEach(item =>
        {
            if(item.type === 'input')
            {
                $('.dialog .dialog-inputs').append(`
                    <div class="input">
                        <input id="${item.id}" type="${item.inputType || 'text'}" placeholder=" ">
                        <label for="${item.id}">${item.title}</label>
                    </div>`)
            }
            else if(item.type === 'selectmenu') selectmenu.add('.dialog .dialog-inputs', item.id, item.title, item.elems)
        })

        if(btnCancel.length >= 1)
        {
            $('.dialog .dialog-btns .button:first-child').html(btnCancel)
            $('.dialog .dialog-btns .button:first-child').show()
        }
        else $('.dialog .dialog-btns .button:first-child').hide()

        $('.dialog .dialog-btns .button:last-child').html(btnSuccess)
        $('.dialog-wrap').addClass('dialog-show')

        $('.dialog .dialog-btns .button:first-child').on('click', () => _dialog_clickBtn(0))
        $('.dialog .dialog-btns .button:last-child').on('click', () => _dialog_clickBtn(1))

        function _dialog_clickBtn(btn)
        {
            if(callback)
            {
                const data = {}
                body.forEach(item =>
                {
                    if(item.type === 'input') data[item.id] = $(`#${item.id}`).val()
                    else if(item.type === 'selectmenu') data[item.id] = selectmenu.value(`#${item.id}`)
                })

                callback(btn, data)
            }
            else dialog.hide()
        }
    },
    hide: () =>
    {
        $('.dialog-wrap').removeClass('dialog-show')
    }
}
