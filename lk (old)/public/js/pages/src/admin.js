import { url } from '../../main.js'
import { getHrefAttrs, realtyTypeNames, returnAcsData } from '../../other.js'

import { acp } from '../../modules/acp.js'

import { loginData } from '../../other-pages/login.js'

function renderAdminPageNav(select = "logs", other = "", settings = { width: "1200px" })
{
	let nav = `
		<div style="max-width: 100%; width: ${settings.width}; margin: 0 auto; margin-bottom: 30px;">
			<div class="sel-menu">
				<a href="/admin" ${select === 'logs' ? 'class="sel-menu-select"' : ""}>Логи</a>
				<a href="/admin/settings" ${select === 'settings' ? 'class="sel-menu-select"' : ""}>Настройка доступа</a>
				<a href="/admin/report/settings" ${select === 'report-settings' ? 'class="sel-menu-select"' : ""}>Настройки жалоб</a>`

	if(other !== "")
	{
		switch(other)
		{
			case 'promo':
			{
				nav += '<a href="/find?type=promo" class="sel-menu-select"}>Промокоды</a>'
				break
			}
			case 'account':
			{
				nav += '<a href="/find" class="sel-menu-select"}>Аккаунты</a>'
				break
			}
			case 'realty':
			{
				nav += '<a href="/find?type=realty" class="sel-menu-select"}>Недвижимость</a>'
				break
			}
			case 'report':
			{
				nav += '<a href="/find?type=report" class="sel-menu-select"}>Жалобы</a>'
				break
			}
		}
	}

	nav += `</div></div>`
	return nav
}

// Main
export function renderAdminPage(data)
{
	let
		lastLogs = data.lastLogs,
		popularPromo = data.popularPromo,
		lastRegAcc = data.lastRegAcc,

		onlines = data.onlines,
		onlinesDay = data.onlinesDay

	$('.wrapper').append(`
		${renderAdminPageNav()}

		<div class="adm-main-item">
			<h3>Статистика сервера за день</h3>

			<div class="adm-main-item-wrapper">
				<div class="server-info-graphics">
					${onlines == null ? '<h1 class="adm-main-item-error">Статистика не доступна</h1>' : '<canvas id="dayOnlineChart"></canvas>'}
				</div>
			</div>
		</div>
		<div class="adm-main-item">
			<h3>Статистика сервера за месяц</h3>

			<div class="adm-main-item-wrapper">
				<div class="server-info-graphics">
					<h1 class="adm-main-item-error">Статистика временно не доступна</h1>
				</div>
			</div>
		</div>

		<div class="adm-main-item" id="adm-main-last-logs">
			<h3>Последние логи</h3>

			<div class="adm-main-item-wrapper">
			</div>
		</div>
		<div class="adm-main-item" id="adm-main-popular-promo">
			<h3>Популярные промокоды</h3>

			<div class="adm-main-item-wrapper">
				<div class="adm-table">
					<div class="adm-table-item adm-table-item-title">
						<span>Позиция</span>
						<span>Название</span>
						<span>Количество активаций</span>
						<span>Создатель</span>
						<a href="#" style="background-color: transparent; color: transparent;" disabled>Управление</a>
					</div>
				</div>
			</div>
		</div>
		<div class="adm-main-item" id="adm-main-last-reg-acc">
			<h3>Последние зарегистрированные аккаунты</h3>

			<div class="adm-main-item-wrapper">
				<div class="adm-table">
					<div class="adm-table-item adm-table-item-title">
						<span>ID аккаунта</span>
						<span>Ник</span>
						<span>Дата регистрации</span>
						<a href="#" style="background-color: transparent; color: transparent;" disabled>Логи</a>
					</div>
				</div>
			</div>
		</div>`)

	data.lastLogs.forEach(item =>
	{
		$('.wrapper .adm-main-item#adm-main-last-logs .adm-main-item-wrapper').append(`
			<div class="adm-table">
				${item.userid > 0 ? `<a href="/admin/account?id=${item.userid}" class="adm-table-item">` : '<div class="adm-table-item">'}
					<span style="width: auto; margin-right: 15px;">${item.userid}:</span>
					<span>${item.text}</span>
					<span style="margin-left: 20px; color: silver; text-align: right;">${moment(new Date(item.time)).fromNow()}</span>
				${item.userid > 0 ? '</a>' : '</div>'}
			</div>`)
	})
	data.popularPromo.forEach((item, id) =>
	{
		$('.wrapper .adm-main-item#adm-main-popular-promo .adm-main-item-wrapper').append(`
			<div class="adm-table">
				<div class="adm-table-item">
					<span>${id + 1}</span>
					<span>${item.name}</span>
					<span>${item.actives}</span>
					<span>${item.creator}</span>
					<a href="/admin/promo?id=${parseInt(item.id)}">Управление</a>
				</div>
			</div>`)
	})

	data.lastRegAcc.forEach(item =>
	{
		$('.wrapper .adm-main-item#adm-main-last-reg-acc .adm-main-item-wrapper').append(`
			<div class="adm-table">
				<div class="adm-table-item">
					<span>${item.userid}</span>
					<span>${item.name}</span>
					<span>${moment(new Date(item.regDate)).fromNow()}</span>
					<a href="/find?type=account&search=${item.name}">Логи</a>
				</div>
			</div>`)
	})

	if(onlines != null)
	{
		new Chart(document.getElementById('dayOnlineChart').getContext('2d'), {
		    type: 'line',

		    data: {
		        labels: [ "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00" ],
		        datasets: [{
		            label: `${new Date().getFullYear()}.${new Date().getMonth()}.${new Date().getDate()}`,
		            backgroundColor: '#337fe2',
		            borderColor: '#337fe2',
		            data: data.onlinesDay
		        }],
		    },

		    options: {
				scales: {
					yAxes: [
					{
						ticks: {
							stepSize: 1,
						},
					},
			    ],
			  },
			},
		});
	}

	// new Chart(document.getElementById('monthOnlineChart').getContext('2d'), {
	//     type: 'line',

	//     data: {
	//         labels: [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31" ],
	//         datasets: [{
	//             label: `Максимальный онлайн: 20. Минимальный онлайн: 0.`,
	//             backgroundColor: '#337fe2',
	//             borderColor: '#337fe2',
	//             data: [ 512, 0 ]
	//         }],
	//     },

	//     options: {
	// 		scales: {
	// 			yAxes: [
	// 			{
	// 				ticks: {
	// 					stepSize: 1,
	// 				},
	// 			},
	// 	    ],
	// 	  },
	// 	},
	// });
}

