import { url } from '../../main.js'

export const report =
{
	getUnreadMessages: () =>
	{
		$.post('/report/get-unread', {  }, results =>
		{
			if(results === 'exit')return __removeAccCookies()
			$('.menu .menu-items .menu-item[data-menu-item-id="report"] .menu-item-notf').remove()

			if(results.length) $('.menu .menu-items .menu-item[data-menu-item-id="report"]').append(`<div class="menu-item-notf">${results.length}</div>`)
		})
	}
}

export function renderReportPage(data)
{
	$('.wrapper').html(`
		<div class="report-title">
			<span>Жалобы</span>
			<a class="button" href="/report/create">Создать жалобу</a>
		</div>

		<div class="report-my" id="report-my">
		    <h1>Мои жалобы</h1>
		    <div class="report-my-wrap"></div>
		    <div class="report-my-count" style="display: none;">
		    	<a data-report-my-count="left"><</a>
		    	<a href="/report?list=1" data-report-my-count="1" class="report-my-count-select">1</a>
		    	<a href="/report?list=2" data-report-my-count="2">2</a>
		    	<a href="/report?list=3" data-report-my-count="3">3</a>
		    	<a class="report-my-count-none">...</a>
		    	<a  href="/report?list=10"data-report-my-count="10">10</a>
		    	<a data-report-my-count="right">></a>
		    </div>
		</div>

		<div class="report-my" id="report-on-my">
		    <h1>Жалобы на меня</h1>
		    <div class="report-my-wrap"></div>
		</div>`)

	if(data.myReports.length >= 1)
	{
		data.myReports.forEach(item =>
		{
			/*
				Report Status:

				0 - Открыта
				1 - Отклонена
				2 - Одобрена
				3 - Закрыта
				4 - На рассмотрении
			*/
			const reportStatusName = [
				'<span style="color: green;">Открыта</span>',
				'<span style="color: red;">Отклонена</span>',
				'<span style="color: #fda605;">Одобрена</span>',
				'<span style="color: #e57373;">Закрыта</span>',
				'<span style="color: yellow;">На рассмотрении</span>'
			]

			$('#report-my .report-my-wrap').append(`
				 <div class="report-my-item">
		            <div>
		                <h2>${item.reportName}</h2>
		                <div class="report-my-item-desc">
		                	На <a href="/find?type=account&search=${item.reportPlayerName}">${item.reportPlayerName}</a><br />
		                	Тег: <span style="color: ${item.reportTagColor}">${item.reportTagName}</span>
		                	<br /><br />
		                	Создана: ${new Date(item.reportCreateDate).toLocaleString()}<br />
		                	Статус: ${reportStatusName[item.reportStatus]}
		                </div>
		            </div>
		            <div><a class="report-my-item-go" href="/report?id=${item.reportID}">Перейти</a></div>
		            ${item.reads > 0 ? `<div class="messages-new-count">${item.reads}</div>` : ""}
		        </div>`)
		})
	}

	if(data.reports.length >= 1)
	{
		data.reports.forEach(item =>
		{
			/*
				Report Status:

				0 - Открыта
				1 - Отклонена
				2 - Одобрена
				3 - Закрыта
				4 - На рассмотрении
			*/
			const reportStatusName = [
				'<span style="color: green;">Открыта</span>',
				'<span style="color: red;">Отклонена</span>',
				'<span style="color: #fda605;">Одобрена</span>',
				'<span style="color: #e57373;">Закрыта</span>',
				'<span style="color: yellow;">На рассмотрении</span>'
			]

			$('#report-on-my .report-my-wrap').append(`
				 <div class="report-my-item">
		            <div>
		                <h2>${item.reportName}</h2>
		                <div class="report-my-item-desc">
		                	Создал жалобу <a href="/find?type=account&search=${item.reportCreatorName}">${item.reportCreatorName}</a><br>
		                	Тег: <span style="color: ${item.reportTagColor}">${item.reportTagName}</span>
		                	<br /><br />
		                	Создана: ${new Date(item.reportCreateDate).toLocaleString()}<br />
		                	Статус: ${reportStatusName[item.reportStatus]}
		                </div>
		            </div>
		            <div><a class="report-my-item-go" href="/report?id=${item.reportID}">Перейти</a></div>
		            ${item.reads > 0 ? `<div class="messages-new-count">${item.reads}</div>` : ""}
		        </div>`)
		})
	}
}
export function renderReportInfoPage(data)
{
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

	$('.wrapper').html(`
		<div class="report-title">
			<span style="display: flex; align-items: center; flex-wrap: wrap;">
				<h3>Жалоба #${data.reportID}</h3>
				${reportStatusName[data.reportStatus]}
				<span class="report-title-tag">Тег: <span style="color: ${data.reportTagColor};">${data.reportTagName}</span></span>
			</span>
			<div>
				<a class="button" href="/report" style="background-color: #d0d0d0;">&larr; Мои жалобы</a>
			</div>
		</div>
		<div class="report-messages"></div>`)

	// if(data.reportStatus === 0
	// 	&& data.reportCreator === login.data.id) $('.report-title div').prepend('<button class="button" id="reportClose" style="background-color: #e57373; margin-right: 10px;">Закрыть жалобу</button>')

	data.messages.forEach((item, i) =>
	{
		if(item.messageAns)
		{
			$('.report-messages').append(`<div class="report-message-ans">
				    <span>
						<a href="/find?type=account&search=${item.messageCreatorName}">${item.messageCreatorName}</a> ${item.messageText}
					</span>
				</div>`)
		}
		else
		{
			let nameStatus = '<span>Игрок</span>'

			if(item.messageAdmin) nameStatus = "<span style='color: #fc0505;'>Администратор"
			else if(item.messageCreator == data.reportCreator) nameStatus = "<span style='color: #fda605;'>Создатель жалобы"
			else nameStatus = "<span>"

			if(item.messageMe)
			{
				if(nameStatus != "<span>") nameStatus += " ( Вы )</span>"
				else nameStatus += "Вы</span>"
			}
			else if(nameStatus === "<span>") nameStatus += "Игрок</span>"
			else nameStatus += "</span>"

			$('.report-messages').append(`
				<div class="report-message${item.messageMe ? " report-message-me" : ""}">
					<div class="report-message-avatar">
				        <a href="/find?type=account&search=${item.messageCreatorName}">${item.messageCreatorName}</a>
				       	${nameStatus}
				    </div>

				    <div class="report-message-wrap">
				        <div class="report-message-write-date">${new Date(item.messageCreateDate).toLocaleString()}</div>
				        <div class="report-message-text">
				        	${i === 1 ? `<div class="report-message-text-player">
					            	<span>Жалоба подана на</span>
					            	<a href="/find?type=account&search=${data.reportPlayerName}">${data.reportPlayerName}</a>
					            </div>` : ""}
				            ${item.messageText}
				        </div>
				    </div>
				</div>`)

			// if(item.messageMe === true)
			// {
			// 	$('.report-messages').append(`
			// 		<div class="report-message report-message-me">
			// 		    <div class="report-message-wrap">
			// 		        <div class="report-message-write-date">${new Date(item.messageCreateDate).toLocaleString()}</div>
			// 		        <div class="report-message-text">
			// 		        	${i === 1 ? `<div class="report-message-text-player">
			// 			            	<span>Жалоба подана на</span>
			// 			            	<a href="/find?type=account&amp;id=${data.reportPlayer}">${data.reportPlayerName}</a>
			// 			            </div>` : ""}
			// 		            ${item.messageText}
			// 		        </div>
			// 		    </div>

			// 		    <div class="report-message-avatar">
			// 		        <a href="/find?type=account&amp;id=${item.messageCreator}">${item.messageCreatorName}</a>
			// 		        <span style="color: #fda605;"></span>
			// 		       	${data.reportCreator === item.messageCreator ? "<span style='color: #fda605;'>Создатель жалобы (Вы)</span>" : "<span>Вы</span>"}
			// 		    </div>
			// 		</div>`)
			// }
			// else
			// {
			// 	let nameStatus = '<span>Игрок</span>'

			// 	if(item.messageAdmin === 1) nameStatus = "<span style='color: #fc0505;'>Администратор</span>"
			// 	else if(data.reportCreator === item.messageCreator) nameStatus = "<span style='color: #fda605;'>Создатель жалобы</span>"

			// 	$('.report-messages').append(`
			// 		<div class="report-message">
			// 			<div class="report-message-avatar">
			// 		        <a href="/find?type=account&amp;id=${item.messageCreator}">${item.messageCreatorName}</a>
			// 		        <span style="color: #fda605;"></span>
			// 		       	${nameStatus}
			// 		    </div>

			// 		    <div class="report-message-wrap">
			// 		        <div class="report-message-write-date">${new Date(item.messageCreateDate).toLocaleString()}</div>
			// 		        <div class="report-message-text">
			// 		        	${i === 0 ? `<div class="report-message-text-player">
			// 			            	<span>Жалоба подана на</span>
			// 			            	<a href="/find?type=account&amp;id=${data.reportPlayer}">${data.reportPlayerName}</a>
			// 			            </div>` : ""}
			// 		            ${item.messageText}
			// 		        </div>
			// 		    </div>
			// 		</div>`)
			// }
		}
	})

	if(data.reportStatus !== 0) $('.report-messages').append('<div class="report-message-blocked">Вы не можете оставлять здесь ответы!</div>')
	else $('.report-messages').append(`
		<div class="report-message-add">
			<textarea id="report-message-add-area" placeholder="Напишите свой ответ"></textarea>
		    <div class="report-message-add-btns" style="justify-content: flex-end;">
		    	<button class="button" id="report-message-add-btn">Отправить</button>
		    </div>
		</div>`)
}
export function renderReportAddPage(data)
{
	$('.wrapper').html(`
		<div class="report-title">
			<span>Создание жалобы</span>
			<a class="button" href="/report" style="background-color: #d0d0d0;">&larr; Мои жалобы</a>
		</div>
		<div class="report-add">
		    <div class="report-add-desc">
		    	<button class="button" id="reportAddInfoBtn">
		    		Информация <span style="font-size: 13px;">(Обязательно, перед подачей)</span>
		    	</button>
		        <h1 id="reportAddInfo">Информация</h1>
		    </div>

		    <div class="report-add-player">
		        <h1>Игрок, на которого подаете жалобу</h1>
		        <div class="report-add-player-search">
		        	<input id="reportAddSearchPlayer" placeholder="Введите ник игрока" type="text" maxlength="24" autocomplete="off" />
		        	<button id="reportAddSearchType" data-report-add-search-type="nick">По нику</button>
		        </div>
		        <div class="report-add-player-hints"></div>
		    </div>

		    <div class="report-add-name">
		    	<input id="reportAddName" placeholder="Название жалобы" type="text" maxlength="144">
		    	<div id="reportAddTag"></div>
		    </div>
		    <textarea id="reportAddTextarea" placeholder="Описание жалобы..."></textarea>

		    <div class="report-add-go">
		    	<button class="button" id="reportAddGo">Создать жалобу</button>
		   	</div>
		</div>`)

	select.add('#reportAddTag', data, { defaultName: 'Выберите тег', hideArrow: true, reverse: true })
}

