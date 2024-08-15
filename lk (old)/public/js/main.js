import { page } from './pages/index.js'
import { report } from './pages/src/report.js'

import { notf } from './modules/notf.js'
import { __removeAccCookies, loginData } from './other-pages/login.js'

import { messages } from './pages/src/messages.js'


moment.locale('ru')
$(document).ready(() =>
{
	$('.header-swipe-menu').on('click', () => menu.swipe())
	$(window).resize(() =>
	{
		if(window.innerWidth < 1000
			&& window.innerWidth >= 700) menu.swipe('swipe')
		else if(window.innerWidth < 700) menu.swipe('open')
		else if(window.innerWidth >= 1000) menu.swipe(localStorage.getItem('menu-swiped'))
	})

	$(document).mouseup(e =>
	{
		if(window.innerWidth < 1000)
		{
			var div = $('.menu')

			if(!div.is(e.target)
			    && div.has(e.target).length === 0
			    && !$(e.target).hasClass('header-swipe-menu')
			    && !$(e.target).parent().hasClass('header-swipe-menu'))
			{
				if(window.innerWidth < 1000
					&& window.innerWidth >= 700) menu.swipe('swipe')
				else if(window.innerWidth < 700) menu.swipe('open')
			}
		}
	})
})

const menu =
{
	select: (attr) =>
	{
		$('.menu-item').removeClass('menu-item-select')
		$(`.menu-item[data-menu-item-id="${attr}"]`).addClass('menu-item-select')
	},
	swipe: (status = 'auto') =>
	{
		if(status != 'auto')
		{
			if(status === 'swipe')
			{
				$('.header-swipe-menu').addClass('header-swipe-menu-on')
				$('.menu').addClass('menu-swiped')
			}
			else if(status === 'open')
			{
				$('.header-swipe-menu').removeClass('header-swipe-menu-on')
				$('.menu').removeClass('menu-swiped')
			}
		}
		else
		{
			if($('.menu').hasClass('menu-swiped'))
			{
				$('.header-swipe-menu').removeClass('header-swipe-menu-on')
				$('.menu').removeClass('menu-swiped')
			}
			else
			{
				$('.header-swipe-menu').addClass('header-swipe-menu-on')
				$('.menu').addClass('menu-swiped')
			}
		}

		if(window.innerWidth >= 1000) localStorage.setItem('menu-swiped', !$('.menu').hasClass('menu-swiped') ? "open" : "swipe")
	}
}
export const url =
{
	set: (pathname = '/') =>
	{
		var state = { pageName: pathname }

		const href = window.location.origin + pathname
		history.pushState(state, "", href)
	},
	locate: (pathname = '/account', attrsURL = undefined, attrs = undefined) =>
	{
		var href = window.location.origin + pathname
		if(attrsURL != undefined) href += attrsURL

		url.check({ hostname: window.location.hostname, pathname: pathname, href: href, search: attrs })
	},
	check: (data) =>
	{
		if(data.hostname != window.location.hostname)return window.location.href = data.href
		url.update(data.pathname, data.search == undefined ? {} : data.search)

		if(data.return == undefined)
		{
			var state = { pageName: data.pathname }
			history.pushState(state, "", data.href)
		}
	},
	update: (pathname, attrs = {}) =>
	{
		loading.go()
		menu.select(pathname.replace('/', ''))

		notf.unread()
		if(pathname !== '/report') report.getUnreadMessages()
		if(pathname !== '/messages') messages.getUnreadMessages()

		if(window.innerWidth < 1000
			&& window.innerWidth >= 700) menu.swipe('swipe')
		else if(window.innerWidth < 700) menu.swipe('open')

		if(loginData.regContinue === 1)
		{
			loading.stop()
			return page.render('regContinue')
		}

		switch(pathname)
		{
			case '/':
			{
				url.locate('/account')
				break
			}
			case '/account':
			{
				$.post('/loadpage', { page: '/account' }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit' || results === 'notfound')return __removeAccCookies()
					page.render('account', results)
				})

				break
			}
			case '/changemail':
			{
				loading.stop()
				page.render('changemail')

				break
			}
			case '/report':
			{
				$.post('/loadpage', { page: '/report', data: JSON.stringify({ searchID: attrs.id }) }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()

					report.getUnreadMessages()
					if(results === 'searchNone')return url.locate('/report')

					if(!attrs.id) page.render('report', results)
					else page.render('report/info', results)
				})

				break
			}
			case '/report/create':
			{
				$.post('/report/gettags', {  }, results =>
				{
					loading.stop()
					page.render('report/add', results)
				})

				break
			}
			case '/find':
			{
				$.post('/loadpage', { page: '/find' }, results =>
				{
					loading.stop()

					if(results === 'regContinue')return __removeAccCookies()
					if(results === 'exit')return __removeAccCookies()

					loading.stop()
					page.render('find', results)
				})

				// if(!attrs.type)
				// {
				// 	$.post('/loadpage', { page: '/find' }, results =>
				// 	{
				// 		loading.stop()
				// 		if(results === 'exit')return __removeAccCookies()

				// 		loading.stop()
				// 		page.render('find', results)
				// 	})
				// }
				// else
				// {
				// 	$.post('/loadpage', { page: '/account', data: JSON.stringify({ search: attrs.search, id: attrs.id }) }, results =>
				// 	{
				// 		loading.stop()

				// 		if(results === 'exit')return __removeAccCookies()
				// 		if(results === 'notfound')return page.render('find-error', { errorMessage: "Аккаунт не найден!", search: attrs.search })

				// 		results.type = 'account'
				// 		results.search = attrs.search

				// 		page.render('find', results)
				// 	})
				// }
				break
			}
			case '/fraction':
			{
				$.post('/loadpage', { page: '/fraction' }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'error')return page.render('error', { message: "Фракция не найдена! Попробуйте позже." })

					page.render('fraction', results)
				})
				break
			}
			case '/fraction/application':
			{
				menu.select('fraction')
				$.post('/loadpage', { page: '/fraction/application', data: JSON.stringify({ frac: attrs.frac }) }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notFractions')return page.render('error', { message: "Фракций не найдено! Попробуйте позже." })
					if(results === 'notright')return url.locate('/fraction')

					if(results === 'notFraction')return page.render('error', { message: "Фракция не найдена! Попробуйте позже." })
					if(results === 'fracGang')return page.render('error', { message: "Фракция не является государственной." })
					if(results === 'fractionNotStatus')return page.render('error', { message: "Фракция не принимает заявки через сайт." })
					if(results === 'fractionNotForms')return page.render('error', { message: "Фракция не настроила форму для заявок." })
					if(results === 'notLevel')return page.render('error', { message: "Уровень Вашего аккаунта не совпадает с минимальными требованиями фракции." })

					if(results.type === 'list') page.render('fraction-application', results.data)
					else if(results.type === 'forms') page.render('fraction-application-form', results.data)
					else page.render('error', { message: "Ошибка! Попробуйте позже." })
				})
				break
			}
			case '/fraction/applications':
			{
				menu.select('fraction')

				$.post('/loadpage', { page: '/fraction/applications', data: JSON.stringify({ id: attrs.id }) }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')return url.locate('/fraction')
					if(results === 'gang')
					{
						dialog.show('Ошибка!', 'error', null, 'Ваша фракция не может управлять заявлениями!')
						return url.locate('/fraction')
					}
					if(results === 'notfound')return page.render('error', { message: "Анкета не была найдена!" })

				 	if(!attrs.id || isNaN(attrs.id)) page.render('fraction-applications', results)
				 	else page.render('fraction-applications-view', results)
				})
				break
			}
			case '/fraction/applications/edit':
			{
				menu.select('fraction')
				$.post('/loadpage', { page: '/fraction/applications/edit' }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')return url.locate('/fraction')
					if(results === 'gang')return page.render('error', { message: "Ваша фракция не является государственной." })

					page.render('fraction-applications-edit', results)
				})
				break
			}
			case '/admin':
			{
				$.post('/loadpage', { page: '/admin' }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')
					{
						$('.menu-item[data-menu-item-id="admin"]').remove()
						return url.locate('/account')
					}
					if(results === 'notadmin')return page.render('error', { message: "Ваш уровень администрирования не достаточен, для просмотра данной страницы!" })

					page.render('admin', results)
				})
				break
			}
			case '/admin/promo':
			{
				menu.select('admin')
				$.post('/loadpage', { page: '/admin/promo', data: JSON.stringify({ id: attrs.id, create: attrs.create }) }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')
					{
						$('.menu-item[data-menu-item-id="admin"]').remove()
						return url.locate('/account')
					}
					if(results === 'noid')return url.locate('/find', '?type=promo', { type:  'promo' })
					if(results === 'notfound')
					{
						dialog.show('error', 'error', null, 'Промокод не найден!')
						return url.locate('/admin')
					}
					if(results === 'notadmin')return page.render('error', { message: "Ваш уровень администрирования не достаточен, для просмотра данной страницы!" })

					page.render('admin-promo', results)
				})
				break
			}
			case '/admin/realty':
			{
				menu.select('admin')
				$.post('/loadpage', { page: '/admin/realty', data: JSON.stringify({ id: attrs.id, type: attrs.type }) }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')
					{
						$('.menu-item[data-menu-item-id="admin"]').remove()
						return url.locate('/account')
					}
					if(results === 'noid' || results === 'notype')return url.locate('/find', '?type=promo', { type: 'promo' })
					if(results === 'notfound')
					{
						dialog.show('error', 'error', null, 'Недвижимость не найдена!')
						return url.locate('/admin')
					}
					if(results === 'notadmin')return page.render('error', { message: "Ваш уровень администрирования не достаточен, для просмотра данной страницы!" })

					page.render('admin-realty', results)
				})
				break
			}
			case '/admin/account':
			{
				menu.select('admin')
				$.post('/loadpage', { page: '/admin/account', data: JSON.stringify({ id: attrs.id }) }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')
					{
						$('.menu-item[data-menu-item-id="admin"]').remove()
						return url.locate('/account')
					}
					if(results === 'noid')return url.locate('/find', '?type=account', { type: "account" })
					if(results === 'notfound')
					{
						dialog.show('error', 'error', null, 'Аккаунт не найден!')
						return url.locate('/admin')
					}
					if(results === 'notadmin')return page.render('error', { message: "Ваш уровень администрирования не достаточен, для просмотра данной страницы!" })

					page.render('admin-account', results)
				})
				break
			}
			case '/admin/report':
			{
				menu.select('admin')
				$.post('/loadpage', { page: '/admin/report', data: JSON.stringify({ id: attrs.id, tags: attrs.tags }) }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')
					{
						$('.menu-item[data-menu-item-id="admin"]').remove()
						return url.locate('/account')
					}
					if(results === 'noid')return url.locate('/find', '?type=report', { type: 'report' })
					if(results === 'notfound')
					{
						dialog.show('error', 'error', null, 'Жалоба не найден!')
						return url.locate('/admin')
					}
					if(results === 'notadmin')return page.render('error', { message: "Ваш уровень администрирования не достаточен, для просмотра данной страницы!" })

					page.render('admin-report', results)
				})
				break
			}
			case '/admin/settings':
			{
				menu.select('admin-settings')
				$.post('/loadpage', { page: '/admin/settings' }, results =>
				{
					loading.stop()
					if(results === 'regContinue')return __removeAccCookies()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')
					{
						$('.menu-item[data-menu-item-id="admin"]').remove()
						return url.locate('/account')
					}
					if(results === 'notadmin')return page.render('error', { message: "Ваш уровень администрирования не достаточен, для просмотра данной страницы!" })

					page.render('admin-settings', results)
				})
				break
			}
			case '/messages':
			{
				menu.select('account')
				$.post('/loadpage', { page: '/messages', data: JSON.stringify({ id: attrs.id }) }, results =>
				{
					loading.stop()

					if(results === 'regContinue')return __removeAccCookies()
					if(results === 'exit')return __removeAccCookies()

					messages.getUnreadMessages()

					if(!attrs.id) page.render('messages', results)
					else page.render('messages-id', results)
				})
				break
			}
			case '/roulette':
			{
				menu.select('account')
				$.post('/loadpage', { page: '/roulette', data: JSON.stringify({ name: attrs.name }) }, results =>
				{
					loading.stop()

					if(results === 'regContinue')return __removeAccCookies()
					if(results === 'exit')return __removeAccCookies()

					page.render('roulette', results)
				})
				break
			}
			case '/account/settings':
			{
				menu.select('account/settings')
				$.post('/loadpage', { page: '/account/settings' }, results =>
				{
					loading.stop()

					if(results === 'regContinue')return __removeAccCookies()
					if(results === 'exit')return __removeAccCookies()

					page.render('account-settings', results)
				})
				break
			}
			default: return false
		}
	}
}

