import { url } from '../../main.js'
import { loginData } from '../../other-pages/login.js'
import { getHrefAttrs } from '../../other.js'

export const messages =
{
	getUnreadMessages: () =>
	{
		$.post('/messages/get-unread', {}, results =>
		{
			if(results === 'exit')return __removeAccCookies()
			$('#header-item-messages .header-item-notf').remove()

			if(results.length) $('#header-item-messages').append(`<div class="header-item-notf">${results.length}</div>`)
		})
	}
}

export function renderMessagesPage(data)
{
	$('.wrapper').html(`
		<div class="report-title">
		    <h1>Мои сообщения</h1>
		</div>`)

	if(data === 'notfound')
	{
		$('.wrapper').append(`
			<div class="messages-error">Сообщений не найдено!</div>`)
	}
	else
	{
		// <span>Участники:${item.accountsName.forEach(accs =>
		// 							{
		// 								` <a href="/find?type=account&search=${accs}">${accs}</a>`
		// 							})}</span>

		$('.wrapper').append(`<div class="messages"></div>`)
		data.forEach(item =>
		{
			$('.wrapper .messages').append(`
				<div class="messages-item">
					<div class="message-box">
						${item.messages.ownerSkin ? `
							<div class="messages-img">
								<img src="/styles/images/skins/${item.messages.ownerSkin}.png" alt="Скин #${item.messages.ownerSkin}">
							</div>` : ""}

						<div class="messages-desc">
							<div class="messages-title">
								${item.title}
								<div class="messages-date">${moment(new Date(item.messages.date)).fromNow()}</div>
							</div>
							<div class="messages-info">${item.messages.accID === loginData.id ? "<span style='color: grey;'>Вы: </span>" : ""}${item.messages.text}</div>
						</div>
					</div>

					<div class="message-box" style="align-items: center;">
						<div class="message-btn">
							<a class="button" href="/messages?id=${item.id}">Открыть</a>
						</div>
					</div>

					${item.reads > 0 ? `<div class="messages-new-count">${item.reads}</div>` : ""}
				</div>`)
		})
	}
}
export function renderMessagesNamePage(data)
{
	if(data === 'notfound')return url.locate('/messages')

	$('.wrapper').html(`
		<div class="report-title">
		    <h1></h1>
		    <div>
				<a class="button" href="/messages" style="background-color: #d0d0d0;">&larr; Все сообщения</a>
			</div>
		</div>
		<div class="report-messages messages-block"></div>`)

	data.forEach(item =>
	{
		$('.wrapper .report-title h1').html(`Личная переписка`)

		if(item.textAns) $('.report-messages').append(`<div class="report-message-ans"><span>${item.text}</span></div>`)
		else
		{
			$('.report-messages').append(`
				<div class="report-message${item.accID == loginData.id ? " report-message-me" : ""}">
					<div class="report-message-avatar">
						<div class="report-message-avatar-img">
							<img src="/styles/images/skins/${item.ownerSkin}.png" alt="Скин #${item.ownerSkin}">
						</div>
				        <a href="/find?type=account&search=${item.accName}">${item.accName}</a>
				    </div>

				    <div class="report-message-wrap">
				        <div class="report-message-write-date">${moment(new Date(item.date)).fromNow()}</div>
				        <div class="report-message-text">
				        	${item.text}
				        </div>
				    </div>
				</div>`)
		}
	})

	$('.report-messages').append(`
		<div class="report-message-add">
			<textarea id="messages-add-area" placeholder="Напишите свой ответ" rows="1"></textarea>
		    <div class="report-message-add-btns" style="justify-content: flex-end;">
		    	<button class="button" id="messages-add-btn">Отправить</button>
		    </div>
		</div>`)
}


$(document).ready(() =>
{
	$(document).on('click', '#messages-add-btn', () =>
	{
		const text = $('#messages-add-area').val()
		if(!text.length)return false

		const id = getHrefAttrs().id
		if(id === undefined || isNaN(id) || id === null)return false

		loading.go()
		$.post('/messages/add', { id: id, text: text }, results =>
		{
			loading.stop()

			if(results === 'exit')return __removeAccCookies()
			if(results === 'error')return dialog.show('error', 'error', null, 'Не удалось отправить сообщение. Попробуйте перезагрузить страницу!')

			url.locate('/messages', '?id=' + id, { id: id })
		})
	})
})