$(document).ready(() =>
{
	// Закрытие жалобы
	$(document).on('click', "#reportClose", () =>
	{
		var
    		urlData = new URL(window.location.href),
    		search = {}

    	for(var value of new URLSearchParams(urlData.search.split('?')[1])) search[value[0]] = value[1]
    	if(search.id == undefined
    		|| isNaN(search.id)
    		|| window.location.pathname != '/report')return url.locate('/account')

    	loading.go()
		$.post('/report/close', { id: search.id }, results =>
		{
			loading.stop()

			if(results === 'exit')return __removeAccCookies()
			if(results === 'reportNotFound')return url.locate('/report')
			if(results === 'notrights')return dialog.show('Ошибка!', 'error', null, "Вы не можете закрыть данную жалобу!")
			if(results === 'error')return url.locate('/report', '?id=' + search.id, { id: search.id })

			dialog.show('Успешно!', 'success', null, 'Вы успешно закрыли жалобу #' + search.id)
			url.locate('/report', '?id=' + search.id, { id: search.id })
		})
	})

	// Вывод инфы о создании жалобы
	$(document).on('click', '#reportAddInfoBtn', () =>
	{
		if($('.report-add-desc h1').css('display') === 'none') $('.report-add-desc h1').slideDown('fast')
		else $('.report-add-desc h1').slideUp('fast')
	})

	// Создание жалобы
	$(document).on('click', '#reportAddGo', () =>
	{
		const
			account = { id: $('#reportAddSearchPlayer').attr('data-report-acc-id'), name: $('#reportAddSearchPlayer').attr('data-report-acc-name') },
			text = $('#reportAddTextarea').val(),
			name = $('#reportAddName').val(),
			tag = $('#reportAddTag').attr('data-select-type')

		if(!account.id || isNaN(account.id))return dialog.show('Ошибка!', 'error', null, 'Игрок, на котрого Вы подаете жалобу не найден. <br>Выберите игрока из предложенных.')
		if(text.length < 20)return dialog.show('Ошибка', 'error', null, 'Минимальная длина содержимого жалобы 20 символов!')
		if(name.length < 10)return dialog.show('Ошибка', 'error', null, 'Минимальная длина названия жалобы 10 символов!')
		// if(login.data.id == account.id)return dialog.show('Ошибка', 'error', null, 'Вы не можете подать на себя жалобу!')
		if(tag === 'Выберите тег')return dialog.show('Ошибка', 'error', null, 'Выберите тег!')

		loading.go()
		$.post('/report/create', { player: JSON.stringify(account), text: text, name: name, tag: tag }, results =>
		{
			loading.stop()

			if(results === 'error')return dialog.show('Ошибка!', 'error', null, "Проверьте все данные!")
			if(results === 'exit')return __removeAccCookies()
			if(results === 'accountNotFound')
			{
				$('#reportAddSearchPlayer').removeAttr('data-report-acc-id')
				$('#reportAddSearchPlayer').removeAttr('data-report-acc-name')

				return dialog.show('Ошибка!', 'error', null, 'Игрок, на котрого Вы подаете жалобу не найден. <br>Выберите игрока из предложенных.')
			}
			if(results === 'notRights')return dialog.show('Ошибка!', 'error', null, 'Для создания жалобы Вам нужен 2 уровень аккаунта!')
			if(results === 'tagNotfound')return dialog.show('Ошибка!', 'error', null, 'Тег не найден!')

			dialog.show('Успешно!', 'success', null, `Вы успешно создали жалобу #${results.insertID}`)
			url.locate('/report', '?id=' + results.insertID, { id: results.insertID })
		})
	})

	// Смена типа поиска с ника на ID
	$(document).on('click', '#reportAddSearchType', () =>
	{
		if($('#reportAddSearchType').attr('data-report-add-search-type') === 'nick')
		{
			$('#reportAddSearchType').attr('data-report-add-search-type', 'id')
			$('#reportAddSearchType').html('По ID')
		}
		else
		{
			$('#reportAddSearchType').attr('data-report-add-search-type', 'nick')
			$('#reportAddSearchType').html('По нику')
		}

		$('.report-add-player .report-add-player-hints').html('')
	})
	// Выбор игрока из предложеных
	$(document).on('click', '.report-add-player .report-add-player-hints div', elem =>
	{
		const
			accID = $(elem.target).attr('data-report-add-player-hint-id'),
			accName = $(elem.target).attr('data-report-add-player-hint-name')

		if(!accID || !accName)return false

		$('#reportAddSearchPlayer').val(accName)

		$('#reportAddSearchPlayer').attr('data-report-acc-id', accID)
		$('#reportAddSearchPlayer').attr('data-report-acc-name', accName)
	})
	// Поиск игрока по нику/id
	$(document).on('input', '#reportAddSearchPlayer', () =>
	{
		const
			text = $('#reportAddSearchPlayer').val(),
			type = $('#reportAddSearchType').attr('data-report-add-search-type')

		if(type === 'nick'
			&& text.length < 4)return $('.report-add-player .report-add-player-hints').slideUp('fast')

		$.post('/report/create/getaccounts', { text: text, type: type }, results =>
		{
			if(results === 'notfound')return $('.report-add-player .report-add-player-hints').slideUp('fast')

			$('.report-add-player .report-add-player-hints').html('')
			results.forEach(item =>
			{
				$('.report-add-player .report-add-player-hints').append(`<div data-report-add-player-hint-id="${item.pID}", data-report-add-player-hint-name="${item.pName}">${item.pName} (ID: ${item.pID})</div>`)
			})
			if($('.report-add-player .report-add-player-hints').css('display') === 'none') $('.report-add-player .report-add-player-hints').slideDown('fast')
		})
	})
	$(document).on('focus', '#reportAddSearchPlayer', () =>
	{
		if(!$('.report-add-player-hints').length)return false
		$('.report-add-player .report-add-player-hints').slideDown('fast')
	})
	$(document).on('focusout', '#reportAddSearchPlayer', () =>
	{
		$('.report-add-player .report-add-player-hints').slideUp('fast')
	})

	// Добавление нового сообщения в жалобу
	$(document).on('click', '#report-message-add-btn', () =>
	{
		const text = $('#report-message-add-area')
		if(text.val().length < 4)return dialog.show('Ошибка!', 'error', null, 'Необходимо минимум 4 символа для отправки сообщения!')

		var
    		urlData = new URL(window.location.href),
    		search = {}

    	for(var value of new URLSearchParams(urlData.search.split('?')[1])) search[value[0]] = value[1]
    	if(search.id == undefined
    		|| isNaN(search.id)
    		|| window.location.pathname != '/report')return url.locate('/account')

    	loading.go()
		$.post('/report/ans', { data: JSON.stringify({ text: text.val(), reportID: search.id }) }, results =>
		{
			loading.stop()
			if(results === 'exit')return __removeAccCookies()

			if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Произошла ошибка при отправке сообщения.<br>Попробуйте позже!')
			if(results === 'length')return  dialog.show('Ошибка!', 'error', null, 'Необходимо минимум 4 символа для отправки сообщения!')

			if(results === 'notFound')return url.locate('/report')
			if(results === 'errorupdate')return url.locate('/report', '/report?id=' + search.id, { id: search.id })

			dialog.show('Успешно!', 'success', null, 'Вы успешно отправили сообщение!')
			url.locate('/report', '?id=' + search.id, { id: search.id })
		})
	})
})