$('.header-swipe-menu, .menu').ready(() =>
{
	if(window.innerWidth < 1000
		&& window.innerWidth >= 700) menu.swipe('swipe')
	else if(window.innerWidth < 700) menu.swipe('open')
	else menu.swipe(localStorage.getItem('menu-swiped'))

	$('.header-swipe-menu').css('transition', '.1s')
	$('.menu').css('transition', '.1s')
})
$(document).ready(() => {
	$('.menu-item[data-menu-item-id="exit"]').on('click', () => dialog.show('Вы уверены?', 'accept', 'exit-account', 'Вы действительно хотите выйти с аккаунта?', 'Нет', 'Да'))
	$('.dialog').on('dialogSuccess', (elem, data) =>
	{
		if(data.dialogid !== 'exit-account')return false
		__removeAccCookies()
	})

	$('.input-check-number').on('input', elem =>
	{
		let val = $(elem.target).val().replace(/[^\d]/, '')
		$(elem.target).val(val)
	})

	// acp.open()
})

$(document).on('loginDataReady', () =>
{
	var
		urlData = new URL(window.location.href),
		attrs = {}

	for(var value of new URLSearchParams(urlData.search.split('?')[1])) attrs[value[0]] = value[1]
	url.update(window.location.pathname, attrs)

	const cookiesCheck = localStorage.getItem('cookies-check')
	if(!cookiesCheck) $('.cookies-check').addClass('cookies-check-show')

	$('.cookies-check button').on('click', () =>
	{
		localStorage.setItem('cookies-check', '1')
		$('.cookies-check').removeClass('cookies-check-show')
	})
})

