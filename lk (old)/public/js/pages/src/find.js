import { renderAccountPage } from './account.js'
import { url } from '../../main.js'

import { getHrefAttrs, realtyTypeNames } from '../../other.js'
import { loginData } from '../../other-pages/login.js'

function renderFindPageOpen(data)
{
	if(data.type === 'account')
	{
		if(loginData.admin > 0) url.locate('/admin/account', '?id=' + data.data.pID, { id: data.data.pID })
		else
		{
			$('.wrapper').append(`
				<div class="find-body">
				</div>`)

			renderAccountPage(data.data, true, '.find-body')
		}
	}
	else if(data.type === 'promo') url.locate('/admin/promo', '?id=' + data.data.promoID, { id: data.data.promoID })
	else if(data.type === 'realty')
	{
		const attrs = getHrefAttrs()
		if(attrs.realty === undefined)return url.locate('/find')

		if(attrs.realty === 'house') url.locate('/admin/realty', `?id=${data.data.houseID}&type=house`, { id: data.data.promoID, realty: 'house' })
		else if(attrs.realty === 'biz') url.locate('/admin/realty', `?id=${data.data.bID}&type=biz`, { id: data.data.promoID, realty: 'biz' })
		else if(attrs.realty === 'veh') url.locate('/admin/realty', `?id=${data.data.vehID}&type=veh`, { id: data.data.promoID, realty: 'veh' })
	}
	else if(data.type === 'report') url.locate('/admin/report', '?id=' + data.data.reportID, { id: data.data.reportID })
}
function renderFindPageList(data)
{
	$('.wrapper').append(`
		<div class="find-body">
			<div class="find-body-list">
			</div>
		</div>`)

	if(data.type === 'account')
	{
		data.data.forEach(item =>
		{
			$('.find-body .find-body-list').append(`
				<a href="/admin/account?id=${item.pID}" class="item-list">
					<div class="info">
						<div class="bg-list">
							<img src="/styles/images/skins/${item.pSkin}.png" alt="Скин #${item.pSkin}">
						</div>
						<div class="info-list">
							<h3>${item.pName}</h3>
							<div class="info-list-wrap">
								<span>Уровень: ${item.pLevel} (${item.pExp} / ${(item.pLevel + 1) * 4})</span>
								<span>Регистрация: ${moment(new Date(item.pRegDate)).fromNow()}</span>
								<span>RegIP: ${item.pIP}</span>
								<span>LastIP: ${item.pRegIP}</span>
							</div>
						</div>
					</div>
					<div class="info-open">
						<span></span>
					</div>
				</a>`)
		})
	}
	else if(data.type === 'promo')
	{
		data.data.forEach(item =>
		{
			$('.find-body .find-body-list').append(`
				<a href="/admin/promo?id=${item.promoID}" class="item-list">
					<div class="info">
						<div class="info-list">
							<h3>
								<span style="color: #159be8; font-weight: bold;">#</span>
								${item.promoName}
							</h3>
							<div class="info-list-wrap">
								<span>Создатель: ${item.promoCreator}</span>
								<span>Дата создания: ${new Date(item.promoDateCreator).toLocaleString()}</span>
								<span>Активаций: ${item.promoActives}</span>
							</div>
						</div>
					</div>
					<div class="info-open">
						<span></span>
					</div>
				</a>`)
		})
	}
	else if(data.type === 'realty')
	{
		const attrs = getHrefAttrs()
		if(attrs.realty === undefined)return url.locate('/find')

		if(attrs.realty === 'house')
		{
			data.data.forEach(item =>
			{
				$('.find-body .find-body-list').append(`
					<a href="/admin/realty?id=${item.houseID}&type=house" class="item-list">
						<div class="info">
							<div class="info-list">
								<h3>Дом #${item.houseID}</h3>
								<div class="info-list-wrap">
									<span>Владелец: ${item.houseOwnerName}</span>
									<span>Цена: ${item.housePrice.toLocaleString()} $</span>
									<span>Тип: ${realtyTypeNames.house[item.houseType]}</span>
								</div>
							</div>
						</div>
						<div class="info-open">
							<span></span>
						</div>
					</a>`)
			})
		}
		else if(attrs.realty === 'veh')
		{
			data.data.forEach(item =>
			{
				$('.find-body .find-body-list').append(`
					<a href="/admin/realty?id=${item.vehID}&type=veh" class="item-list">
						<div class="info">
							<div class="info-list">
								<h3>Транспорт #${item.vehID}</h3>
								<div class="info-list-wrap">
									<span>Тип: ${realtyTypeNames.veh[item.vehType]}</span>
									<span>Владелец: ${item.vehTypeIDName}</span>
									<span>Цена: ${item.vehPrice.toLocaleString()} $</span>
								</div>
							</div>
						</div>
						<div class="info-open">
							<span></span>
						</div>
					</a>`)
			})
		}
		else if(attrs.realty === 'biz')
		{
			data.data.forEach(item =>
			{
				$('.find-body .find-body-list').append(`
					<a href="/admin/realty?id=${item.bID}&type=biz" class="item-list">
						<div class="info">
							<div class="info-list">
								<h3>${item.bName} #${item.bID}</h3>
								<div class="info-list-wrap">
									<span>Владелец: ${item.bOwnerName}</span>
									<span>Цена: ${item.bPrice.toLocaleString()} $</span>
									<span>Тип: ${realtyTypeNames.biz[item.bType]}</span>
								</div>
							</div>
						</div>
						<div class="info-open">
							<span></span>
						</div>
					</a>`)
			})
		}
	}
	else if(data.type === 'report')
	{
		if(!localStorage.getItem('adm-report-likes')) localStorage.setItem('adm-report-likes', JSON.stringify([]))
		const storage = JSON.parse(localStorage.getItem('adm-report-likes'))

		const reportStatusName = [
			'<span style="color: green;">Открыта</span>',
			'<span style="color: red;">Отклонена</span>',
			'<span style="color: #fda605;">Одобрена</span>',
			'<span style="color: #e57373;">Закрыта</span>',
			'<span style="color: yellow;">На рассмотрении</span>'
		]

		data.data.forEach(item =>
		{
			$('.find-body .find-body-list').append(`
				<a href="/admin/report?id=${item.reportID}" class="item-list">
					<div class="info">
						<div class="info-list">
							<h3>
								${item.reportName} #${item.reportID}
								${storage.indexOf(`${item.reportID}`) != -1 ? "<div class='info-list-like-on info-list-like'></div>" : ""}
							</h3>
							<div class="info-list-wrap">
								<span>Создатель: ${item.reportCreatorName}</span>
								<span>Дата создания: ${moment(new Date(item.reportCreateDate)).fromNow()}</span>
								<span>На кого: ${item.reportPlayerName}</span>
								<span>Статус: ${reportStatusName[item.reportStatus]}</span>
								<span>Тег: ${!item.reportArchive ? `<span style='color: ${item.reportTagColor};'>${item.reportTagName}</span>` : "<span style='color: grey'>В архиве</span>"}</span>
							</div>
						</div>
					</div>
					<div class="info-open">
						<span></span>
					</div>
				</a>`)
		})
	}
}
function renderFindPageError(errorMessage)
{
	$('.wrapper').append(`
		<div class="find-body">
			<div class="find-error">
		    	<img src="/styles/images/notfound.png" alt="Ошибка!" />
		    	<span>${errorMessage}</span>
		    </div>
		</div>`)
}

