import router from './routes/_index.js'

import url from './_url.js'
import auth from './_auth.js'
import functions from './_functions.js'
import search from './_search.js'

import { ioConnect, ioSocket } from './_io.js'
if(window.location.pathname !== '/login') ioConnect()

let test = 'dasd'
$(document).on('_toRender', (elem, data) =>
{
    console.log('Загрузка прошла')
    router.get(data.pathname, url.getSearch(window.location.href))
})

moment.locale('ru')
$(document).ready(() =>
{
    if(window.location.pathname === '/login')
    {
        if(functions.getCookie('auth'))return window.location.href = "/account"

        // const savedAccounts = auth.getSavedAccoutns()
        // if(!savedAccounts)
        // {
        //     $('.body .login span').html('Введите следующие данные для прохождения авторизация')
        //     $('.body .login-inputs').html(`
        //         <div class="login-inputs">
        //             <div class="input">
        //                 <input id="loginUsername" type="text" placeholder=" " maxlength="24" />
        //                 <label for="loginUsername">Введите свой игровой ник</label>
        //             </div>
        //             <div class="input">
        //                 <input id="loginPassword" type="password" placeholder=" " maxlength="24" />
        //                 <label for="loginPassword">Введите пароль от аккаунта</label>
        //             </div>
        //         </div>`)
        //     selectmenu.add('.body .login-inputs', 'loginServers', 'Выберите сервер', [
        //         {
        //             name: 'Enki Online | Test Server',
        //             id: 0
        //         },
        //         {
        //             name: 'Enki Online | One Server',
        //             id: 1
        //         }
        //     ])
        // }
        // else
        // {
        //     $('.body .login span').html('У Вас есть сохраненные аккаунты для входа.<br>Или <a id="loginAuthForNewAccount">войдите</a> под другим аккаунтом')
        //
        //     const accs = []
        //     savedAccounts.forEach((item, i) =>
        //     {
        //         accs.push({
        //             name: item.username,
        //             id: i
        //         })
        //     })
        //
        //     selectmenu.add('.body .login-inputs', 'loginSavedAccount', 'Выберите аккаунт', accs)
        // }

        $('.body .login span').html('Введите следующие данные для прохождения авторизация')
        $('.body .login-inputs').html(`
            <div class="input">
                <input id="loginUsername" type="text" placeholder=" " maxlength="24" />
                <label for="loginUsername">Введите свой игровой ник</label>
            </div>
            <div class="input">
                <input id="loginPassword" type="password" placeholder=" " maxlength="24" />
                <label for="loginPassword">Введите пароль от аккаунта</label>
            </div>`)

        selectmenu.add('.login-inputs', 'loginServers', 'Выберите сервер', servers, servers.length <= 1 ? { selectID: 0 } : {})

        $('.body .login-inputs').append(`
            <div class="login-href">
                <a id="loginResetPass">Восстановить пароль</a>
                <a id="loginForgotName">Не помню ник</a>
            </div>`)

        $('.body .login #loginEnter').on('click', () =>
        {
            const
                username = $('.login #loginUsername').val(),
                password = $('.login #loginPassword').val(),

                server = selectmenu.value('#loginServers')

            if(!username.length
                || !password.length
                || server === undefined)return notf.send('error', 'Заполните все поля')

            loading.go()
            $.post('/account/_login', { username: username, password: password, server: server }, result =>
            {
                loading.stop()

                if(result === 'incorrect_data')return notf.send('error', 'Упс, кажется что-то пошло не так.<br>Перепроверьте введенные данные')
                if(result === 'account_not_found')return notf.send('error', 'Введенный аккаунт не найден')
                if(result === 'invalid_password')return notf.send('error', 'Введенный пароль не верный')

                notf.send('success', "Вы успешно авторизовались.<br>Вы будете автоматически перенаправлены через 1 секунду")

                result = JSON.parse(result)
                auth.addAccountCookies(result.pID, result.pPassword, server)

                setTimeout(() => window.location.href = "/account", 1000)
                $('#loginEnter').attr('disabled', '')
            })
        })




        // [{"uid":1,"username":"MyAngelNezuko","password":"sadd","server":0},{"uid":2,"username":"Test_User","password":"dadsd","server":1},{"uid":3,"username":"Test_user_12","password":"12313","server":1}]
    }

    $('.menu #accountRemoveCookies').on('click', () =>
    {
        auth.removeAccountCookies()
    })
    $('.header #headerItemNotf').on('click', () =>
    {
        $('.header .notfmenu').addClass('notfmenu-show')
        if($('*').is('.header #headerItemNotf h6'))
        {
            $.post('/account/_readnotf', {}, result =>
            {
                if(result === 'remove_cookies')return auth.removeAccountCookies()

                $('.header #headerItemNotf h6').remove()
            })
        }
    })
    $('.notfmenu').on('click', '.notfmenu-clear', () =>
    {
        $.post('/account/_clearnotf', {}, result =>
        {
            if(result === 'remove_cookies')return auth.removeAccountCookies()
            notf.send('success', 'Уведомления были успешно очищены')

            $('.notfmenu').addClass('notfmenu-none')
            $('.notfmenu .notfmenu-clear').remove()

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
        })
    })

    $(document).mouseup(e =>
	{
		if($('.header .notfmenu').hasClass('notfmenu-show'))
		{
			var div = $('.header .notfmenu')

			if(!div.is(e.target)
			    && div.has(e.target).length === 0)
            {
                $('.header .notfmenu').removeClass('notfmenu-show')
                setTimeout(() =>
                {
                    $('.notfmenu .notfmenu-section .notfmenu-section-item .notfmenu-section-item-notread').remove()
                }, 500)
            }
		}
	})


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
})


// Динамика страницы
$(document).on('click', 'a', event =>
{
	const current = event.currentTarget
	event.preventDefault()

    if(!current.href.length)return false

	if(event.ctrlKey) window.open(current.href, current.href)
    else url.check({ hostname: current.hostname, pathname: current.pathname, href: current.href, search: url.getSearch(current.href) })
})

window.addEventListener("popstate", event =>
{
	url.check({ hostname: event.target.location.hostname, pathname: event.target.location.pathname, href: event.target.location.href, search: url.getSearch(event.target.location.href), return: true })
}, false);