$(document).on('click', 'a', event =>
{
	const current = event.currentTarget

	event.preventDefault()
	var
		urlData = new URL(current.href),
		search = {}

	for(var value of new URLSearchParams(urlData.search.split('?')[1])) search[value[0]] = value[1]

	if(event.ctrlKey) window.open(current.href, current.href)
    else url.check({ hostname: current.hostname, pathname: current.pathname, href: current.href, search: search })
})

window.addEventListener("popstate", event =>
{
	var
		urlData = new URL(event.target.location.href),
		attrs = {}

	for(var value of new URLSearchParams(urlData.search.split('?')[1])) attrs[value[0]] = value[1]
	url.check({ hostname: event.target.location.hostname, pathname: event.target.location.pathname, href: event.target.location.href, search: attrs, return: true })
}, false);


window.onkeydown = event =>
{
    // if(event.keyCode == 123)
    // {
    // 	event.preventDefault()
    // 	dialog.show('ЦЫЦ!', 'error', 0, 'Не твое - не трогай!', 'Ладно')
	//
    // 	return false;
    // }
};

window.onkeypress = event =>
{
    if(event.keyCode == 123)
    {
    	event.preventDefault()
    	dialog.show('ЦЫЦ!', 'error', 0, 'Не твое - не трогай!', 'Ладно')

    	return false
    }
};

document.addEventListener("contextmenu", e =>
{
	event.preventDefault()
	dialog.show('ЦЫЦ!', 'error', 0, 'Не твое - не трогай!', 'Ладно')

	return false
});

$(document).bind('ajaxError', (event, request, settings, error) =>
{
	window.location.href = '/'
});