// promo
const promo =
{
	open: (id) =>
	{
		const attrs = getHrefAttrs()
    	if(attrs.id === undefined
    		|| isNaN(attrs.id)
    		|| window.location.pathname !== '/admin/promo')return url.locate()

		loading.go()
		if(id == 'promo-menu-info')
		{
			$.post('/admin/promo', { id: attrs.id }, results =>
			{
				loading.stop()

				if(results === 'exit')return __removeAccCookies()
				if(results === 'notrights')
				{
					$('.menu-item[data-menu-item-id="admin"]').remove()
					return url.locate('/account')
				}
				if(results == 'notfound')
				{
					dialog.show('error', 'error', null, 'Промокод не найден!')
					return url.locate('/admin')
				}

				// loading.stop({ type: 'pers', parent: '.promo' })

				var slots = []

				slots.push({ type: results.promoSlot1.split(',')[0], value: results.promoSlot1.split(',')[1] })
				slots.push({ type: results.promoSlot2.split(',')[0], value: results.promoSlot2.split(',')[1] })
				slots.push({ type: results.promoSlot3.split(',')[0], value: results.promoSlot3.split(',')[1] })
				slots.push({ type: results.promoSlot4.split(',')[0], value: results.promoSlot4.split(',')[1] })

				$('.promo').html(`
					<h1 class="promo-title">Информация</h1>
					<div class="promo-wrapper">
					    <div class="promo-item"><span>Название</span>
					        <div><span style="color: #5b97f9;"># </span><span>${results.promoName}</span></div>
					    </div>
					    <div class="promo-item">
					    	<span>Создатель</span>
					    	<a class="href-color" href="/find?type=account&name=${results.promoCreator.name}">${results.promoCreator.name}</a>
					    </div>
					    <div class="promo-item">
					    	<span>Дата создания</span>
					    	<span>${new Date(results.promoDateCreator).toLocaleString()}</span>
					    </div>
					    <div class="promo-item">
					    	<span>Количество активаций</span>
					    	<span>${results.promoActives}</span>
					    </div>
					    <div class="promo-item">
					    	<span>Уровень для активации</span>
					    	<span>${results.promoLevel}</span>
					    </div>
					    <div class="promo-item">
					    	<span>Максимальное количество активаций</span>
					    	<span>${results.promoMaxActives}</span>
					    </div>
					    <div class="promo-item" style="align-items: flex-start; margin: 30px 0;">
					    	<span>Призы</span>
					        <div class="promo-item-slots"></div>
					    </div>
					    <div class="promo-item">
					    	<span>Дата последнего изменения</span>
					    	<span>${results.promoTimeUpdate == 0 ? "Не обновлялось" : new Date(parseInt(results.promoTimeUpdate)).toLocaleString() + ` (<a class="href-color" href="/find?type=account&search=${results.promoNameUpdate.name}">${results.promoNameUpdate.name}</a>)`}</span>
					    </div>
					</div>`)

				slots.forEach((item, i) =>
				{
					$('.promo .promo-item-slots').append(`
						 <div class="promo-item-slot">${item.type == 1 ? item.value.toLocaleString() + " $" : item.type == 2 ? `Аксессуар (ID: ${item.value})` : "Ничего"}</div>`)
				})
			})
		}
		else if(id == 'promo-menu-settings')
		{
			$.post('/admin/promo', { id: attrs.id }, results =>
			{
				loading.stop()

				if(results === 'exit')return __removeAccCookies()
				if(results === 'notrights')
				{
					$('.menu-item[data-menu-item-id="admin"]').remove()
					return url.locate('/account')
				}
				if(results == 'notfound')
				{
					dialog.show('error', 'error', null, 'Промокод не найден!')
					return url.locate('/admin')
				}

				// loading.stop({ type: 'pers', parent: '.promo' })

				var slots = []

				slots.push({ type: results.promoSlot1.split(',')[0], value: results.promoSlot1.split(',')[1] })
				slots.push({ type: results.promoSlot2.split(',')[0], value: results.promoSlot2.split(',')[1] })
				slots.push({ type: results.promoSlot3.split(',')[0], value: results.promoSlot3.split(',')[1] })
				slots.push({ type: results.promoSlot4.split(',')[0], value: results.promoSlot4.split(',')[1] })

				$('.promo').html(`
					<h1 class="promo-title">Настройки</h1>

					<div class="promo-wrapper">
						<div class="promo-item"><span>Название</span>
						    <div class="promo-item-names">
						    	<label for="promo-names">#</label>
						    	<input id="promo-names" value="${results.promoName}" type="text" />
						    </div>
						</div>
						<div class="promo-item"><span>Уровень для активации</span>
						    <div class="promo-item-number">
						    	<input id="promo-level" type="text" value="${results.promoLevel}" size="1" />
						    	<input class="input-range" id="promo-level-range" type="range" max="100" min="1" value="${results.promoLevel}" />
						    </div>
						</div>
						<div class="promo-item"><span>Максимальное число активаций</span>
						    <div class="promo-item-number">
						    	<input id="promo-max-actives" type="text" value="${results.promoMaxActives}" size="1" />
						    	<input class="input-range" id="promo-max-actives-range" type="range" max="100000" min="0" value="${results.promoMaxActives}" />
						    </div>
						</div>
						<div class="promo-item" style="align-items: flex-start; margin-top: 30px;">
							<span>Призы</span>
						    <div class="promo-item-slots" id="promo-item-slots-data">
						</div>
						</div>

						<div class="promo-item" style="justify-content: flex-end; margin-top: 60px;">
							<button id="promo-save">Сохранить</button>
						</div>
					</div>`)

				slots.forEach((item, i) =>
				{
					$('.promo .promo-item-slots').append(`
						 <div class="promo-item-slot">
				            <div class="promo-item-names-${i}" ${item.type == 1 ? "" : "style='display: none;'"}>
				            	<label for="promo-item-select-money-${i}">$</label>
				            	<input id="promo-item-select-money-${i}" type="text" value="${item.value}" size="4" />
				            </div>

				            <div class="promo-item-names-${i}" ${item.type == 2 ? "" : "style='display: none;'"}>
				            	<label for="promo-item-select-acs-${i}">ID:</label>
				            	<input id="promo-item-select-acs-${i}" type="text" value="${item.value}" size="4" />
				            </div>

				            <div id="promo-item-select-${i}"></div>
				        </div>`)

					select.add(`#promo-item-select-${i}`, [ 'Ничего', 'Деньги', 'Аксессуар' ], { defaultName: item.type == 1 ? 'Деньги' : item.type == 2 ? "Аксессуар" : "Ничего", elements: { onclick: [ `$('input#promo-item-select-money-${i}').parent().hide(); $('input#promo-item-select-acs-${i}').parent().hide()`, `$('input#promo-item-select-money-${i}').parent().show(); $('input#promo-item-select-acs-${i}').parent().hide()`, `$('input#promo-item-select-money-${i}').parent().hide(); $('input#promo-item-select-acs-${i}').parent().show()` ] } })
				})
			})
		}
		else if(id == 'promo-menu-actives')
		{
			$.post('/admin/promo-actives', { id: attrs.id }, results =>
			{
				loading.stop()

				if(results === 'exit')return __removeAccCookies()
				if(results === 'notrights')
				{
					$('.menu-item[data-menu-item-id="admin"]').remove()
					return url.locate('/account')
				}
				if(results == 'notfound')
				{
					dialog.show('error', 'error', null, 'Промокод не найден!')
					return url.locate('/admin')
				}

				// loading.stop({ type: 'pers', parent: '.promo' })

				$('.promo').html(`
					<h1 class="promo-title" style="margin-bottom: 20px;">Список активаций</h1>

					<div class="promo-wrapper">
						<div class="promo-item">
						    <div class="promo-search">
						    	<input id="promo-search" type="text" placeholder="Введите ник..." maxlength="24" />
						    	<button id="promo-search-button">Поиск</button>
						    </div>
						</div>
						<div class="promo-item" style="margin-top: 40px;">
						    <div class="find-body-list">
						    	${results === 'not' ? "<div class='find-body-list-error'>Ничего не найден</div>" : ""}
						    </div>
						</div>
					</div>`)

				if(results !== 'not')
				{
					results.forEach(item =>
					{
						$('.promo .find-body-list').append(`
							<a href="/find?type=account&search=${item.pName}" class="item-list">
								<div class="info">
									<div class="bg-list">
										<img src="/styles/images/skins/${item.pSkin}.png" alt="Скин #${item.pSkin}">
									</div>
									<div class="info-list">
										<h3>${item.pName}</h3>
										<div class="info-list-wrap">
											<span style="text-align: left;">Уровень: ${item.pLevel}</span>
											<span style="text-align: left;">Дата регистрации: ${new Date(item.pRegDate).toLocaleString()}</span>
											<span style="text-align: left;">RegIP: ${item.pRegIP}</span>
											<span style="text-align: left;">LastIP: ${item.pIP}</span>
										</div>
									</div>
								</div>
								<div class="info-open">
									<span></span>
								</div>
							</a>`)
					})
				}
			})
		}
		else if(id == 'promo-menu-remove')
		{
			$.post('/admin/promo-remove', { id: attrs.id }, results =>
			{
				loading.stop()

				if(results === 'exit')return __removeAccCookies()
				if(results === 'notrights')
				{
					$('.menu-item[data-menu-item-id="admin"]').remove()
					return url.locate('/account')
				}
				if(results == 'notfound')
				{
					dialog.show('error', 'error', null, 'Промокод не найден!')
					return url.locate('/admin')
				}

				// loading.stop({ type: 'pers', parent: '.promo' })
				$('.promo').html(`
					<h1 class="promo-title">Удалить?</h1>

					<div class="promo-wrapper">
						<div class="promo-item"><span>Вы действительно хотите удалить промокод <span style="color: #5b97f9; font-weight: bold;">#${results}</span> ?</span></div>
						<div class="promo-item" style="justify-content: flex-end; margin-top: 20px;"><button id="promo-remove">Да, удалить</button></div>
					</div>`)
			})
		}
	}
}

export function renderAdminPromoPage(data)
{
	if(data
		&& data.create)
	{
		$('.wrapper').html(`
			${renderAdminPageNav('', 'promo')}

			<div class="promo-wrap" style="justify-content: center;">
			    <div class="promo">
			        <h1 class="promo-title">Создание нового промокода</h1>

					<div class="promo-wrapper">
						<div class="promo-item"><span>Название</span>
						    <div class="promo-item-names">
						    	<label for="promo-names">#</label>
						    	<input id="promo-names" placeholder="Введите название" type="text" />
						    </div>
						</div>
						<div class="promo-item"><span>Уровень для активации</span>
						    <div class="promo-item-number">
						    	<input id="promo-level" type="text" value="1" size="1" />
						    	<input class="input-range" id="promo-level-range" type="range" max="100" min="1" value="1" />
						    </div>
						</div>
						<div class="promo-item"><span>Максимальное число активаций</span>
						    <div class="promo-item-number">
						    	<input id="promo-max-actives" type="text" value="0" size="1" />
						    	<input class="input-range" id="promo-max-actives-range" type="range" max="100000" min="0" value="0" />
						    </div>
						</div>
						<div class="promo-item" style="align-items: flex-start; margin-top: 30px;">
							<span>Призы</span>
						    <div class="promo-item-slots" id="promo-item-slots-data"></div>
						</div>

						<div class="promo-item" style="justify-content: flex-end; margin-top: 60px;">
							<button id="promo-create">Создать</button>
						</div>
					</div>
				</div>
			</div>`)

		for(var i = 0; i < 4; i ++)
		{
			$('.promo .promo-item-slots').append(`
				 <div class="promo-item-slot">
		            <div class="promo-item-names-${i}" style='display: none'>
		            	<label for="promo-item-select-money-${i}">$</label>
		            	<input id="promo-item-select-money-${i}" type="text" value="0" size="4" />
		            </div>

		            <div class="promo-item-names-${i}" style='display: none'>
		            	<label for="promo-item-select-acs-${i}">ID:</label>
		            	<input id="promo-item-select-acs-${i}" type="text" value="0" size="4" />
		            </div>

		            <div id="promo-item-select-${i}"></div>
		        </div>`)

			select.add(`#promo-item-select-${i}`, [ 'Ничего', 'Деньги', 'Аксессуар' ], { defaultName: "Ничего", elements: { onclick: [ `$('input#promo-item-select-money-${i}').parent().hide(); $('input#promo-item-select-acs-${i}').parent().hide()`, `$('input#promo-item-select-money-${i}').parent().show(); $('input#promo-item-select-acs-${i}').parent().hide()`, `$('input#promo-item-select-money-${i}').parent().hide(); $('input#promo-item-select-acs-${i}').parent().show()` ] } })
		}

		return true
	}

	$('.wrapper').html(`
		<div class="promo-wrap">
		    <div class="promo-menu">
		        <h3>Меню</h3>
		        <ul>
		        	<li id="promo-menu-info"><img src="/styles/images/admin/promo/info.png" /><span>Информация</span></li>
		            <li id="promo-menu-settings"><img src="/styles/images/admin/promo/settings.png" /><span>Настройки</span></li>
		            <li id="promo-menu-actives"><img src="/styles/images/admin/promo/accounts.png" /><span>Список активаций</span></li>
		            <li id="promo-menu-remove" style="background-color: #e35454; color: white;"><img src="/styles/images/admin/promo/delete.png" /><span>Удалить промокод</span></li>
		        </ul>
		    </div>
		    <div class="promo">
		        <h1 class="promo-title"></h1>
		        <div class="promo-wrapper"></div>
		    </div>
		</div>`)

	promo.open('promo-menu-info')
}

