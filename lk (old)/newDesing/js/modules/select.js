const select =
{
    add: (selector, id, elements, data = {}) =>
    {
        if(!$('*').is(selector))return console.log(`select.add | Селектор '${selector}' не найден`)
        if(!elements.length)return console.log('select.add | Параметр elements не указан')
        if($('*').is('#' + id))return console.log(`select.add | ID '${id}' уже занят`)

        $(selector).append(`
            <div class="select" id="${id}">
                <h5 data-select="-1">${data.placeholder || 'Выберите элемент'}</h5>
                <div></div>
            </div>`)

        let height = 0
        elements.forEach((item, i) =>
        {
            height += $(selector).find('.select div').append(`<label data-select-id="${i}">${item}</label>`).height()
            height += 26
        })

        $(selector).find('.select h5').on('click', () =>
        {
            if($(selector).find('.select div').height() !== 0) $(selector).find('.select div').css('height', `0`)
            else $(selector).find('.select div').css('height', `${height}px`)
        })
        $(selector).find('.select div label').on('click', elem =>
        {
            const id = parseInt($(elem.currentTarget).attr('data-select-id'))
            if(id === undefined
                || isNaN(id)
                || id < 0)return console.log(`select.add - event | Не верный ID у ${$(elem.currentTarget)}. ID: ${id}`)

            $(selector).find('.select div').css('height', `0`)

            $(selector).find('.select h5').attr('data-select', id)
            $(selector).find('.select h5').text($(elem.currentTarget).text())
            $(selector).find('.select h5').css('color', 'black')
        })
    },
    get: id =>
    {
        if(!$('*').is(id))return console.log(`select.get | ID ${id} не найден`)
        if(!$(id).hasClass('select'))return console.log(`select.get | ID ${id} не является селектом`)

        return parseInt($(id).find('h5').attr('data-select'))
    }
}

$(document).ready(() =>
{
    $('body').prepend(`
        <style>
            .select
            {
                width: 300px;
                position: relative;

                margin: 10px 0;

                width: 100%;

                border-radius: 0 5px 0 5px;
                background-color: #f8f8f8;

                display: flex;
                align-items: center;
                justify-content: center;

                cursor: pointer;
            }
            .select h5
            {
                text-align: center;
                font-size: 15px;

                color: #999;

                width: calc(100% - 20px);
                padding: 18px 10px;

                user-select: none;
            }
            .select div
            {
                width: 100%;
                position: absolute;

                top: 100%;
                background-color: #f8f8f8;

                display: flex;
                flex-wrap: wrap;
                justify-content: center;

                height: 0;
                overflow: hidden;

                transition: .3s;
            }
            .select div label
            {
                width: 100%;
                text-align: center;

                padding: 13px 0;
                cursor: pointer;

                transition: .3s;
            }
            .select div label:hover
            {
                background-color: #f1f1f1;
            }
        </style>`)
})
