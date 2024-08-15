import auth from './_auth.js'

const search = {
    changeType: () =>
    {
        const type = $('.search button').attr('data-type')
        // switch(type)
        // {
        //     case 'accounts':
        //         $('.search button').attr('data-type', 'report')
        //         $('.search button').html('Жалобы')
        //         break
        //     case 'report':
        //         $('.search button').attr('data-type', 'realty')
        //         $('.search button').html('Недвижимость')
        //         break
        //     case 'realty':
        //         $('.search button').attr('data-type', 'promo')
        //         $('.search button').html('Промокоды')
        //         break
        //     case 'promo':
        //         $('.search button').attr('data-type', 'accounts')
        //         $('.search button').html('Аккаунты')
        //         break
        // }
    },
    text: (text) =>
    {
        if(text.length < 2) $('.search-wrap').removeClass('search-wrap-show')
        else
        {
            const type = $('.search button').attr('data-type')
            if(type !== 'accounts' && type !== 'report' && type !== 'realty' && type !== 'promo')return

            $.post('/_search', { text: text, type: type }, result =>
            {
                if(result === 'remove_cookies')return auth.accountRemoveCookies()
                if(result === 'notfound')return $('.search-wrap').removeClass('search-wrap-show')

                result = JSON.parse(result)
                search.setResult(type, result)
            })
        }
    },
    setResult: (type, results) =>
    {
        $('.search-wrap').html('')
        switch(type)
        {
            case 'accounts':
            {
                results.forEach(item =>
                {
                    $('.search-wrap').append(`
                        <a class="search-wrap-item" href="/accounts?id=${item.pID}">
                            <div class="search-wrap-item-desc">
                                <button class="button">Подробнее</button>
                            </div>
                            <div class="search-wrap-item-img ${item.ban ? "search-wrap-item-img-ban" : item.pOnline !== -1 ? "search-wrap-item-img-online" : ""}">
                                <div>
                                    <img src="/images/skins/${item.pSkin}.png" />
                                </div>
                            </div>
                            <div class="search-wrap-item-info">
                                <header>
                                    <h1>Имя (UID)</h1>
                                    <span>${item.pName} (${item.pID})</span>
                                </header>
                                <section>
                                    <div>
                                        <h1>Уровень:</h1>
                                        <span>${item.pLevel} (${item.pExp} / ${(item.pLevel + 1) *4})</span>
                                    </div>
                                    <div>
                                        <h1>Наличные:</h1>
                                        <span>${item.pCash.toLocaleString()} $</span>
                                    </div>
                                    <div>
                                        <h1>Последний вход:</h1>
                                        <span>${item.pOnline !== -1 ? "<span style='color: #5ad166'>Онлайн</span>" : new Date(item.pLastEnter).toLocaleString()}</span>
                                    </div>
                                    <div>
                                        <h1>Фракция:</h1>
                                        <span>${item.pFraction === -1 ? "Не имеется" : `${item.fractionName}: ${item.fractionRank} (${item.pRank})`}</span>
                                    </div>
                                </section>
                            </div>
                        </a>`)
                })
                break
            }
        }

        $('.search-wrap').addClass('search-wrap-show')
    }
}

$(document).ready(() =>
{
    $('.search button').on('click', () => search.changeType())
    $('.search input').on('input', (elem) => search.text($(elem.currentTarget).val()))
})

export default search