// realty
const realty =
{
	load: (results) =>
	{
		const attrs = getHrefAttrs()
    	if(attrs.id == undefined
    		|| isNaN(attrs.id)
    		|| window.location.pathname != '/admin/realty'
    		|| (attrs.type != 'house'
    			&& attrs.type != 'biz'
    			&& attrs.type != 'veh'))return url.locate('/admin')

    	$('.wrapper').html(`
    		${renderAdminPageNav('', 'realty')}
    		<div class="realty-wrapper">
			    <div class="realty-title">
			        <h1>Недвижимость</h1>
			        <span></span>
			    </div>
			    <div class="realty">
			        <div class="realty-nav"></div>
			    </div>
			</div>`)

    	if(attrs.type == 'house')
    	{
    		var
    			houseData = results.house,
    			rents = results.rents

    		$('.realty-wrapper .realty-title span').html(`Дом #${houseData.houseID}`)
    		$('.realty .realty-nav').html(`
    			<div class="realty-nav-item" data-realty-id="info">Информация</div>
	            <div class="realty-nav-item" data-realty-id="house-rents">Арендаторы</div>
	            <div class="realty-nav-item" data-realty-id="improvements">Улучшения</div>`)

    		var houseGarage = 'Неимеется'
    		if(houseData.houseGarage.split(', ')[0] != 0) houseGarage = houseData.houseGarage

    		houseData.houseImprovement = houseData.houseImprovement.split(', ')
    		$('.realty').append(`
    			<div class="realty-box" data-realty-id="info" style="display: none;">
				    <div class="realty-box-item">
				    	<span>Владелец</span>
				    	<span>${!houseData.houseOwner ? "Неимеется" : `<a href="/find?type=account&search=${results.bOwnerName}"  class="href-color">${houseData.houseOwnerName}</a>`}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Цена</span>
				    	<span>${houseData.housePrice.toLocaleString()} $</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Тип</span>
				    	<span>${realtyTypeNames.house[houseData.houseType]}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Двери</span>
				    	<span>${!houseData.houseLocked ? "Закрыты" : "Открыты"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Налог</span>
				    	<span>${houseData.houseNalog.toLocaleString()} $</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Ремонт</span>
				    	<span>${houseData.houseIntRepair == 0 ? "Не идет" : houseData.houseIntRepair / 60 + " минут"}</span>
					</div>
				    <div class="realty-box-item">
				    	<span>Координаты входа</span>
				    	<span>${houseData.housePos.split(',')[0]}, ${houseData.housePos.split(',')[1]}, ${houseData.housePos.split(',')[2]}, ${houseData.housePos.split(',')[3]}, ${houseData.housePos.split(',')[4]}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Координаты выхода</span>
				    	<span>${houseData.houseIntPos.split(',')[0]}, ${houseData.houseIntPos.split(',')[1]}, ${houseData.houseIntPos.split(',')[2]}, ${houseData.houseIntPos.split(',')[3]}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Гараж</span>
				    	<span>${houseGarage}</span>
				    </div>
				</div>`)
    		$('.realty').append(`
    			<div class="realty-box" data-realty-id="improvements" style="display: none;">
				    <div class="realty-box-item">
				    	<span>Снижение налогов</span>
				    	<span ${houseData.houseImprovement[0] == 0 ? "" : "style='color: #5dc972'"}>${houseData.houseImprovement[0] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Гаражный налог</span>
				    	<span ${houseData.houseImprovement[1] == 0 ? "" : "style='color: #5dc972'"}>${houseData.houseImprovement[1] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Охранная система</span>
				    	<span ${houseData.houseImprovement[2] == 0 ? "" : "style='color: #5dc972'"}>${houseData.houseImprovement[2] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				</div>`)

    		$('.realty').append(`
    			<div class="realty-box" data-realty-id="house-rents" style="display: none;">
    				${!rents.length ? "<h2 class='realty-error'>Не найдено</h2>" : "<div class='search-list-items' style='box-shadow: none;'></div>"}
    			</div>`)
    		if(rents.length)
    		{
    			rents.forEach(item =>
    			{
    				$('.realty .realty-box[data-realty-id="house-rents"] .search-list-items').append(`
    					<div class="search-list-item">
			                <div class="search-list-item-img" style="width: 100px; height: 100px;"><img src="/styles/images/skins/${item.pSkin}.png" alt="Скин: ${item.pSkin}" style="width: 100px;" /></div>
			                <div class="search-list-item-info">
			                    <h3>${item.pName}</h3>
			                    <div>Уровень: ${item.pLevel}<br>Дата регистрации: ${new Date(item.pRegDate).toLocaleString()}<br>RegIP: ${item.pRegIP}<br>LastIP: ${item.pIP}</div>
			                </div>
			                <div class="search-list-item-btn">
			                	<a href="/find?type=account&search=${item.pName}">Логи</a>
			                </div>
			            </div>`)
    			})
    		}
    	}
    	else if(attrs.type == 'biz')
    	{
    		$('.realty-wrapper .realty-title span').html(`${realtyTypeNames.biz[results.bType]} #${results.bID}`)
    		$('.realty .realty-nav').html(`
    			<div class="realty-nav-item" data-realty-id="info">Информация</div>
	            <div class="realty-nav-item" data-realty-id="biz-prices">Ценники</div>
	            <div class="realty-nav-item" data-realty-id="improvements">Улучшения</div>`)

    		var bEnterPos = 'Нет интерьера'
    		if(results.bEnterPos.split(',')[0] != 0.0
    			&& results.bEnterPos.split(',')[1] != 0.0
    			&& results.bEnterPos.split(',')[2] != 0.0) bEnterPos = results.bEnterPos

    		var bFillPos = 'Нет заправки'
    		if(results.bFillPos.split(',')[0] != 0.0
    			&& results.bFillPos.split(',')[1] != 0.0
    			&& results.bFillPos.split(',')[2] != 0.0) bFillPos = results.bFillPos

    		results.bImprovement = results.bImprovement.split(',')

    		$('.realty').append(`
    			<div class="realty-box" data-realty-id="info" style="display: none;">
    				<div class="realty-box-item">
				    	<span>Название</span>
				    	<span>${results.bName}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Владелец</span>
				    	<span>${results.bOwner == -1 ? "Неимеется" : `<a href="/find?type=account&search=${results.bOwnerName}" class="href-color">${results.bOwnerName}</a>`}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Цена</span>
				    	<span>${results.bPrice.toLocaleString()} $</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Двери</span>
				    	<span>${results.bLocked ? "Закрыты" : "Открыты"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Статус покупки</span>
				    	<span ${results.bBuyLocked ? "style='color: #f37a7a;'" : ""}>${results.bBuyLocked ? "Нельзя приобрести" : "Можно приобрести"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Налог</span>
				    	<span>${results.bNalog.toLocaleString()} $</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Касса</span>
				    	<span>${results.bCash.toLocaleString()} $</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Продуктов</span>
				    	<span>${results.bProds}</span>
					</div>
					<div class="realty-box-item">
				    	<span>Крыша</span>
				    	<span>${results.bMafia == -1 ? "Неимеется" : `<a class='href-color' href="/find?type=fraction&search=${results.bMafiaName}">${results.bMafiaName}</a>`}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Координаты входа</span>
				    	<span>${results.bPos}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Координаты выхода</span>
				    	<span>${bEnterPos}</span>
				    </div>
				    ${results.bType >= 8 && results.bType <= 10 ? `<div class="realty-box-item">
					    	<span>Координаты заправки</span>
					    	<span>${bFillPos}</span>
					    </div>` : ""}
				</div>`)

    		$('.realty').append(`
    			<div class="realty-box" data-realty-id="improvements" style="display: none;">
				    <div class="realty-box-item">
				    	<span>Большой склад</span>
				    	<span ${results.bImprovement[0] == 0 ? "" : "style='color: #5dc972'"}>${results.bImprovement[0] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Снижение налогов</span>
				    	<span ${results.bImprovement[1] == 0 ? "" : "style='color: #5dc972'"}>${results.bImprovement[1] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Профессиональный ассистент</span>
				    	<span ${results.bImprovement[2] == 0 ? "" : "style='color: #5dc972'"}>${results.bImprovement[2] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Музыкальное оборудование</span>
				    	<span ${results.bImprovement[3] == 0 ? "" : "style='color: #5dc972'"}>${results.bImprovement[3] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Реклама в GPS</span>
				    	<span ${results.bImprovement[4] == 0 ? "" : "style='color: #5dc972'"}>${results.bImprovement[4] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Охранная система</span>
				    	<span ${results.bImprovement[5] == 0 ? "" : "style='color: #5dc972'"}>${results.bImprovement[5] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Антипарк</span>
				    	<span ${results.bImprovement[6] == 0 ? "" : "style='color: #5dc972'"}>${results.bImprovement[6] == 0 ? "Не куплено" : "Куплено"}</span>
				    </div>
				</div>`)

    		$('.realty').append(`
    			<div class="realty-box" data-realty-id="biz-prices" style="display: none;">
    				<h2 class='realty-error'>Пока ничего</h2>
    			</div>`)
    	}
    	else if(attrs.type == 'veh')
    	{
    		$('.realty-wrapper .realty-title span').html(`Транспорт #${results.vehID}`)
    		$('.realty .realty-nav').html(`<div class="realty-nav-item" data-realty-id="info">Информация</div>`)

    		var vehTypeID = "Неизвестно"
    		if(results.vehType == 1) vehTypeID = `<a href="/find?type=account&search=${results.vehTypeIDName}" class="href-color">${results.vehTypeIDName}</a>`
			else if(results.vehType == 2) vehTypeID = `Фракция #${results.vehTypeID}`
			else if(results.vehType == 3) vehTypeID = 'Неимеется'
			else if(results.vehType >= 4 && results.vehType <= 6) vehTypeID = `<a href="/admin/realty?id=${results.vehTypeID}&type=biz" class="href-color">Бизнес #${results.vehTypeID}</a>`

    		$('.realty').append(`
    			<div class="realty-box" data-realty-id="info" style="display: none;">
    				<div class="realty-box-item">
				    	<span>Тип</span>
				    	<span>${realtyTypeNames.veh[results.vehType]}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Принадлежит</span>
				    	<span>${vehTypeID}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Цена (Стоимость аренды)</span>
				    	<span>${results.vehPrice.toLocaleString()} $</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Двери</span>
				    	<span>${results.vehLocked ? "Закрыты" : "Открыты"}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Налог</span>
				    	<span>${results.vehNalog.toLocaleString()} $</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Бензин</span>
				    	<span>${results.vehFuel} литров</span>
					</div>
					<div class="realty-box-item">
				    	<span>Цвет</span>
				    	<span>${results.vehColor.split(',')[0]}, ${results.vehColor.split(',')[1]}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>Координаты парковки</span>
				    	<span>${results.vehPos}</span>
				    </div>
				    <div class="realty-box-item">
				    	<span>В гараже?</span>
				    	<span>${results.vehGarage == -1 ? "Нет" : `Да (<a href="/realty?type=house&id=${results.vehGarage}" class="href-color">Дом #${results.vehGarage}</a>)`}</span>
				    </div>
				</div>`)
    	}

    	realty.open('info')
	},
	open: (id) =>
	{
		$('.realty .realty-box').hide()
		$(`.realty .realty-box[data-realty-id='${id}']`).show()

		$('.realty .realty-nav .realty-nav-item').removeClass('realty-nav-item-select')
		$(`.realty .realty-nav .realty-nav-item[data-realty-id='${id}']`).addClass('realty-nav-item-select')
	}
}

export function renderAdminRealtyPage(data)
{
	realty.load(data)
}


// account
export function renderAdminAccountPage(data)
{
	var spawnNames = "Неизвество"

	if(!data.pSetSpawn) spawnNames = "Стандартный"
	else if(data.pSetSpawn == 1) spawnNames = "Фракция"
	else if(data.pSetSpawn == 2) spawnNames = "Бизнес"
	else if(data.pSetSpawn == 3) spawnNames = "Дом"

	if(data.pSetSpawnAdm) spawnNames = "Личный"

	var weddingName = "Неимеется"
	if(data.pWedding != -1) weddingName = `Имеется (с ${data.pWeddingName.replace("_", " ")})`

	data.pSkills = data.pSkills.split(',')

	// <div style="border-color: red; box-shadow: 0 0 15px 5px rgba(255, 0, 0, 0.5);"><span>Заблокирован</span></div>
	// <a class="account-main-grettings-item" href="/accounts?id=16"><div class="account-main-grettings-item-img"><img src="/styles/images/skins/120.png" alt="Скин 120 ID" /></div><span>MyAngelNezuko</span></a>

	$('.wrapper').append(`
		<div class="account-main">
			<div class="account-main-info">
				<div class="account-info-skin">
					<span class="account-info-skin-nam">${data.pName.replace("_", " ")}</span>

					<div class="account-info-skin-img">
						<img src="/styles/images/skins/${data.pSkin}.png" alt="Скин ${data.pSkin} ID">
					</div>

					<div class="account-info-skin-img-bars">
						<div class="account-info-skin-img-bar">
							<div class="account-info-skin-img-bar-text">
								<h3>Здоровье</h3>
								<span>${data.pHealth.toFixed(1)}%</span>
							</div>

							<div class="account-info-skin-img-bar-line">
								<i style="width: ${data.pHealth.toFixed(1)}%"></i>
							</div>
						</div>

						<div class="account-info-skin-img-bar">
							<div class="account-info-skin-img-bar-text">
								<h3>Сытость</h3>
								<span>${data.pSatiety.toFixed(1)}%</span>
							</div>

							<div class="account-info-skin-img-bar-line" style="box-shadow: inset 0 0 0 2px #e3e300;">
								<i style="width: ${data.pSatiety.toFixed(1)}%; background-color: #e3e300;"></i>
							</div>
						</div>

						<div class="account-info-skin-img-bar">
							<div class="account-info-skin-img-bar-text">
								<h3>Жажда</h3>
								<span>${data.pThirst.toFixed(1)}%</span>
							</div>

							<div class="account-info-skin-img-bar-line" style="box-shadow: inset 0 0 0 2px #00ffff;">
								<i style="width: ${data.pThirst.toFixed(1)}%; background-color: #00ffff;"></i>
							</div>
						</div>
					</div>
					${data.pID !== loginData.id ? `
						<div style="margin: 0 auto; margin-top: 30px;">
							<button class="button" id="acc-send-message">Написать сообщение</button>
						</div>` : ""}
				</div>

				<div class="account-info">
					<div class="account-info-box">
						<h1 class="account-info-box-title">ID аккаунта</h1>
						<span class="account-info-box-desc">${data.pID}</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Почта</h1>
						<span class="account-info-box-desc">${find == true ? "***" : data.pEmail}</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Игровой уровень</h1>
						<span class="account-info-box-desc">${data.pLevel}</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Опыта</h1>
						<span class="account-info-box-desc">${data.pExp} / ${(data.pLevel + 1) * 4}</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Наличные</h1>
						<span class="account-info-box-desc">${data.pCash.toLocaleString()} $</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Банковская карта</h1>
						<span class="account-info-box-desc">${data.pBankCash.toLocaleString()} $</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Депозитный счет</h1>
						<span class="account-info-box-desc">${data.pDeposit.toLocaleString()} $</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Донат счет</h1>
						<span class="account-info-box-desc">${find == true ? "***" : data.pDonate.toLocaleString()} RUB</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Фракция</h1>
						<span class="account-info-box-desc">${data.fractionName}</span>
					</div>

					<div class="account-info-box">
						<h1 class="account-info-box-title">Должность</h1>
						<span class="account-info-box-desc">${data.fractionRank} (${data.pRank})</span>
					</div>
				</div>
			</div>
		</div>

		<div class="account-main">
			<div class="account-main-acs">
				<h1>Аксессуары</h1>

				<div class="account-main-acs-wrap"></div>
			</div>

			<div class="account-main-other">
				<h1>Прочее</h1>

				<div class="account-main-other-item">
					<span>Дата регистрации</span>
					<span>${find == true ? "***" : new Date(data.pRegDate).toLocaleString()}</span>
				</div>
				<div class="account-main-other-item">
					<span>Регистрационный IP</span>
					<span>${find == true ? "***.***.***.***" : data.pRegIP}</span>
				</div>
				<div class="account-main-other-item">
					<span>Последний IP</span>
					<span>${find == true ? "***.***.***.***" : data.pIP}</span>
				</div>
				<div class="account-main-other-item">
					<span>Пол</span>
					<span>${!data.pSex ? "Мужской" : "Женский"}</span>
				</div>
				<div class="account-main-other-item">
					<span>Предупреждений</span>
					<span>${data.pWarn}</span>
				</div>
				<div class="account-main-other-item">
					<span>Точка спавна</span>
					<span>${spawnNames}</span>
				</div>
				<div class="account-main-other-item">
					<span>Брак</span>
					<span>${weddingName}</span>
				</div>
				<div class="account-main-other-item">
					<span>Последний вход</span>
					${data.pOnline != -1 ? "<span style='color: green'>Онлайн</span>" : `<span>${find == true ? "***" : new Date(data.pLastEnter).toLocaleString()}</span>`}
				</div>
				<div class="account-main-other-item">
					<span>Промокод</span>
					${data.pPromoName == '-' ? "<span>Неимеется</span>" : `<span>${data.pPromoName.name}</span>`}
				</div>
			</div>
		</div>

		<div class="account-main">
		    <div class="account-main-skills">
		        <h1>Навыки владения оружием</h1>

		        <div class="account-main-skills-item" data-skills-weapon-id="0"><img src="/styles/images/weapons/24.png" alt="Оружие Desert Eagle" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[2] == 999 ? "100" : parseInt(data.pSkills[2] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[2] == 999 ? "100" : parseInt(data.pSkills[2] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="1"><img src="/styles/images/weapons/25.png" alt="Оружие Shotgun" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[3] == 999 ? "100" : parseInt(data.pSkills[3] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[3] == 999 ? "100" : parseInt(data.pSkills[3] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="2"><img src="/styles/images/weapons/26.png" alt="Оружие Sawnoff Shotgun" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[4] == 999 ? "100" : parseInt(data.pSkills[4] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[4] == 999 ? "100" : parseInt(data.pSkills[4] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="3"><img src="/styles/images/weapons/27.png" alt="Оружие Spas12 Shotgun" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[5] == 999 ? "100" : parseInt(data.pSkills[5] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[5] == 999 ? "100" : parseInt(data.pSkills[5] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="4"><img src="/styles/images/weapons/28.png" alt="Оружие Micro UZI" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[7] == 999 ? "100" : parseInt(data.pSkills[6] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[7] == 999 ? "100" : parseInt(data.pSkills[6] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="5"><img src="/styles/images/weapons/29.png" alt="Оружие MP5" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[8] == 999 ? "100" : parseInt(data.pSkills[7] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[8] == 999 ? "100" : parseInt(data.pSkills[7] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="6"><img src="/styles/images/weapons/30.png" alt="Оружие AK47" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[9] == 999 ? "100" : parseInt(data.pSkills[8] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[9] == 999 ? "100" : parseInt(data.pSkills[8] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="7"><img src="/styles/images/weapons/31.png" alt="Оружие M4" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[0] == 999 ? "100" : parseInt(data.pSkills[9] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[0] == 999 ? "100" : parseInt(data.pSkills[9] / 10)}%</span>
		        </div>
		        <div class="account-main-skills-item" data-skills-weapon-id="8"><img src="/styles/images/weapons/33.png" alt="Оружие SniperRifle" />
		            <div class="account-main-skills-item-line"><i style="width: ${data.pSkills[2] == 999 ? "100" : parseInt(data.pSkills[10] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.pSkills[2] == 999 ? "100" : parseInt(data.pSkills[10] / 10)}%</span>
		        </div>
		    </div>

		    <div class="account-main-grettings">
		        <h1>Знакомства</h1>
		        <div class="account-main-grettings-wrap"></div>
		    </div>
		</div>`)

	$('.wrapper').append(`
		<div class="account-main">
		    <h1>Управление акаунтом</h1>

		    <div class="account-main-settings">
		    	<button class="adm-account-give" data-adm-account-give-id="mute">Выдать мут</button>
		    	<button class="adm-account-give" data-adm-account-give-id="warn">Выдать предупреждение</button>
		    	<button class="adm-account-give" data-adm-account-give-id="jail">Посадить в тюрьму</button>
		    	<button class="adm-account-give" data-adm-account-give-id="ban">Заблокировать</button>
		    </div>
		</div>`)

	$('.wrapper').unbind().on('click', '.adm-account-give', elem =>
	{
		const id = $(elem.currentTarget).attr('data-adm-account-give-id')
		switch(id)
		{
			case 'mute':
			{
				dialog.show('', '2input', 'adm-account-cmd-mute', '<div style="color: grey;">* Время мута должно быть 1 - 600 минут<br>* Длина причины должна быть 1 - 30 символов</div>', 'Отмена', 'Выдать', false, null, { inputplace: [ 'Введите время мута', 'Введите причину мута' ] })
				$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
				{
					if(data.dialogid !== 'adm-account-cmd-mute')return false

					const
						time = parseInt(data.inputs[0]),
						reason = data.inputs[1],
						id = getHrefAttrs().id

					if(isNaN(time)
						|| time < 1 ||  time > 600)return false
					if(reason.length < 1 || reason.length > 30)return false

					dialog.close()
					acp.open(`player.mute(${id}, ${time}, ${reason})`)
				})
				break
			}
			case 'warn':
			{
				dialog.show('', 'input', 'adm-account-cmd-warn', '<div style="color: grey;">* Длина причины должна быть 1 - 30 символов</div>', 'Отмена', 'Выдать', false, null, { inputplace: [ 'Введите причину мута' ] })
				$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
				{
					if(data.dialogid !== 'adm-account-cmd-warn')return false

					const
						reason = data.inputs[0],
						id = getHrefAttrs().id

					if(reason.length < 1 || reason.length > 30)return false

					dialog.close()
					acp.open(`player.warn(${id}, ${reason})`)
				})
				break
			}
			case 'jail':
			{
				dialog.show('', '2input', 'adm-account-cmd-jail', '<div style="color: grey;">* Время джайла должно быть 1 - 600 минут<br>* Длина причины должна быть 1 - 30 символов</div>', 'Отмена', 'Выдать', false, null, { inputplace: [ 'Введите время джайла', 'Введите причину джайла' ] })
				$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
				{
					if(data.dialogid !== 'adm-account-cmd-jail')return false

					const
						time = parseInt(data.inputs[0]),
						reason = data.inputs[1],
						id = getHrefAttrs().id

					if(isNaN(time)
						|| time < 1 ||  time > 600)return false
					if(reason.length < 1 || reason.length > 30)return false

					dialog.close()
					acp.open(`player.jail(${id}, ${time}, ${reason})`)
				})
				break
			}
			case 'ban':
			{
				dialog.show('', '2input', 'adm-account-cmd-ban', '<div style="color: grey;">* Время бана должно быть 1 - 90 дней<br>* Длина причины должна быть 1 - 30 символов</div>', 'Отмена', 'Выдать', false, null, { inputplace: [ 'Введите время бана', 'Введите причину бана' ] })
				$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
				{
					if(data.dialogid !== 'adm-account-cmd-ban')return false

					const
						time = parseInt(data.inputs[0]),
						reason = data.inputs[1],
						id = getHrefAttrs().id

					if(isNaN(time)
						|| time < 1 ||  time > 600)return false
					if(reason.length < 1 || reason.length > 30)return false

					dialog.close()
					acp.open(`player.ban(${id}, ${time}, ${reason})`)
				})
				break
			}
		}
	})

	if(!data.pGreetings.length)
	{
		$('.account-main .account-main-grettings .account-main-grettings-wrap').html('<div class="account-main-grettings-error">Знакомств не найдено!</div>')
	}
	else
	{
		data.pGreetings.forEach(item =>
		{
			$('.account-main .account-main-grettings .account-main-grettings-wrap').append(`
				<a class="account-main-grettings-item" href="/find?type=account&search=${item.pName}">
					<div class="account-main-grettings-item-img" ${item.pOnline == -1 ? "" : 'style="border-color: green; box-shadow: 0 0 15px 5px rgba(0, 126, 0, 0.5);"'}>
						<img src="/styles/images/skins/${item.pSkin}.png" alt="Скин">
					</div>
					<span>${item.pName}</span>
				</a>`)
		})
	}

	if(data.pAdmin <= loginData.admin
		&& (data.settings.admStats <= loginData.admin || data.pID === loginData.id))
	{
		let level = (126 / 100) * (100 / (6 / data.pAdmin))

		$('.wrapper').prepend(`
			<div class="account-main">
				<div class="account-admin">
					<div class="account-admin-level">
						<h3>Уровень админки</h3>
						<div>
							<svg id="spinner" viewBox="0 0 50 50">
							    <circle id="path" cx="25" cy="25" r="20" fill="none" stroke-width="6" style="stroke-dashoffset: ${-126 + level}"></circle>
							</svg>
							<span>${data.pAdmin}</span>
						</div>
					</div>
					<div class="account-admin-infos">
						<div class="account-admin-info">
							<div>
								<span>Дата выдачи админки:</span>
								<span>${new Date(data.adminData.aInviteDate).toLocaleString()}</span>
							</div>
							<div>
								<span>Кто выдал:</span>
								<span><a class="href-color" href="/find?type=account&search=${data.adminData.aInviteUser}">${data.adminData.aInviteUser}</a></span>
							</div>
							${data.adminData.aEditUser !== 'None' ? `
								<div>
									<span>Дата изменения админки:</span>
									<span>${new Date(data.adminData.aEditDate).toLocaleString()}</span>
								</div>
								<div>
									<span>Кто изменил:</span>
									<span><a class="href-color" href="/find?type=account&search=${data.adminData.aEditUser}">${data.adminData.aEditUser}</a></span>
								</div>` : ""}
						</div>
						<div class="account-admin-info">
							<div>
								<span>Баны:</span>
								<span>${data.adminData.aBans}</span>
							</div>
							<div>
								<span>Варны:</span>
								<span>${data.adminData.aWarns}</span>
							</div>
							<div>
								<span>Муты:</span>
								<span>${data.adminData.aMutes}</span>
							</div>
							<div>
								<span>Деморганы:</span>
								<span>${data.adminData.aJails}</span>
							</div>
						</div>
					</div>
				</div>
			</div>`)
	}
	if(data.banData)
	{
		$('.wrapper').prepend(`
			<div class="account-main" style="width: 450px; max-width: 95%; background-color: rgb(252, 126, 126, .5);">
				<div class="account-ban">
					<h1>Аккаунт заблокирован</h1>
					<div class="account-ban-info">
						<div>
							<span>Заблокировал:</span>
							<span><a class="href-color" href="/find?type=account&find=${data.banData.banAdminName}">${data.banData.banAdminName}</a></span>
						</div>
						<div>
							<span>Причина:</span>
							<span>${data.banData.banReason}</span>
						</div>
						<div>
							<span>Дата блокировки:</span>
							<span>${new Date(data.banData.banDate).toLocaleString()}</span>
						</div>
						<div>
							<span>Дата разблокировки:</span>
							<span>${new Date(data.banData.banTime * 1000).toLocaleString()}</span>
						</div>
					</div>
					<div class="account-ban-text">Если Вы не согласны с решением администратора, Вы можете подать на него <a href="/report/create">жалобу</a>.<br></div>
				</div>
			</div>`)
	}

	data.pAcs = data.pAcs.split(",")
	for(var i = 0, acsID = -1; i < 6; i ++)
	{
		acsID = -1
		if(data.pAcs[i] > 0)
		{
			acsID = returnAcsData(data.pAcs[i])
			if(acsID == -1)
			{
				$('.account-main .account-main-acs .account-main-acs-wrap').append(`
					<div class="account-main-acs-item">
						<div class="account-main-acs-item-img" style="border-color: red; background-color: red;"></div>
						<span style="style="color: red;">Неизвестно</span>
					</div>`)
			}
			else
			{
				$('.account-main .account-main-acs .account-main-acs-wrap').append(`
					<div class="account-main-acs-item">
						<div class="account-main-acs-item-img">
							<img src="/styles/images/acs/${acsID.model}.png" alt="Аксессуар: ${acsID.name}">
						</div>
						<span>${acsID.name}</span>
					</div>`)
			}
		}
		else
		{
			$('.account-main .account-main-acs .account-main-acs-wrap').append(`
				<div class="account-main-acs-item">
					<div class="account-main-acs-item-img" style="border-color: #a8a8a8; background-color: silver;"></div>
					<span style="style="color: #a8a8a8;">Пусто</span>
				</div>`)
		}
	}

	$('.wrapper').append(`
		<div class="account-main">
		    <h1>Логи аккаунта</h1>
		    <div class="account-main-logs-time">
		        <h2>Сортировать по времени</h2>
		        <div class="account-main-logs-time-items">
		            <div class="account-main-logs-time-item"><label for="account-logs-time-from">От</label><input class = 'account-main-logs-time-input' id="account-logs-time-from" type="datetime-local" value="${data.logs[data.logs.length - 1].time}" min="${data.firstLog}" max="${data.lastLog}" /></div>
		            <div class="account-main-logs-time-item"><label for="account-logs-time-to">До</label><input class = 'account-main-logs-time-input' id="account-logs-time-to" type="datetime-local" value="${data.logs[0].time}" min="${data.firstLog}" max="${data.lastLog}" /></div>
		            <div class="account-main-logs-time-item"><button id="account-main-logs-update">Обновить</button></div>
		        </div>
		    </div>
		    <div class="account-main-logs">
		    </div>
		</div>`)

	data.logs.forEach(item =>
	{
		$('.account-main .account-main-logs').append(`
			<div class="account-main-logs-item">
				<span>${new Date(item.time).toLocaleString()}</span>
				<span>${item.text}</span>
			</div>`)
	})

	if(data.realty.length)
	{
		$('.wrapper').append(`
			<div class="account-main">
			    <h1>Имущество</h1>
			    <div class="account-main-grettings account-main-houses">
			    	<div class="account-main-grettings-wrap">
			    	</div>
			    </div>
			</div>`)

		data.realty.forEach(item =>
		{
			$('.account-main .account-main-houses .account-main-grettings-wrap').append(`
				<a href="/find?type=realty&search=${item.id}&realty=${item.type}" class="account-main-grettings-item account-main-houses-item-${item.type === 'house' ? "h" : item.type === 'biz' ? "b" : "v"}">
					<div class="account-main-grettings-item-img">
						<img src="/styles/images/others/${item.type === 'house' ? "house" : item.type === 'biz' ? "biz" : "vehicle"}.png" alt="${item.type === 'house' ? "Дом" : item.type === 'biz' ? "Бизнес" : "Транспорт"}">
					</div>
					<span>${item.type === 'house' ? `${realtyTypeNames.house[item.types]}` : item.type === 'biz' ? "Бизнес " : "Транспорт"}${item.type === 'biz' ? `${realtyTypeNames.biz[item.types]}` : ""} #${item.id}</span>
				</a>`)
		})
	}

	data.invModel = data.invModel.split(',')
	data.invCustom = data.invCustom.split(',')
	data.invQuantity = data.invQuantity.split(',')
	data.invSimCost = data.invSimCost.split(',')

	data.inventory = []
	data.invModel.forEach((item, i) =>
	{
		if(item > 0) data.inventory.push({
			model: item,
			quantity: data.invQuantity[i],
			custom: data.invCustom[i],
			simCost: data.invSimCost[i]
		})
	})

	$('.wrapper').append(`
		<div class="account-main">
		    <h1>Инвентарь</h1>
		    <div class="account-main-inv"></div>
		</div>`)

	if(data.inventory.length > 0)
	{
		data.inventory.forEach(item =>
		{
			$('.wrapper .account-main-inv').append(`
				<section>
					<img src="/styles/images/acs/18926.png" alt="Предмет инвентаря 18926">
					<span>Название предмета</span>
				</section>`)
		})
	}
	else $('.wrapper .account-main-inv').html('<h4>Инвентарь пуст</h4>')

	$('.wrapper').prepend(`${renderAdminPageNav('', 'account', { width: "calc(90% - 60px)" })}`)
}


// report
export function renderAdminReportPage(data)
{
	const attrs = getHrefAttrs()
	if(attrs.tags !== undefined)
	{
		$('.wrapper').html(`
			${renderAdminPageNav('', 'report')}
			<div class="report-title">
				<span style="display: flex; align-items: center; flex-wrap: wrap;">Теги жалоб</span>
				<div style="position: relative;">
					<button class="button" id="report-tags-create">Создать новый тег</button>

				    <div class="report-tags-create">
				        <div class="report-tags-create-item">
				        	<input id="report-tags-create-name" type="text" placeholder="Введите название тега" />
				        </div>
				        <div class="report-tags-create-item" style="display: flex; justify-content: center; flex-wrap: wrap;">
				        	<input id="report-tags-create-color" type="text" name="color" value="#d7757b" style="margin-bottom: 10px;" />
				            <div id="report-tags-create-color-div"></div>
				        </div>
				        <div class="report-tags-create-item" style="display: flex; justify-content: flex-end; flex-wrap: wrap;">
				        	<span>Уровень админки, который сможет изменять статус жалобы с тегом</span>
				            <div id="report-tags-create-admin" style="width: 100px;"></div>
				        </div>
				        <div class="report-tags-create-item" style="margin-top: 30px; display: flex; justify-content: flex-end; flex-wrap: wrap;">
				        	<button class="button" id="report-tags-create-btn">Создать</button>
				        </div>
				    </div>
				</div>
			</div>

			<div class="adm-main-item">
			    <h3>Все теги</h3>
			    <div class="adm-main-item-wrapper"></div>
			</div>`)

		select.add('#report-tags-create-admin', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: '1 lvl' })
		if(data.length)
		{
			data.forEach(item =>
			{
				$('.adm-main-item-wrapper').append(`
					<div class="report-tags" data-report-tags-id="${item.tagID}">
			            <h4 style="color: ${item.tagColor}">${item.tagName}</h4>
			            <div>
			                <div class="report-tags-desc">
			                	<span>Создал: <a href="/admin/account?id=${item.tagCreator}" class="href-color">${item.tagCreatorName}</a></span>
			                	<span>Дата создания: ${new Date(item.tagCreateDate).toLocaleString()}</span>
			                	<button class="button report-tags-delete" data-report-tags-id="${item.tagID}">Удалить тег</button>
			                </div>
			            </div>

			            <div class="report-tags-desc" style="margin-top: 20px;">
			            	<span>Уровень доступа для изменения статусы жалобы</span>
			                <div id="report-tags-ans-admin-${item.tagID}" style="margin-top: 10px;"></div>
			            </div>
			        </div>`)

				select.add('#report-tags-ans-admin-' + item.tagID, [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: item.tagAdmin + ' lvl' })
			})
		}

		$('#report-tags-create-color-div').farbtastic('#report-tags-create-color');
		return false
	}

	if(!localStorage.getItem('adm-report-likes')) localStorage.setItem('adm-report-likes', JSON.stringify([]))

	/*
		Report Status:

		0 - Открыта
		1 - Отклонена
		2 - Одобрена
		3 - Закрыта
		4 - На рассмотрении
	*/
	const reportStatusName = [
		'<span style="margin-left: 25px; color: green; text-transform: none; font-size: 20px;">Открыта</span>',
		'<span style="margin-left: 25px; color: red; text-transform: none; font-size: 20px;">Отклонена</span>',
		'<span style="margin-left: 25px; color: #fda605; text-transform: none; font-size: 20px;">Одобрена</span>',
		'<span style="margin-left: 25px; color: #e57373; text-transform: none; font-size: 20px;">Закрыта</span>',
		'<span style="margin-left: 25px; color: yellow; text-transform: none; font-size: 20px;">На рассмотрении</span>'
	]
	const storage = JSON.parse(localStorage.getItem('adm-report-likes'))

	$('.wrapper').html(`
		<div class="report-title">
			<span style="display: flex; align-items: center; flex-wrap: wrap;">
				<div style="width: 100%; justify-content: flex-start;">
					Жалоба #${data.reportID}
					${reportStatusName[data.reportStatus]}
				</div>

				<div>
					<span class="report-title-tag">Тег: <span style="color: ${data.reportTagColor};">${data.reportTagName}</span></span>
					<div style="width: 70px; margin-left: 10px;" id="report-title-like" class='info-list-like ${storage.indexOf(`${data.reportID}`) != -1 ? "info-list-like-on" : ""}'></div>
				</div>
			</span>
			<div>
				<div id="report-change-status" style="margin-right: 15px;"></div>
				<a class="button" href="/find?type=report" style="background-color: #d0d0d0;">&larr; Все жалобы</a>
			</div>
		</div>
		<div class="report-messages"></div>`)


	data.changeStatus = true
	if(data.changeStatus)
	{
		select.add('#report-change-status', [ 'Открыта',
			'Отклонена',
			'Одобрена',
			'Закрыта',
			'На рассмотрении' ], { defaultName: 'Изменить статус жалобы' })
	}
	else $('#report-change-status').remove()

	$('#report-change-status').unbind().on('selectChanges', (elem, data) =>
	{
		let status = null

		if(data.type === 'Открыта') status = 0
		else if(data.type === 'Отклонена') status = 1
		else if(data.type === 'Одобрена') status = 2
		else if(data.type === 'Закрыта') status = 3
		else if(data.type === 'На рассмотрении') status = 4

		if(status == null)return false

		const attrs = getHrefAttrs()
    	if(attrs.id == undefined
    		|| isNaN(attrs.id)
    		|| window.location.pathname != '/admin/report')return url.locate('/admin')

    	loading.go()
		$.post('/admin/report/status', { id: attrs.id, status: status, statusName: data.type }, results =>
		{
			loading.stop()
			if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Произошла ошибка! Попробуйте позже.')

			if(results === 'notfound')return url.locate('/find', '?type=report', { type: 'report' })
			if(results === 'exit')return __removeAccCookies()

			if(results === 'notrights')
			{
				$('.menu-item[data-menu-item-id="admin"]').remove()
				return url.locate('/account')
			}
			// if(results == 'notrights')
			// {
			// 	select.remove('#report-change-status')
			// 	return dialog.show('Ошибка!', 'error', null, 'Ваш уровень администрирования не достаточно высок, чтобы изменять статус жалобы!')
			// }

			dialog.show('Успешно!', 'success', null, 'Вы успешно изменили статус жалобы!')
			url.locate('/admin/report', "?id=" + attrs.id, { id: attrs.id })
		})
	})

	data.messages.forEach((item, i) =>
	{
		if(item.messageAns)
		{
			$('.report-messages').append(`<div class="report-message-ans">
				    <span>
						<a href="/accounts?id=${item.messageCreator}">${item.messageCreatorName}</a> ${item.messageText}
					</span>
				</div>`)
		}
		else
		{
			let nameStatus = '<span>Игрок'

			if(item.messageAdmin) nameStatus = "<span style='color: #fc0505;'>Администратор"
			else if(item.messageCreator == data.reportCreator) nameStatus = "<span style='color: #fda605;'>Создатель жалобы"

			if(item.messageMe)
			{
				if(nameStatus != "<span>") nameStatus += " ( Вы )</span>"
				else nameStatus += "Вы</span>"
			}
			else nameStatus += "</span>"

			$('.report-messages').append(`
				<div class="report-message${item.messageMe ? " report-message-me" : ""}">
					<div class="report-message-avatar">
				        <a href="/find?type=account&amp;id=${item.messageCreator}">${item.messageCreatorName}</a>
				       	${nameStatus}
				    </div>

				    <div class="report-message-wrap">
				        <div class="report-message-write-date">${new Date(item.messageCreateDate).toLocaleString()}</div>
				        <div class="report-message-text">
				        	${i === 1 ? `<div class="report-message-text-player">
					            	<span>Жалоба подана на</span>
					            	<a href="/admin/account?id=${data.reportPlayer}">${data.reportPlayerName}</a>
					            </div>` : ""}
				            ${item.messageText}
				        </div>
				    </div>
				</div>`)
		}
	})

	if(!data.ansStatus) $('.report-messages').append('<div class="report-message-blocked">Вы не можете оставлять здесь ответы!</div>')
	else $('.report-messages').append(`
		<div class="report-message-add">
			<textarea id="report-message-add-area" placeholder="Напишите свой ответ"></textarea>
		    <div class="report-message-add-btns" style="justify-content: flex-end;">
		    	<button class="button" id="adm-report-message-add-btn">Отправить</button>
		    </div>
		</div>`)
}


// settings
export function renderAdminSettingsPage(data)
{
	$('.wrapper').html(`
		${renderAdminPageNav('settings')}

		<div class="adm-main-item">
		    <h3>Просмотр страницы</h3>
		    <div class="adm-main-item-wrapper">
		        <div class="adm-settings-item"><a class="href-color" href="/admin">Главная</a>
		            <div>
		                <div id="settings-select-view-main"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><a class="href-color" href="/admin/account">Аккаунты</a>
		            <div>
		                <div id="settings-select-view-accounts"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><a class="href-color" href="/find?type=report">Промокоды</a>
		            <div>
		                <div id="settings-select-view-promo"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><a class="href-color" href="/find?type=realty">Недвижимость</a>
		            <div>
		                <div id="settings-select-view-realty"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><a class="href-color" href="/find?type=report">Жалобы</a>
		            <div>
		                <div id="settings-select-view-report"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><a class="href-color" href="/admin/report?tags">Теги жалоб</a>
		            <div>
		                <div id="settings-select-view-reportTags"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item">Просмот админ статистики в аккаунте
		            <div>
		                <div id="settings-select-view-admStats"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item" style="justify-content: flex-end; margin-top: 60px;"><button class="button settings-save" data-settings-save-type="view">Сохранить</button></div>
		    </div>
		</div>
		<div class="adm-main-item">
		    <h3>Промокоды</h3>
		    <div class="adm-main-item-wrapper">
		        <div class="adm-settings-item"><span>Создание промокода</span>
		            <div>
		                <div id="settings-select-promo-create"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><span>Сохранение промокода</span>
		            <div>
		                <div id="settings-select-promo-save"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><span>Удаление промокода</span>
		            <div>
		                <div id="settings-select-promo-remove"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item" style="justify-content: flex-end; margin-top: 60px;"><button class="button settings-save" data-settings-save-type="promo">Сохранить</button></div>
		    </div>
		</div>
		<div class="adm-main-item">
		    <h3>Жалобы</h3>
		    <div class="adm-main-item-wrapper">
		        <div class="adm-settings-item"><span>Ответы в открытых жалобах</span>
		            <div>
		                <div id="settings-select-report-ans-open"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><span>Ответы в закрытых жалобах</span>
		            <div>
		                <div id="settings-select-report-ans-close"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><span>Ответы в отклоненных/одобренных жалобах</span>
		            <div>
		                <div id="settings-select-report-ans-other"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><span>Ответы в жалобах "На рассмотрении"</span>
		            <div>
		                <div id="settings-select-report-ans-pending"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><span>Изменять статус жалобы</span>
		            <div>
		                <div id="settings-select-report-changestatus"></div>
		            </div>
		        </div>
		         <div class="adm-settings-item"><span>Создание тегов</span>
		            <div>
		                <div id="settings-select-report-tagcreate"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item"><span>Удаление тегов</span>
		            <div>
		                <div id="settings-select-report-tagdelete"></div>
		            </div>
		        </div>
		        <div class="adm-settings-item" style="justify-content: flex-end; margin-top: 60px;"><button class="button settings-save" data-settings-save-type="report">Сохранить</button></div>
		    </div>
		</div>`)

	select.add('#settings-select-view-main', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.view.main + " lvl" })
	select.add('#settings-select-view-accounts', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.view.accounts + " lvl" })
	select.add('#settings-select-view-promo', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.view.promo + " lvl" })
	select.add('#settings-select-view-realty', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.view.realty + " lvl" })
	select.add('#settings-select-view-report', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.view.report + " lvl" })
	select.add('#settings-select-view-reportTags', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.view.reportTags + " lvl" })
	select.add('#settings-select-view-admStats', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.view.admStats + " lvl" })

	select.add('#settings-select-promo-create', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.promo.create + " lvl" })
	select.add('#settings-select-promo-save', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.promo.save + " lvl" })
	select.add('#settings-select-promo-remove', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.promo.remove + " lvl" })

	select.add('#settings-select-report-ans-open', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.report.ans.open + " lvl" })
	select.add('#settings-select-report-ans-close', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.report.ans.close + " lvl" })
	select.add('#settings-select-report-ans-other', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.report.ans.other + " lvl" })
	select.add('#settings-select-report-ans-pending', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.report.ans.pending + " lvl" })
	select.add('#settings-select-report-changestatus', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.report.changestatus + " lvl" })
	select.add('#settings-select-report-tagcreate', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.report.tag.create + " lvl" })
	select.add('#settings-select-report-tagdelete', [ '1 lvl', '2 lvl', '3 lvl', '4 lvl', '5 lvl', '6 lvl' ], { defaultName: data.admin.report.tag.delete + " lvl" })
}

$(document).ready(() =>
{
	$(document).on('click', '#acc-send-message', () =>
	{
		dialog.show('Отправить сообщение', '2input', 'acc-send-message', '', 'Отмена', 'Отправить', false, null, { inputplace: [ 'Введите название диалога', 'Введите первое сообщение' ] })
		$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
		{
			if(data.dialogid !== 'acc-send-message')return false
			if(!data.inputs[0].length
				|| !data.inputs[1].length)return false

			const id = getHrefAttrs().id
			if(id === undefined || id === null || isNaN(id))return false

			dialog.close()
			loading.go()

			$.post('/messages/create', { player: id, title: data.inputs[0], text: data.inputs[1] }, results =>
			{
				loading.stop()

				if(results === 'exit')return __removeAccCookies()
				if(results === 'error')return dialog.error('error', 'error', null, 'Произошла ошибка! Попробуйте перезагрузить страницу!')

				url.locate('/messages', '?id=' + results.id, { id: results.id })
			})
		})
	})
	$(document).on('click', '#account-main-logs-update', () =>
	{
		console.log('sd')
		const attrs = getHrefAttrs()
		var
			time =
			{
				from: $('.account-main .account-main-logs-time #account-logs-time-from').val(),
				to: $('.account-main .account-main-logs-time #account-logs-time-to').val()
			}

		if(attrs.id == undefined
			|| isNaN(attrs.id))return false

		loading.go()
		$.post('/admin/account/logs', { userid: attrs.id, time: JSON.stringify(time) }, results =>
		{
			loading.stop()
			$('.account-main .account-main-logs').html('')

			if(results === 'exit')return __removeAccCookies()
			if(results === 'notrights')
			{
				$('.menu-item[data-menu-item-id="admin"]').remove()
				return url.locate('/account')
			}
			if(results === 'notfound')return $('.account-main .account-main-logs').append('<div class="account-main-logs-error" style="display: flex; justify-content: center; font-size: 16px;">Ничего не найдено. Попробуйте еще раз!</div>')

			results.forEach(item =>
			{
				$('.account-main .account-main-logs').append(`
					<div class="account-main-logs-item">
						<span>${new Date(item.time).toLocaleString()}</span>
						<span>${item.text}</span>
					</div>`)
			})
		})
	})

	$(document).on('input change', '#promo-level, #promo-max-actives', elem =>
	{
		var number = $(elem.target).val().replace(/[^\d;]/g, '')

		if(parseInt(number) < 1
			&& $(elem.target).attr('id') == 'promo-level') number = "1"
		if(parseInt(number) < 0
			&& $(elem.target).attr('id') == 'promo-max-actives') number = "0"

		if($(elem.target).attr('id') == 'promo-level'
			&& parseInt(number) > 100) number = "100"
		else if($(elem.target).attr('id') == 'promo-max-actives'
			&& parseInt(number) > 100000) number = "100000"

		if($(elem.target).attr('id')
			&& number.length > 4) $(elem.target).attr("size", `3`)
		else if($(elem.target).attr('id')
			&& number.length <= 4) $(elem.target).attr("size", `1`)

		$(elem.target).val(number)

		if(number.length) $(`#${$(elem.target).attr('id')}-range`).val(number)
		else $(`#${$(elem.target).attr('id')}-range`).val('0')
	})
	$(document).on('change', '#promo-level, #promo-max-actives', elem =>
	{
		var number = $(elem.target).val().replace(/[^\d;]/g, '')

		if(parseInt(number) < 1
			&& $(elem.target).attr('id') == 'promo-level') number = "1"
		if(parseInt(number) < 0
			&& $(elem.target).attr('id') == 'promo-max-actives') number = "0"

		$(elem.target).val(number)
		$(`#${$(elem.target).attr('id')}-range`).val(number)
	})

	$(document).on('input change', '#promo-level-range, #promo-max-actives-range', elem =>
	{
		var number = $(elem.target).val().replace(/[^\d;]/g, '')

		if($(elem.target).attr('id')
			&& number.length > 4) $(`#${$(elem.target).attr('id').replace('-range', '')}`).attr("size", `3`)
		else if($(elem.target).attr('id')
			&& number.length <= 4)  $(`#${$(elem.target).attr('id').replace('-range', '')}`).attr("size", `1`)

		 $(`#${$(elem.target).attr('id').replace('-range', '')}`).val(number)

		if(number.length) $($(elem.target)).val(number)
		else $($(elem.target)).val('0')
	})

	// $('#promo-names').bind('input change', elem =>
	// {
	// 	var text = $(elem.target).val().replace(/\.\,/g, "")
	// 	$(elem.target).val(text)
	// })


	$(document).on('click', '.promo-menu ul li', elem =>
	{
		var id = $(elem.target).attr('id')
		if(id == undefined) id = $(elem.target).parent().attr('id')

		promo.open(id)
	})

	// Удаление промокода
	$(document).on('click', '#promo-remove', () =>
	{
		dialog.show('', 'accept', 'adm-promo-remove', 'Вы действительно хотите удалить данный промокод?', 'Нет', 'Да')
		$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
		{
			if(data.dialogid !== 'adm-promo-remove')return false
			dialog.close()

			const attrs = getHrefAttrs()
			if(attrs.id == undefined
	    		|| isNaN(attrs.id)
	    		|| window.location.pathname != '/admin/promo')return url.locate('/admin')

			$.post('/admin/promo/remove', { id: attrs.id }, results =>
	    	{
	    		if(results === 'exit')return __removeAccCookies()
	    		if(results === 'notrights')
	    		{
	    			$('.menu-item[data-menu-item-id="admin"]').remove()
	    			return url.locate('/account')
	    		}
	    		if(results === 'error')return dialog.show('Ошибка', 'error', 0, 'Произошла ошибка. Попробуйте позже!')

	    		dialog.show('Успешно!', 'success', 0, 'Промокод был успешно удален!')
	    		url.locate('/admin')
	    	})
		})
	})

	// Сохранение промокода
	$(document).on('click', '#promo-save', () =>
	{
		const attrs = getHrefAttrs()
    	if(attrs.id == undefined
    		|| isNaN(attrs.id)
    		|| window.location.pathname != '/admin/promo')return url.locate('/admin')

    	var promoData =
    	{
    		id: attrs.id,

    		name: $('#promo-names').val(),
    		level: $('#promo-level-range').val(),
    		maxActives: $('#promo-max-actives-range').val(),

    		items: []
    	}

    	for(var i = 0; i < 4; i ++)
    	{
    		promoData.items.push({
    			type: $(`#promo-item-slots-data .promo-item-slot #promo-item-select-${i}`).attr('data-select-type'),
    			value: $(`#promo-item-slots-data .promo-item-slot .promo-item-names-${i}:visible input`).val()
    		})
    	}

    	$.post('/admin/promo/save', { data: JSON.stringify(promoData) }, results =>
    	{
    		if(results === 'exit')return __removeAccCookies()
    		if(results === 'notrights')
    		{
    			$('.menu-item[data-menu-item-id="admin"]').remove()
    			return url.locate('/account')
    		}
    		if(results === 'error')return dialog.show('Ошибка', 'error', 0, 'Произошла ошибка. Попробуйте позже!')
    		if(results == 'time')return dialog.show('Ошибка', 'error', 0, 'Промокод недавно уже изменяли. Подождите!')

    		dialog.show('Успешно!', 'success', 0, 'Промокод успешно сохранен!')
    	})
	})

	// Создание промокода
	$(document).on('click', '#promo-create', () =>
	{
		const attrs = getHrefAttrs()
    	if(attrs.create === undefined
    		|| window.location.pathname != '/admin/promo')return url.locate('/admin')

    	var promoData =
    	{
    		name: $('#promo-names').val(),
    		level: $('#promo-level-range').val(),
    		maxActives: $('#promo-max-actives-range').val(),

    		items: []
    	}

    	for(var i = 0; i < 4; i ++)
    	{
    		promoData.items.push({
    			type: $(`#promo-item-slots-data .promo-item-slot #promo-item-select-${i}`).attr('data-select-type'),
    			value: $(`#promo-item-slots-data .promo-item-slot .promo-item-names-${i}:visible input`).val()
    		})
    	}

    	$.post('/admin/promo/create', { data: JSON.stringify(promoData) }, results =>
    	{
    		if(results === 'exit')return __removeAccCookies()
    		if(results === 'notrights')
    		{
    			$('.menu-item[data-menu-item-id="admin"]').remove()
    			return url.locate('/account')
    		}
    		if(results === 'error')return dialog.show('Ошибка', 'error', 0, 'Произошла ошибка. Попробуйте позже!')
    		if(results == 'time')return dialog.show('Ошибка', 'error', 0, 'Промокод недавно уже изменяли. Подождите!')
    		if(results == 'errorName')return dialog.show('Ошибка', 'error', 0, 'Промокод с данным названием уже есть!')

    		dialog.show('Успешно!', 'success', 0, 'Промокод успешно создан!')
    		url.locate(`/admin/promo`, `?id=${results.id}`, { id: results.id })
    	})
	})

	// Поиск игроков, активировавших промокод
	$(document).on('click', '#promo-search-button', () =>
	{
		const attrs = getHrefAttrs()
    	if(attrs.id == undefined
    		|| isNaN(attrs.id)
    		|| window.location.pathname != '/admin/promo')return url.locate('/admin')

		var value = $('.promo #promo-search').val()
		loading.go()

		$.post('/admin/promo-actives', { id: attrs.id, search: value }, results =>
		{
			if(results === 'exit')return __removeAccCookies()
    		if(results === 'notrights')
    		{
    			$('.menu-item[data-menu-item-id="admin"]').remove()
    			return url.locate('/account')
    		}
    		if(results === 'notfound')return url.locate('/admin')

			loading.stop()
			$('.promo .find-body-list').html('')

			if(results !== 'not')
			{
				results.forEach(item =>
				{
					$('.promo .find-body-list').append(`
						<a href="/find?type=account&search=${item.pName}" class="item-list">
							<div class="info">
								<div class="bg-list">
									<img src="/styles/images/skins/${item.pSkin}.png" alt="Скин #${item.pSkin}">
								</div>
								<div class="info-list">
									<h3>${item.pName}</h3>
									<div class="info-list-wrap">
										<span style="text-align: left;">Уровень: ${item.pLevel}</span>
										<span style="text-align: left;">Дата регистрации: ${new Date(item.pRegDate).toLocaleString()}</span>
										<span style="text-align: left;">RegIP: ${item.pRegIP}</span>
										<span style="text-align: left;">LastIP: ${item.pIP}</span>
									</div>
								</div>
							</div>
							<div class="info-open">
								<span></span>
							</div>
						</a>`)
				})
			}
		})
	})
	$(document).on('click', '.realty .realty-nav .realty-nav-item', elem =>
	{
		var data = $(elem.currentTarget).attr('data-realty-id')
		if(data == undefined)return false

		realty.open(data)
	})

	// Добавление нового сообщения в жалобу
	$(document).on('click', '#adm-report-message-add-btn', () =>
	{
		const text = $('#report-message-add-area')
		if(text.val().length < 4)return dialog.show('Ошибка!', 'error', null, 'Необходимо минимум 4 символа для отправки сообщения!')

		const attrs = getHrefAttrs()
		console.log(attrs, window.location.pathname)

    	if(attrs.id === undefined
    		|| isNaN(attrs.id)
    		|| window.location.pathname != '/admin/report')return url.locate('/admin')

		$.post('/admin/report/ans', { data: JSON.stringify({ text: text.val(), reportID: attrs.id }) }, results =>
		{
			if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Произошла ошибка при отправке сообщения.<br>Попробуйте позже!')
			if(results === 'length')return  dialog.show('Ошибка!', 'error', null, 'Необходимо минимум 4 символа для отправки сообщения!')

			if(results === 'notfound')return url.locate('/find', '?type=report', { type: 'report' })
			if(results === 'exit')return __removeAccCookies()

			if(results === 'notrights')
			{
				$('.menu-item[data-menu-item-id="admin"]').remove()
				return url.locate('/account')
			}

			if(results === 'errorupdate')return url.locate('/report', '?id=' + attrs.id, { id: attrs.id })
			// if(results == 'notAdmin')return dialog.show('Ошибка!', 'error', null, 'Ваш уровень администрирования не достаточно высок, чтобы отвечать в данной жалобе!')

			dialog.show('Успешно!', 'success', null, 'Вы успешно отправили сообщение!')
			url.locate('/admin/report', '?id=' + attrs.id, { id: attrs.id })
		})
	})

	// Создание тега
	// $(document).on('click', '#report-tags-create', () => $('.report-tags-create').toggleClass('report-tags-create-show'))
	$(document).on('click', '#report-tags-create', () => dialog.show('error', 'error', null, 'Временно не доступно!'))
	$(document).on('click', '#report-tags-create-btn', () =>
	{
		return dialog.show('error', 'error', null, 'Временно не доступно!')
		// const
		// 	name = $('#report-tags-create-name').val(),
		// 	color = $('#report-tags-create-color').val(),
		// 	admin = parseInt($('#report-tags-create-admin').attr('data-select-type'))

		// if(name.length < 1 || name.length > 30)return dialog.show('Ошибка!', 'error', null, 'Длина названия 1 - 30 символов!')
		// if(!/^#[0-9A-F]{6}$/i.test(color))return dialog.show('Ошибка!', 'error', null, 'Не корректный цвет!')

		// if(!admin || isNaN(admin)
		// 	|| admin < 1 || admin > 6)return dialog.show('Ошибка!', 'error', null, 'Не корректный уровень админки!')

		// loading.go()
		// $.post('/report/tags/create', { name: name, color: color, admin: admin }, results =>
		// {
		// 	loading.stop()
		// 	if(results === 'exit')return __removeAccCookies()

		// 	if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Не корректные данные. Проверьте все поля и попробуйте еще раз!')
		// 	if(results === 'notAdmin') dialog.show('Ошибка!', 'error', null, 'Ваш уровень администрирования не достаточно высок, чтобы создать теги!')

		// 	if(results === 'nameReserved')return dialog.show('Ошибка!', 'error', null, 'Данное имя тега уже занято!')

		// 	dialog.show('Успешно!', 'success', null, 'Вы успешно создали новый тег.')
		// 	url.locate('/report/tags')
		// })
	})

	$(document).mouseup(e =>
	{
		if($('.report-tags-create').hasClass('report-tags-create-show'))
		{
			var div = $('.report-tags-create')

			if(!div.is(e.target)
			    && div.has(e.target).length === 0) $('.report-tags-create').removeClass('report-tags-create-show')
		}
	})

	// Удаление тега
	$(document).on('click', '.report-tags-delete', elem =>
	{
		let id = $(elem.target).attr('data-report-tags-id')
		if(!id || isNaN(id))return false

		dialog.show('Удалить?', 'accept', 'report-tag-delete', 'Вы действительно хотите удалить данный тег?<br><span style="color: red;">Все жалобы, у которых установлен данный тег будут перенесены в "Без тега".</span>', 'Нет', 'Да', false, { id: id })
		$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
		{
			if(data.dialogid != 'report-tag-delete')return false
			dialog.close()

			id = parseInt(data.data.id)
			if(!id || isNaN(id))return false

			loading.go()
			$.post('/admin/report/tags/delete', { id: id }, results =>
			{
				loading.stop()
				if(results === 'exit')return __removeAccCookies()
				if(results === 'notrights')
				{
					$('.menu-item[data-menu-item-id="admin"]').remove()
					return url.locate('/account')
				}

				if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Не корректные данные. Проверьте все поля и попробуйте еще раз!')
				if(results === 'notAdmin')return dialog.show('Ошибка!', 'error', null, 'Вы не можете удалить данный тег!')

				if(results === 'update')return url.locate('/admin/report', '?tags', { tags: '' })

				dialog.show('Успешно!', 'success', null, 'Вы успешно удалили тег!')
				url.locate('/admin/report', '?tags', { tags: '' })
			})
		})
	})

	// Добавление жалобы в избранное
	$(document).on('click', '#report-title-like', elem =>
	{
		const attrs = getHrefAttrs()
    	if(attrs.id == undefined
    		|| isNaN(attrs.id)
    		|| window.location.pathname != '/admin/report')return url.locate('/admin')

    	if(!localStorage.getItem('adm-report-likes')) localStorage.setItem('adm-report-likes', JSON.stringify([]))
    	let storage = JSON.parse(localStorage.getItem('adm-report-likes'))

		if($('#report-title-like').hasClass('info-list-like-on'))
		{
			$('#report-title-like').removeClass('info-list-like-on')

			const index = storage.indexOf(`${attrs.id}`)
			if(index != -1) storage.splice(index, 1)
		}
		else
		{
			$('#report-title-like').addClass('info-list-like-on')
			storage.push(attrs.id)
		}

		localStorage.setItem('adm-report-likes', JSON.stringify(storage))
	})

	$(document).on('click', '.settings-save', elem =>
	{
		const type = $(elem.target).attr('data-settings-save-type')
		if(type == undefined)return false

		let data = {}
		if(type === 'report')
		{
			data =
			{
				ans:
				{
					open: parseInt($('#settings-select-report-ans-open').attr('data-select-type')),
					close: parseInt($('#settings-select-report-ans-close').attr('data-select-type')),
					other: parseInt($('#settings-select-report-ans-other').attr('data-select-type')),
					pending: parseInt($('#settings-select-report-ans-pending').attr('data-select-type'))
				},
				changestatus: parseInt($('#settings-select-report-changestatus').attr('data-select-type')),
				tag:
				{
					create: parseInt($('#settings-select-report-tagcreate').attr('data-select-type')),
					delete: parseInt($('#settings-select-report-tagdelete').attr('data-select-type'))
				}
			}
		}
		else if(type === 'promo')
		{
			data =
			{
				create: parseInt($('#settings-select-promo-create').attr('data-select-type')),
				save: parseInt($('#settings-select-promo-save').attr('data-select-type')),
				remove: parseInt($('#settings-select-promo-remove').attr('data-select-type'))
			}
		}
		else if(type === 'view')
		{
			data =
			{
				main: parseInt($('#settings-select-view-main').attr('data-select-type')),
				accounts: parseInt( $('#settings-select-view-accounts').attr('data-select-type')),
				promo: parseInt($('#settings-select-view-promo').attr('data-select-type')),
				realty: parseInt($('#settings-select-view-realty').attr('data-select-type')),
				report: parseInt($('#settings-select-view-report').attr('data-select-type')),
				reportTags: parseInt($('#settings-select-view-reportTags').attr('data-select-type')),
				admStats: parseInt($('#settings-select-view-admStats').attr('data-select-type'))
			}
		}
		else return false

		loading.go()
		$.post('/admin/settings/save/', { type: type, data: JSON.stringify(data) }, results =>
		{
			loading.stop()

			if(results === 'exit')return __removeAccCookies()
			if(results === 'notrights')
			{
				$('.menu-item[data-menu-item-id="admin"]').remove()
				return url.locate('/account')
			}
			if(results === 'notAdmin')return dialog.show('error', 'error', null, 'Ваш уровень администрирования не достаточно высок, чтобы сохранять данные!')
			if(results === 'error')return dialog.show('Ошибка', 'error', 0, 'Произошла какая-то ошибка. Проверьте все поля!')

			dialog.show('Успешно!', 'success', 0, 'Настройки успешно сохранены!')
		})
	})
})
