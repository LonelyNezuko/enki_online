import { loginData } from '../other-pages/login.js'
import { url } from '../main.js'

export const acp =
{
	antiFlood: 0,

	commands:
	{
		// Все команды
		player:
		{
			kick: (data) =>
			{
				$.post('/cmd', { cmd: 'player.kick', data: JSON.stringify(data) }, results =>
				{
					acp.removeLoad()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'cmdNotFound')return acp.sendLog('Команда не найдена!', { placeholder: "Ошибка сервера", color: 'red' })
					if(results === 'notrights')return acp.close()
					if(results === 'notadmin')return acp.sendLog('Вам не доступна данная команда', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'error')return acp.sendLog('Не верные атрибуты (id, reason)', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorID')return acp.sendLog('ID не может быть меньше 0', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorReason')return acp.sendLog('Длина причины 1 - 30 символов', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'playerNotFound')return acp.sendLog('Игрок не найден!', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'playerNotOnline')return acp.sendLog('Игрок не на сервере!', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'cooldown')return acp.sendLog('Вы слишком часто используете команды. Подождите!', { placeholder: "Сервер вернул", color: 'red' })

					acp.sendLog('Команда успешно выполнена.', { placeholder: "сервер вернул", color: "green" })
					// url.locate('/admin/account', `?id=${data[0]}`, { id: data[0] })
				})
			},
			mute: (data) =>
			{
				$.post('/cmd', { cmd: 'player.mute', data: JSON.stringify(data) }, results =>
				{
					acp.removeLoad()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'cmdNotFound')return acp.sendLog('Команда не найдена!', { placeholder: "Ошибка сервера", color: 'red' })
					if(results === 'notrights')return acp.close()
					if(results === 'notadmin')return acp.sendLog('Вам не доступна данная команда', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'error')return acp.sendLog('Не верные атрибуты (id, time, reason)', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorID')return acp.sendLog('ID не может быть меньше 0', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorReason')return acp.sendLog('Длина причины 1 - 30 символов', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorTime')return acp.sendLog('Время 1 - 600 минут', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'playerIsMute')return acp.sendLog('У игрока уже есть мут!', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'playerNotFound')return acp.sendLog('Игрок не найден!', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'cooldown')return acp.sendLog('Вы слишком часто используете команды. Подождите!', { placeholder: "Сервер вернул", color: 'red' })

					acp.sendLog('Команда успешно выполнена.', { placeholder: "сервер вернул", color: "green" })
					// url.locate('/admin/account', `?id=${data[0]}`, { id: data[0] })
				})
			},
			warn: (data) =>
			{
				$.post('/cmd', { cmd: 'player.warn', data: JSON.stringify(data) }, results =>
				{
					acp.removeLoad()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'cmdNotFound')return acp.sendLog('Команда не найдена!', { placeholder: "Ошибка сервера", color: 'red' })
					if(results === 'notrights')return acp.close()
					if(results === 'notadmin')return acp.sendLog('Вам не доступна данная команда', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'error')return acp.sendLog('Не верные атрибуты (id, reason)', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorID')return acp.sendLog('ID не может быть меньше 0', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorReason')return acp.sendLog('Длина причины 1 - 30 символов', { placeholder: "Сервер вернул", color: 'red' })
						
					if(results === 'playerNotFound')return acp.sendLog('Игрок не найден!', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'cooldown')return acp.sendLog('Вы слишком часто используете команды. Подождите!', { placeholder: "Сервер вернул", color: 'red' })

					acp.sendLog('Команда успешно выполнена.', { placeholder: "сервер вернул", color: "green" })
					// url.locate('/admin/account', `?id=${data[0]}`, { id: data[0] })
				})
			},
			jail: (data) =>
			{
				$.post('/cmd', { cmd: 'player.jail', data: JSON.stringify(data) }, results =>
				{
					acp.removeLoad()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'cmdNotFound')return acp.sendLog('Команда не найдена!', { placeholder: "Ошибка сервера", color: 'red' })
					if(results === 'notrights')return acp.close()
					if(results === 'notadmin')return acp.sendLog('Вам не доступна данная команда', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'error')return acp.sendLog('Не верные атрибуты (id, time, reason)', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorID')return acp.sendLog('ID не может быть меньше 0', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorReason')return acp.sendLog('Длина причины 1 - 30 символов', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorTime')return acp.sendLog('Время 1 - 600 минут', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'playerIsJail')return acp.sendLog('Игрок уже сидит в деморгане', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'playerNotFound')return acp.sendLog('Игрок не найден!', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'cooldown')return acp.sendLog('Вы слишком часто используете команды. Подождите!', { placeholder: "Сервер вернул", color: 'red' })

					acp.sendLog('Команда успешно выполнена.', { placeholder: "сервер вернул", color: "green" })
					// url.locate('/admin/account', `?id=${data[0]}`, { id: data[0] })
				})
			},
			ban: (data) =>
			{
				$.post('/cmd', { cmd: 'player.ban', data: JSON.stringify(data) }, results =>
				{
					acp.removeLoad()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'cmdNotFound')return acp.sendLog('Команда не найдена!', { placeholder: "Ошибка сервера", color: 'red' })
					if(results === 'notrights')return acp.close()
					if(results === 'notadmin')return acp.sendLog('Вам не доступна данная команда', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'error')return acp.sendLog('Не верные атрибуты (id, time, reason)', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorID')return acp.sendLog('ID не может быть меньше 0', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorReason')return acp.sendLog('Длина причины 1 - 30 символов', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'errorTime')return acp.sendLog('Время 1 - 90 дней', { placeholder: "Сервер вернул", color: 'red' })

					if(results === 'playerIsBan')return acp.sendLog('Игрок уже заблокирован', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'playerNotFound')return acp.sendLog('Игрок не найден!', { placeholder: "Сервер вернул", color: 'red' })
					if(results === 'cooldown')return acp.sendLog('Вы слишком часто используете команды. Подождите!', { placeholder: "Сервер вернул", color: 'red' })

					acp.sendLog('Команда успешно выполнена.', { placeholder: "сервер вернул", color: "green" })
					// url.locate('/admin/account', `?id=${data[0]}`, { id: data[0] })
				})
			}
		}
	},

	formatCommand: (command) =>
	{
		const firstCMD = command.split('.')[0]

		let
			secondCMD = command.split('.')[1],
			attrs = command.split('(')[1] || []

		if(secondCMD) secondCMD = secondCMD.split('(')[0]

		if(attrs.length) attrs = attrs.split(')')[0]
		if(attrs.length) attrs = attrs.split(',')
		
		if(attrs.length)
		{
			attrs = attrs.reduce((accumulator, currentValue) =>
			{
			    const item = currentValue.trim()

			    if(item !== '') accumulator.push(item);

			    return accumulator;
			}, [])
		}

		return { first: firstCMD, second: secondCMD, attrs: attrs }
	},
	getCommand: (command) =>
	{
		// Поиск команды

		const
			firstCMD = acp.formatCommand(command).first,
			secondCMD = acp.formatCommand(command).second

		if(!acp.commands[firstCMD])return false
		if(!acp.commands[firstCMD][secondCMD])return false

		return true
	},
	goCommand: (command) =>
	{
		// Выполнение команды
		if(command == '' || acp.antiFlood > new Date().getTime())return false

		acp.sendLog(command)
		acp.antiFlood = new Date().getTime() + 1000

		$('#adm-panel-input').val('')
		const cmd = acp.formatCommand(command)

		if(!acp.getCommand(command))
		{
			acp.sendLog('Команда не найдена', { placeholder: "Сервер вернул", color: "red" })
			return false
		}

		acp.setLoad()
		acp.commands[cmd.first][cmd.second](cmd.attrs)

		// player.test(1, 0, 'test')

		return true
	},
	// hintCommand: (command) =>
	// {
	// 	const cmd = acp.formatCommand(command)
	// 	let
	// 		firsts = [],
	// 		seconds = []

	// 	if(acp.first)
	// 	{
	// 		for(key in acp.commands)
	// 		{
	// 			if(acp.first === acp.commands[key])
	// 			{
	// 				firsts.push(acp.commands[key])
	// 			}
	// 		}
	// 	}
	// },

	setLoad: () =>
	{
		// Визуальная загрузка

		$('.adm-panel').prepend(`<div class="adm-panel-desc"></div>`)
		loading.go({ type: "point", parent: '.adm-panel-desc', set: false, position: { top: "50%", left: "50%", "transform": "translate(-50%, -50%)" } })

		$('.adm-panel .adm-panel-desc').addClass('adm-panel-desc-show')
		$('#adm-panel-input').blur()
	},
	removeLoad: () =>
	{
		// Удаление визуальной загрузки

		loading.stop({ type: 'point', parent: '.adm-panel-desc' })
		$('.adm-panel .adm-panel-desc').remove()

		$('#adm-panel-input').focus()
	},

	sendLog: (text, data = {}) =>
	{
		// Вывод сообщения в лог

		if(!$('*').is('.adm-panel .adm-panel-logs'))
		{
			$('.adm-panel').append(`
				<div class="adm-panel-logs">
		            <div class="adm-panel-logs-title">
		                <h4>Логи</h4>
		                <button id="adm-panel-btn-logs-clear">Очистить логи</button>
		            </div>
		            <div class="adm-panel-log"></div>
		        </div>`)
			$('#adm-panel-btn-logs-clear').unbind().on('click', acp.clearLog)
		}

		$('.adm-panel .adm-panel-logs .adm-panel-log').append(`
			<div>
				<span ${data.color ? `style='color: ${data.color}';` : ""}>${data.placeholder ? data.placeholder : new Date().getHours() + ":" + new Date().getMinutes()}</span> ${text}
			</div>`)

		$('.adm-panel .adm-panel-logs .adm-panel-log').scrollTop($('.adm-panel .adm-panel-logs .adm-panel-log').height())
	},
	clearLog: () =>
	{
		// Очистка лога

		$('.adm-panel .adm-panel-logs').remove()
	},

	open: (command = null) =>
	{
		// Открытие панели

		$('body').prepend(`
			<div class="adm-panel-wrap">
			    <div class="adm-panel">
			        <div class="adm-panel-title">Админка</div>
			        <div class="adm-panel-hint">
			            <h4>Подсказка</h4>
			            <span>Начните вводить команду</span>
			        </div>
			        <div class="adm-panel-body">
			            <div class="adm-panel-body-input">
			            	<input id="adm-panel-input" type="text" placeholder="Команда" autofocus="autofocus" ${command !== null ? `value="${command}"` : ""} />
			            </div>
			            <div class="adm-panel-body-btn">
			            	<button id="adm-panel-btn-success">Выполнить</button>
			            	<button id="adm-panel-btn-help">Доступные команды</button>
			            	<button id="adm-panel-btn-close">Закрыть</button>
			            </div>
			        </div>
			    </div>
			</div>`)

		$('#adm-panel-btn-close').unbind().on('click', acp.close)
		$('#adm-panel-btn-success').unbind().on('click', acp.go)
		$('#adm-panel-btn-help').unbind().on('click', acp.help)

		// $('#adm-panel-input').unbind().on('input', elem =>
		// {
		// 	const element = $(elem.target)
		// 	if(element.val().length > 1)
		// 	{
		// 		// console.log(element.val())
		// 		// const cmd = acp.getCommand(element.val())

		// 		// if(!cmd) $('.adm-panel-hint span').text('Команда не найдена')
		// 		// else
		// 		// {

		// 		// }
		// 	}
		// 	else $('.adm-panel-hint span').text('Начните вводить команду')
		// })
	},
	close: () =>
	{
		// Закрытие панели
		$('.adm-panel-wrap').remove()
	},
	help: () =>
	{
		// Окно с командами

		$('.adm-panel').prepend(`<div class="adm-panel-desc adm-panel-help">
				<div>
					<span>Команда</span>
					<span>Уровень доступа</span>
				</div>
			</div>`)
		for(var key in acp.commands)
		{
			const
				name = key,
				attrs = `${acp.commands[key]}`.substring(0, `${acp.commands[key]}`.indexOf(" =>"))
			
			$('.adm-panel .adm-panel-desc.adm-panel-help').append(`
				<div>
					<span>${name}${attrs}</span>
					<span>1</span>
				</div>`)
		}
		$('.adm-panel .adm-panel-desc.adm-panel-help').append('<button>Закрыть</button>')

		$('.adm-panel .adm-panel-desc').addClass('adm-panel-desc-show')
		$('#adm-panel-input').blur()

		$('.adm-panel .adm-panel-desc.adm-panel-help button').unbind().on('click', () =>
		{
			$('.adm-panel .adm-panel-desc.adm-panel-help').remove()
			$('#adm-panel-input').focus()
		})
	},

	go: () =>
	{
		const command = $('#adm-panel-input').val()
		if(command.length >= 1) acp.goCommand(command)
	}
}

$(document).ready(() =>
{
	$(document).keyup(elem =>
	{
		if(elem.which === 13
			&& $('#adm-panel-input').is(':focus')) acp.goCommand($('#adm-panel-input').val())
	})
})