import url from '../_url.js'
import auth from '../_auth.js'

import { _renderAccount, _renderAccountSettings } from './pages/account.js'
import { _renderMessages } from './pages/messages.js'
import { _renderReports } from './pages/report.js'

const router = {
    get: (pathname, attrs = {}) =>
    {
        dialog.hide()
        $('.header .notfmenu').removeClass('notfmenu-show')

        loading.stop()
        loading.go()

        $.post('/_default', {}, result =>
        {
            if(result === 'remove_cookies')return auth.removeAccountCookies()
            result = JSON.parse(result)

            $('.header #headerItemMessages h6').remove()
            if(result.freeMessages) $('.header #headerItemMessages').append(`<h6 data-count="${result.freeMessages}">${result.freeMessages > 99 ? '99+' : `${result.freeMessages}`}</h6>`)

            $('.header #headerItemNotf h6').remove()
            if(result.freeNotf) $('.header #headerItemNotf').append(`<h6>${result.freeNotf > 99 ? '99+' : `${result.freeNotf}`}</h6>`)

            $('.menu .menu-nav .menu-nav-group-fraction').remove()
            $('.menu .menu-nav .menu-nav-group-admin').remove()

            $('.notfmenu').removeClass('notfmenu-none')
            $('.notfmenu .notfmenu-clear').remove()

            if(!result.notfAll.length)
            {
                $('.notfmenu .notfmenu-section').html(`
                    <svg viewbox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="notfmenuSectionNoneSVGMask" style="mask-type:alpha" maskunits="userSpaceOnUse" x="0" y="0" width="30" height="30">
                            <rect width="30" height="30" fill="url(#notfmenuSectionNoneSVGPattern)"></rect>
                        </mask>
                        <g mask="url(#notfmenuSectionNoneSVGMask)">
                            <rect width="30" height="30" fill="#CBCBCB"></rect>
                        </g>
                        <defs>
                            <pattern id="notfmenuSectionNoneSVGPattern" patterncontentunits="objectBoundingBox" width="1" height="1">
                                <use xlink:href="#notfmenuSectionNoneSVGImage" transform="scale(0.0111111)"></use>
                            </pattern>
                            <image id="notfmenuSectionNoneSVGImage" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAACAElEQVR4nO3csVJTQRSA4R8dpIOxE3B0bPWZfAMtmVDwHoxY+ypaCVZW2jg+QbAhDRThdoTJ3bt7du/6fzNb5ubwzyGQZBKQJEmSJEnSJgfACXAJLIHbmZ0l8P3+Z9jP3Cabd8Bv6sfKdX4Bb7MWyuAA+EP9OLnPX+B5xk6TnVM/SqlznrHTJK+AG+oHKXVWwJupkZ5MvQBwBjzLcJ1W7QKntYd4bJsvKs6V6jMFt3qKiweGamKwRK/ZvDifag3V2zYPmtvq3rZ50NRW97rNg2a2utdtHjSx1b1v86D6Vve+zYPqW73acOc9bfPgsa0eZSfhzm8TbtOjUe1yPAXXFgwdxNBBDB3E0EFaCb0CFsAx67/mOc4x69eRR/8r1ooS72IsCs67KDRzcSWGPiw474tCM4/SykNHyhOnbT0teO2ttRL6/UyvXVSJX8Mb1o+lRxnnPLq/Zql36EfxtY50vtbRIkMHMXQQQwcxdBBDBzF0EEMHMXQQQwcxdBBDBzF0EEMHMXQQQwcxdBBDBzF0EEMHMXQQQwcxdBBDBzF0EEMHMXQQQwcxdBBDBzF0EEMHSQn9L/sU87Mce4OU0D8TbtOb0Q1SQn9JuE1vQhrsAT8o8wGcOZwrAr+58iX/Z+wr1h99DrUHfAS+AdeJg8/hXANfgQ/0/R2skiRJkiRJW7sDIxjF/Jby1JQAAAAASUVORK5CYII="></image>
                        </defs>
                    </svg>
                    <span>Уведомлений<br>не найдено</span>`)
                $('.notfmenu').addClass('notfmenu-none')
            }
            else
            {
                $('.notfmenu .notfmenu-section').html('')
                $('.notfmenu').append(`<div class="notfmenu-clear">Очистить уведомления</div>`)

                result.notfAll.forEach(item =>
                {
                    let
                        date = '00.00',
                        time = '00:00'

                    date = new Date(item.notfDate).getDate() + '.' + new Date(item.notfDate).getMonth() + 1
                    time = new Date(item.notfDate).getHours() + ':' + new Date(item.notfDate).getMinutes()

                    $('.notfmenu .notfmenu-section').append(`
                        <a class="notfmenu-section-item" ${item.notfURL.length ? `href="${item.notfURL}"` : ''}>
                            ${!item.notfRead ? "<div class='notfmenu-section-item-notread'></div>" : ""}
                            <div class="avatar ${item.notfSubAccount === -1 ? "avatar-img" : ""}">
                                <img src=${item.notfAvatar} />
                            </div>
                            <div class="notfmenu-section-item-info">
                                <div>
                                    <h2>${item.notfTitle}</h2>
                                    <span>${date} - ${time}</span>
                                </div>
                                <h3>${item.notfText}</h3>
                            </div>
                        </a>`)
                })
            }

            // if(result.account.pFraction != -1)
            // {
            //     $('.menu .menu-nav').append(`
            //         <div class="menu-nav-group menu-nav-group-fraction">
            //             <h1>Организация</h1>
            //             <a class="menu-nav-item" href="/fraction">
            //                 <svg viewbox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                     <mask id="menuNavItemFractionSVGMask" style="mask-type:alpha" maskunits="userSpaceOnUse" x="0" y="0" width="26" height="26">
            //                         <rect width="26" height="26" fill="url(#menuNavItemFractionSVGPattern)"></rect>
            //                     </mask>
            //                     <g mask="url(#menuNavItemFractionSVGMask)">
            //                         <rect width="26" height="26"></rect>
            //                     </g>
            //                     <defs>
            //                         <pattern id="menuNavItemFractionSVGPattern" patterncontentunits="objectBoundingBox" width="1" height="1">
            //                             <use xlink:href="#menuNavItemFractionSVGImage" transform="scale(0.0111111)"></use>
            //                         </pattern>
            //                         <image id="menuNavItemFractionSVGImage" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAADv0lEQVR4nO2dz29MQRzAP2iUdOPURLVx4dCgG9JGiyDpya+Ds78A9R+42KOEohfFnyCRCEKchIObSksIRTSSJqqbqoqqra7D7Car2dmd1/dm5k33+0nm8va9737nk9l5M+/NewuCIAiCIAiCIAgpZY3vBCzRDBwA+oEs0Am0AZnS5z+BSWAcGAGeAs+BReeZBkoPcAv4DhQjlilgn/uUw6IbeEx0uZUl5zzrgNgIDKF+8iLZEp3AGPEEi+Q67EX1qXElX3CdeEj0AXNIS7ZKJzCNSLbKBuAl0l1YZwhpydbpJv4QTlqyAXEnIyLZgB7idxneWes7AQNO+06gBn2+E0iKZlZ2gchFi84BX4EmS/Gd0k98yTZE5ypiHzQ5IO1dR7/vBKqQ4/+T62FfiSTJXdLVoitbcrncSTC+N96QHtHVJBdRVxCDJ086ROskF4FvCcT3zgL+RdeSXAR+x4yfCnyLrid51Yj22XWYSC6ibkAEz2v8iDaVXCzlWJe0z2rGgV0JxEnihKjjvclOaZ+wvPCdgAGjJjulXfQz3wkY8MR3AknQRDJ3u22VPLDepCJpb9GLpLv7uA388Z1EEkQ5+7suS8Aee1V3R5olF4H79qrujrRLLgC7rdXeEWmXXAQuWau9I0KQPIpaxRosIUieArbbEuCCECTPoVaxBksIkvPAflsCXBCC5BGku7BaCsBl1CrWYEmz5CXUZCRrrfaOsC35ESu7EJUHhpFptVEpr39eh1pBdB617mIMJXKhVKaBV6XPcsAhDK/ChYBtybI0F5HsBJHsAJHsAJHsAJFsgQ5gAHgIvEW9C8Om5IZ7hK0V9exfAbtiG7olHwdmcSe4IVvyGeI/XCmS63AE95IbrrvYgnQXTriBXsgvYBB1q6elVHqBK8B8jeNE8jI60I8uPgM7axzbBUxojhXJyziHviXXklymC/OW3bCSQU1GqkkZjBDjqiaGSK7gHdXFRLn93quJIZIr0L0sqiVCjIwmRkMO4XT8oLqgTK2DlrFJE2M20UxTiulC9EnN9h0Rvku3ry72qsJU9EfN9lMRvku374cIMVY9A1T/2c9j9nhaFv3w7qyFfIOl1oRlAjVO1pFFP2EpAO3Wsg6UYfSjhnnUOLkPdYLMoN7FfA31rLTuuOtOaxAIbSTzfqNymQE2O61BQCR1mfQvcMJx7sER98L/YimGYMAxVtaNzABHPeQbNK3ARcxeXlIAbqL6+YYkib8HaQdOovrcbcDW0vYvwCfgAXCPBpkBCoIgCIIgCIIgBMc/IoUZzSiRm/QAAAAASUVORK5CYII="></image>
            //                     </defs>
            //                 </svg>
            //                 <span>Фракция</span>
            //             </a>
            //         </div>`)
            // }
            // if(result.account.admin)
            // {
            //     $('.menu .menu-nav').append(`
            //         <div class="menu-nav-group menu-nav-group-admin">
            //             <h1>Администрация</h1>
            //             <a class="menu-nav-item" href="/admin">
            //             <svg viewbox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                     <mask id="menuNavItemFractionSVGMask" style="mask-type:alpha" maskunits="userSpaceOnUse" x="0" y="0" width="26" height="26">
            //                         <rect width="26" height="26" fill="url(#menuNavItemFractionSVGPattern)"></rect>
            //                     </mask>
            //                     <g mask="url(#menuNavItemFractionSVGMask)">
            //                         <rect width="26" height="26"></rect>
            //                     </g>
            //                     <defs>
            //                         <pattern id="menuNavItemFractionSVGPattern" patterncontentunits="objectBoundingBox" width="1" height="1">
            //                             <use xlink:href="#menuNavItemFractionSVGImage" transform="scale(0.0111111)"></use>
            //                         </pattern>
            //                         <image id="menuNavItemFractionSVGImage" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAADv0lEQVR4nO2dz29MQRzAP2iUdOPURLVx4dCgG9JGiyDpya+Ds78A9R+42KOEohfFnyCRCEKchIObSksIRTSSJqqbqoqqra7D7Car2dmd1/dm5k33+0nm8va9737nk9l5M+/NewuCIAiCIAiCIAgpZY3vBCzRDBwA+oEs0Am0AZnS5z+BSWAcGAGeAs+BReeZBkoPcAv4DhQjlilgn/uUw6IbeEx0uZUl5zzrgNgIDKF+8iLZEp3AGPEEi+Q67EX1qXElX3CdeEj0AXNIS7ZKJzCNSLbKBuAl0l1YZwhpydbpJv4QTlqyAXEnIyLZgB7idxneWes7AQNO+06gBn2+E0iKZlZ2gchFi84BX4EmS/Gd0k98yTZE5ypiHzQ5IO1dR7/vBKqQ4/+T62FfiSTJXdLVoitbcrncSTC+N96QHtHVJBdRVxCDJ086ROskF4FvCcT3zgL+RdeSXAR+x4yfCnyLrid51Yj22XWYSC6ibkAEz2v8iDaVXCzlWJe0z2rGgV0JxEnihKjjvclOaZ+wvPCdgAGjJjulXfQz3wkY8MR3AknQRDJ3u22VPLDepCJpb9GLpLv7uA388Z1EEkQ5+7suS8Aee1V3R5olF4H79qrujrRLLgC7rdXeEWmXXAQuWau9I0KQPIpaxRosIUieArbbEuCCECTPoVaxBksIkvPAflsCXBCC5BGku7BaCsBl1CrWYEmz5CXUZCRrrfaOsC35ESu7EJUHhpFptVEpr39eh1pBdB617mIMJXKhVKaBV6XPcsAhDK/ChYBtybI0F5HsBJHsAJHsAJHsAJFsgQ5gAHgIvEW9C8Om5IZ7hK0V9exfAbtiG7olHwdmcSe4IVvyGeI/XCmS63AE95IbrrvYgnQXTriBXsgvYBB1q6elVHqBK8B8jeNE8jI60I8uPgM7axzbBUxojhXJyziHviXXklymC/OW3bCSQU1GqkkZjBDjqiaGSK7gHdXFRLn93quJIZIr0L0sqiVCjIwmRkMO4XT8oLqgTK2DlrFJE2M20UxTiulC9EnN9h0Rvku3ry72qsJU9EfN9lMRvku374cIMVY9A1T/2c9j9nhaFv3w7qyFfIOl1oRlAjVO1pFFP2EpAO3Wsg6UYfSjhnnUOLkPdYLMoN7FfA31rLTuuOtOaxAIbSTzfqNymQE2O61BQCR1mfQvcMJx7sER98L/YimGYMAxVtaNzABHPeQbNK3ARcxeXlIAbqL6+YYkib8HaQdOovrcbcDW0vYvwCfgAXCPBpkBCoIgCIIgCIIgBMc/IoUZzSiRm/QAAAAASUVORK5CYII="></image>
            //                     </defs>
            //                 </svg>
            //                 <span>Главная</span>
            //             </a>
            //         </div>`)
            //     if(result.account.admin.aLevel >= 5)
            //     {
            //         $('.menu .menu-nav .menu-nav-group-admin').append(`
            //             <a class="menu-nav-item" href="/admin/settings">
            //                 <svg viewbox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            //                     <mask id="menuNavItemFractionSVGMask" style="mask-type:alpha" maskunits="userSpaceOnUse" x="0" y="0" width="26" height="26">
            //                         <rect width="26" height="26" fill="url(#menuNavItemFractionSVGPattern)"></rect>
            //                     </mask>
            //                     <g mask="url(#menuNavItemFractionSVGMask)">
            //                         <rect width="26" height="26"></rect>
            //                     </g>
            //                     <defs>
            //                         <pattern id="menuNavItemFractioSVGnPattern" patterncontentunits="objectBoundingBox" width="1" height="1">
            //                             <use xlink:href="#menuNavItemFractionSVGImage" transform="scale(0.0111111)"></use>
            //                         </pattern>
            //                         <image id="menuNavItemFractionSVGImage" width="90" height="90" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAABmJLR0QA/wD/AP+gvaeTAAADv0lEQVR4nO2dz29MQRzAP2iUdOPURLVx4dCgG9JGiyDpya+Ds78A9R+42KOEohfFnyCRCEKchIObSksIRTSSJqqbqoqqra7D7Car2dmd1/dm5k33+0nm8va9737nk9l5M+/NewuCIAiCIAiCIAgpZY3vBCzRDBwA+oEs0Am0AZnS5z+BSWAcGAGeAs+BReeZBkoPcAv4DhQjlilgn/uUw6IbeEx0uZUl5zzrgNgIDKF+8iLZEp3AGPEEi+Q67EX1qXElX3CdeEj0AXNIS7ZKJzCNSLbKBuAl0l1YZwhpydbpJv4QTlqyAXEnIyLZgB7idxneWes7AQNO+06gBn2+E0iKZlZ2gchFi84BX4EmS/Gd0k98yTZE5ypiHzQ5IO1dR7/vBKqQ4/+T62FfiSTJXdLVoitbcrncSTC+N96QHtHVJBdRVxCDJ086ROskF4FvCcT3zgL+RdeSXAR+x4yfCnyLrid51Yj22XWYSC6ibkAEz2v8iDaVXCzlWJe0z2rGgV0JxEnihKjjvclOaZ+wvPCdgAGjJjulXfQz3wkY8MR3AknQRDJ3u22VPLDepCJpb9GLpLv7uA388Z1EEkQ5+7suS8Aee1V3R5olF4H79qrujrRLLgC7rdXeEWmXXAQuWau9I0KQPIpaxRosIUieArbbEuCCECTPoVaxBksIkvPAflsCXBCC5BGku7BaCsBl1CrWYEmz5CXUZCRrrfaOsC35ESu7EJUHhpFptVEpr39eh1pBdB617mIMJXKhVKaBV6XPcsAhDK/ChYBtybI0F5HsBJHsAJHsAJHsAJFsgQ5gAHgIvEW9C8Om5IZ7hK0V9exfAbtiG7olHwdmcSe4IVvyGeI/XCmS63AE95IbrrvYgnQXTriBXsgvYBB1q6elVHqBK8B8jeNE8jI60I8uPgM7axzbBUxojhXJyziHviXXklymC/OW3bCSQU1GqkkZjBDjqiaGSK7gHdXFRLn93quJIZIr0L0sqiVCjIwmRkMO4XT8oLqgTK2DlrFJE2M20UxTiulC9EnN9h0Rvku3ry72qsJU9EfN9lMRvku374cIMVY9A1T/2c9j9nhaFv3w7qyFfIOl1oRlAjVO1pFFP2EpAO3Wsg6UYfSjhnnUOLkPdYLMoN7FfA31rLTuuOtOaxAIbSTzfqNymQE2O61BQCR1mfQvcMJx7sER98L/YimGYMAxVtaNzABHPeQbNK3ARcxeXlIAbqL6+YYkib8HaQdOovrcbcDW0vYvwCfgAXCPBpkBCoIgCIIgCIIgBMc/IoUZzSiRm/QAAAAASUVORK5CYII="></image>
            //                     </defs>
            //                 </svg>
            //                 <span>Настройки адм. доступа</span>
            //             </a>`)
            //     }
            // }

            $('.menu .menu-nav-item').removeClass('menu-nav-item-select')
            $('.header .header-item:not(.header-item-username)').removeClass('header-item-select')

            $('.header .header-item.header-item-username span').text(result.account.pName)

            switch(pathname)
            {
                case '/':
                    url.locate('/account')
                    break

                case '/account':
                    $.post('/account/_get', {}, result =>
                    {
                        if(result === 'remove_cookies')return auth.removeAccountCookies()
                        router.render('account', result)
                    })
                    break
                case '/account/settings':
                    $.post('/account/settings/_get', {}, result =>
                    {
                        if(result === 'remove_cookies')return auth.removeAccountCookies()
                        router.render('account/settings', result)
                    })
                    break
                // case '/messages':
                //     $.post('/messages/_get', {}, result =>
                //     {
                //         if(result === 'remove_cookies')return auth.removeAccountCookies()
                //         router.render('messages', result)
                //     })
                //     break
                // case '/report':
                //     $.post('/report/_get', {}, result =>
                //     {
                //         if(result === 'remove_cookies')return auth.removeAccountCookies()
                //         router.render('report', result)
                //     })
                //     break
                default:
                    notf.send('error', 'Страница не найдена')
                    loading.stop()
                    break
            }
        })
    },
    render: (pagename, data = {}) =>
    {
        loading.stop()
        switch(pagename)
        {
            case 'account':
                _renderAccount(data)
                break
            case 'account/settings':
                _renderAccountSettings(data)
                break
            case 'messages':
                _renderMessages(data)
                break
            case 'report':
                _renderReports(data)
                break
        }

        $('.body').prepend('<div class="notf"></div>')
    }
}
export default router
