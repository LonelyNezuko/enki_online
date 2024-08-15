const selBlock =
{
    add: (selector, selBlockID, blocks, data = {}) =>
    {
        if(!$('*').is(selector))return console.log(`Селектор '${selector}' не найден | selBlock.add`)
        $(selector).append(`
            <div class="selBlock" data-selBlockID="${selBlockID}">
                <button class="selBlock-button" data-selBlockButtonID="0"></button>
                <button class="selBlock-button" data-selBlockButtonID="1"></button>

                <div class="selBlock-sections"></div>
            </div>`)
        blocks.forEach(item =>
        {
            $(selector).find('.selBlock .selBlock-sections').append(`
                <div class="selBlock-section">${item}</div>`)
        })

        selBlock.select(selBlockID, data.selectID || 1)
    },
    select: (selBlockID, selectID) =>
    {
        if(selectID === undefined || isNaN(selectID))return console.log(`Ошибка в selectID: ${selectID} | selBlock.select`)

        if(!$('*').is(`.selBlock[data-selBlockID="${selBlockID}"]`))return console.log(`selBlock '${selBlockID}' не найден | selBlock.select`)
        if(!$('*').is(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-section:nth-child(${selectID})`))return console.log(`Блока ${selectID} в selBlock '${selBlockID}' нет | selBlock.select`)

        $(`.selBlock[data-selBlockID="${selBlockID}"]`).attr('data-selBlockSelect', selectID)
        $(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-sections`).css({ 'transform': `translateX(${selectID == 1 ? 0 : -1 * ((selectID - 1) * 100)}%)` })

        if(selectID <= 1) $(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-button[data-selBlockButtonID=0]`).hide()
        else if(selectID > 1) $(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-button[data-selBlockButtonID=0]`).show()

        if(selectID >= $(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-sections .selBlock-section`).length) $(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-button[data-selBlockButtonID=1]`).hide()
        else if(selectID < $(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-sections .selBlock-section`).length) $(`.selBlock[data-selBlockID="${selBlockID}"] .selBlock-button[data-selBlockButtonID=1]`).show()
    }
}

$(document).ready(() =>
{
    $('body').on('click', '.selBlock .selBlock-button', elem =>
    {
        const
            selBlockID = $(elem.currentTarget).parent().attr('data-selBlockID'),
            buttonID = parseInt($(elem.currentTarget).attr('data-selBlockButtonID'))
        let selectID = parseInt($(elem.currentTarget).parent().attr('data-selBlockSelect'))

        if(buttonID === undefined || isNaN(buttonID))return

        if(buttonID === 1) selectID ++
        else selectID --

        selBlock.select(selBlockID, selectID)
    })

    selBlock.add('.page-account .page-account-other .page-account-other-online', 'testSelBlock', [
        `<h1>Игровой онлайн за день</h1>

        <div class="page-account-other-section page-account-other-section-error">
            <h6>Тут должен быть график за день</h6>
        </div>`,
        `<h1>Игровой онлайн за сутки</h1>

        <div class="page-account-other-section page-account-other-section-error">
            <h6>Тут должен быть график за сутки</h6>
        </div>`,
        `<h1>Игровой онлайн за неделю</h1>

        <div class="page-account-other-section page-account-other-section-error">
            <h6>Тут должен быть график за неделю</h6>
        </div>`
    ], {
        selectID: 2
    })

    // selBlock.add('.page-account .page-account-other .page-account-other-houses', 'testSelBlock', [
    //     `<h1>Мои дома</h1>
    //
    //     <div class="page-account-other-section">
    //         <div class="page-account-houses-items">
    //             <div>
    //                 <div class="logo">
    //                     <img src="src/images/houses/house.png" style="width: 100%; height: 100%;">
    //                 </div>
    //             </div>
    //         </div>
    //     </div>`,
    //     `<h1>Мой транспорт</h1>
    //
    //     <div class="page-account-other-section">
    //     </div>`,
    //     `<h1>Мои бизнесы</h1>
    //
    //     <div class="page-account-other-section page-account-other-section-error">
    //         <h6>Бизнесов не имеется</h6>
    //     </div>`
    // ])

    $('body').prepend(`
        <style>
            .selBlock
            {
                position: relative;
                width: 100%;

                overflow: hidden;
            }
            .selBlock .selBlock-button
            {
                position: absolute;

                width: 60px;
                height: 100%;

                padding: 0;
                background-color: transparent;

                font-size: 37px;
                z-index: 5;

                border: 0;
                text-transform: uppercase;

                border-radius: 3px;

                cursor: pointer;
                color: #898989;

                transition: .2s;
            }
            .selBlock .selBlock-button:hover
            {
                background-color: rgb(232, 232, 232, .5);
            }
            .selBlock .selBlock-button:before
            {
                position: absolute;

                display: block;
                content: "";

                width: 14px;
                height: 14px;

                border-top: 1px solid black;
                border-right: 1px solid black;

                transform: rotate(-135deg);
                left: calc(50% - 4px);
            }
            .selBlock .selBlock-button[data-selBlockButtonID="1"]
            {
                right: 0;
            }
            .selBlock .selBlock-button[data-selBlockButtonID="1"]:before
            {
                transform: rotate(45deg);
                left: calc(50% - 10px);
            }
            .selBlock .selBlock-sections
            {
                width: calc(100% - 100px - 20px);
                margin: 0 auto;

                display: flex;
                position: relative;

                transition: .2s;
            }
            .selBlock .selBlock-section
            {
                min-width: 100%;
            }
        </style>`)
})