export function renderFindPage(data)
{
	$('.wrapper').html('')

	// if(data.type === 'account'
	// 	&& !data.errorMessage) renderAccountPage(data, true)

	$('.wrapper').prepend(`
		<div class="find-up">
		    <div class="find-search">
		    	<input id="findSearch" type="text" placeholder="Найти..." maxlength="144" ${!data.search ? "" : `value="${data.search}"`} />
		    	<button id="findSearchGo"></button>
		    </div>
		</div>
		<div class="find-sort">
		    <div id="findSearchSort"></div>
		</div>`)

	let types = [ 'Аккаунты' ]
	if(loginData.admin > 0)
	{
		if(loginData.admin >= data.settings.admin.view.promo) types.push('Промокоды')
		if(loginData.admin >= data.settings.admin.view.realty) types.push('Недвижимость')
		if(loginData.admin >= data.settings.admin.view.report) types.push('Жалобы')
	}

	let defaultType = 'Аккаунты'
	const attrs = getHrefAttrs()

	if(attrs.type === 'promo'
		&& loginData.admin >= data.settings.admin.view.promo) defaultType = 'Промокоды'
	else if(attrs.type === 'realty'
		&& loginData.admin >= data.settings.admin.view.realty) defaultType = 'Недвижимость'
	else if(attrs.type === 'report'
		&& loginData.admin >= data.settings.admin.view.report) defaultType = 'Жалобы'

	select.add('#findSearchSort', types, {
            defaultName: defaultType
        })
	findChangeSelect(defaultType, data)

	$('#findSearchSort').unbind().on('selectChanges', (elem, type) => findChangeSelect(type.type, data))
	if(attrs.search)
	{
		$('#findSearch').val(attrs.search)
		findGoSearch(true)
	}
}
function findGoSearch(load = false)
{
	const attrs = getHrefAttrs()
	let
		type = attrs.type,
		search = attrs.search,

		realty = attrs.realty,
		tag = attrs.tag

	if(!load)
	{
		search = $('#findSearch').val()
		type = $('#findSearchSort').attr('data-select-type')

		if(type === 'Аккаунты') type = 'account'
		else if(type === 'Промокоды') type = 'promo'
		else if(type === 'Недвижимость')
		{
			type = 'realty'
			realty = $('.find-up-other button.find-up-other-realty-btn-select').text()

			if(realty === 'Бизнесы') realty = 'biz'
			else if(realty === 'Транспорт') realty = 'veh'
			else if(realty === 'Дома') realty = 'house'
			else return false
		}
		else if(type === 'Жалобы')
		{
			type = 'report'
			tag = $('.find-up-other div div button.find-up-other-realty-btn-select').text()
		}
		else type = 'none'
	}

	if(!type || type === 'none')return false
	if(!search.length)return false

	if(type === 'report'
		&& !tag.length)return false

	let seturl = `/find?type=${type}&search=${search}`

	if(type === 'report') seturl += `&tag=${tag}`
	else if(type === 'realty') seturl += `&realty=${realty}`

	url.set(seturl)

	let likes = []
	if(type === 'report' && tag === 'Избранное')
	{
		const temp = localStorage.getItem('adm-report-likes')

		if(!temp) likes = []
		else likes = JSON.parse(temp)
	}

	$('.find-body').remove()

	loading.go()
	$.post('/find', { type: type, search: search, data: JSON.stringify({ realty: realty, tag: tag, reportLikes: likes }) }, results =>
	{
		loading.stop()

		let seturl = `/find?type=${type}&search=${search}`

		if(type === 'report') seturl += `&tag=${tag}`
		else if(type === 'realty') seturl += `&realty=${realty}`

		url.set(seturl)
		if(results.message === 'exit')return __removeAccCookies()

		if(results.message === 'notrights')return renderFindPageError('У Вас не доступа для просмотра данной страницы!')
		if(results.message === 'error')
		{
			url.set("/find")
			return dialog.show('error', 'error', null, 'Произошла ошибка! Попробуйте обновить страницу.')
		}

		if(results.message === 'notadmin')return dialog.show('error', 'error', null, 'Ваш уровень администрирования не достаточен, для просмотра данной страницы!')
		if(results.message === 'notfound')return renderFindPageError('Ничего не найдено!')

		if(results.message === 'list')
		{
			if(loginData.admin <= 0)return renderFindPageError('Ничего не найдено!')
			return renderFindPageList(results)
		}
		if(results.message === 'open')return renderFindPageOpen(results)
	})
}
function findChangeSelect(type, data)
{
	$('.find-up-other').remove()
	if(loginData.admin <= 0)return false

	if(type === 'Промокоды'
		&& loginData.admin >= data.settings.admin.view.promo)
	{
		if(loginData.admin >= data.settings.admin.promo.create) $('.find-up').append(`
			<div class="find-up-other" style="margin-left: 20px;">
				<a href="/admin/promo?create" class="button">Создать промокод</a>
			</div>`)
	}
	else if(type === 'Недвижимость'
		&& loginData.admin >= data.settings.admin.view.realty)
	{
		const realty = getHrefAttrs().realty

		$('.find-up').append(`
			<div class="find-up-other" style="width: 100%; margin-top: 20px; display: flex; justify-content: center; align-items: center; flex-wrap: wrap;">
				<br>
				<button class="realty-select-btn find-up-other-realty-btn ${realty === 'biz' ? 'find-up-other-realty-btn-select' : ''}">Бизнесы</button>
				<button class="realty-select-btn find-up-other-realty-btn ${realty === 'veh' ? 'find-up-other-realty-btn-select' : ''}" style="margin: 0 10px;">Транспорт</button>
				<button class="realty-select-btn find-up-other-realty-btn ${realty === 'house' ? 'find-up-other-realty-btn-select' : ''}">Дома</button>
			</div>`)
	}
	else if(type === 'Жалобы'
		&& loginData.admin >= data.settings.admin.view.realty)
	{
		$('.find-up').append(`
			<div class="find-up-other" style="width: 100%; margin-top: 20px; display: flex; justify-content: center; align-items: center; flex-wrap: wrap;"></div>`)

		if(loginData.admin >= data.settings.admin.report.tag.create) $('.find-up-other').append(`
			<a href="/admin/report?tags" class="button" style="margin-left: 20px;">Управление тегами</a>`)

		if(data.sortTags)
		{
			let defaultSortName = ''

			const sort = getHrefAttrs().tag
	    	if(sort) defaultSortName = sort

	    	$('.find-up-other').append(`<div style="width: 100%; "><div style="width: 700px; max-width: 95%; display: flex; justify-content: center; align-items: center; flex-wrap: wrap; margin: 0 auto; margin-top: 10px;"></div></div>`)
	    	data.sortTags.forEach(item => $('.find-up-other div div').append(`<button style="margin: 10px;" class="tag-select-btn find-up-other-realty-btn ${defaultSortName === item ? "find-up-other-realty-btn-select" : ""}" data-sort-name="${item}">${item}</button>`))
		}
	}
}

$(document).ready(() =>
{
	$(document).on('click', '#findSearchGo', () => findGoSearch())
	$(window).keyup(e =>
	{
		if(e.which == 13
			&& $('#findSearch').is(":focus")) findGoSearch()
	})

	$(document).on('click', '.realty-select-btn', elem =>
	{
		$('.realty-select-btn').removeClass('find-up-other-realty-btn-select')
		$(elem.target).addClass('find-up-other-realty-btn-select')
	})

	$(document).on('click', '.tag-select-btn', elem =>
	{
		$('.tag-select-btn').removeClass('find-up-other-realty-btn-select')
		$(elem.target).addClass('find-up-other-realty-btn-select')
	})
})
