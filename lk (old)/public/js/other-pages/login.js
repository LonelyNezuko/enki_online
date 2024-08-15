export const loginData = {}

export function __removeAccCookies()
{
	var date = new Date()
	date.setTime(date.getTime() - 1)

	document.cookie = `login=; expires=${date.toGMTString()}`
	if(window.location.pathname !== '/login') window.location.href = "/login"
}
function __addAccCookies(data)
{
	document.cookie = `login=${JSON.stringify({ id: data.accID, pass: data.password, admin: data.admin, server: data.server })}`
	window.location.href = '/account'
}

$.post('/checklogin', {}, results =>
{
	if(results === false)
	{
		if(window.location.pathname !== '/login'
			&& window.location.pathname !== '/recovery') window.location.href = '/login'
		return false
	}
	if(results === 'removecookies')return __removeAccCookies()

	results = JSON.parse(results)

	loginData.id = results.id
	loginData.admin = results.admin
	loginData.name = results.name
	loginData.regContinue = results.regContinue
	loginData.server = results.server

	$('#header-item-account span').html(loginData.name)

	$(document).ready(() =>
	{
		if(loginData.admin > 0) $('.menu .menu-items[data-id="exit"]').before(`
			<div class="menu-items" data-id="managment">
				<a class="menu-item" href="/admin" data-menu-item-id="admin">
					<img src="/styles/images/menu/admin.png" />
					<span>Админка</span>
				</a>
			</div>`)
		if(loginData.admin >= 6) $('.menu .menu-items[data-id="managment"]').append(`
			<a class="menu-item" href="/admin/settings" data-menu-item-id="admin-settings">
				<img src="/styles/images/menu/admin-settings.png" />
				<span>Настройки доступа адм</span>
			</a>`)

		$(document).trigger('loginDataReady')
	})
})

if(window.location.pathname === '/login')
{
	const checkLogin = () =>
	{
		if($('.login-select').hasClass('login-recovery'))
		{
			return false
		}
		if($('.login-select').hasClass('login-reg'))
		{
			const
				login = $('#regName').val(),
				pass = $('#regPass').val(),
				email = $('#regEmail').val(),
				code = $('#regEmailCode').val()

			if(!login.length
				|| !pass.length
				|| !email.length)return $('.login-select .login-enter').attr('disabled', 'disabled')

			if($('.login-reg .login-input#regCode').css('display') !== 'none')
			{
				if(!code.length)return $('.login-select .login-enter').attr('disabled', 'disabled')

				loading.go()
				$.post('/register/code', { name: login, pass: pass, email: email, code: code }, results =>
				{
					loading.stop()

					if(results === 'exit')return window.location.href = "/account"
					if(results === 'error')return dialog.show('Ошибка!', 'error', null, "Что-то пошло не так. Попробуйте обновить страницу!")
					if(results === 'notfound')return dialog.show('Ошибка!', 'error', null, `Аккаунт <span style="color: #fda605;">${login}</span> уже существует!`)

					if(results === 'password not valid')return dialog.show('Ошибка!', 'error', null, "Не подходящий пароль. Используйте символы A-Z (a-z) и цифры 0-9!")
					if(results === 'email not valid')return dialog.show('Ошибка!', 'error', null, "Не корректный Email адрес.")

					if(results === 'code')return dialog.show('error', 'error', null, 'Не верный код!')
					if(results === 'code notfound')return dialog.show('error', 'error', null, 'Произошла ошибка! Перезагрузите страницу!')

					if(results === 'isemail')return dialog.show('error', 'error', null, 'Данный Email уже использован на другом аккаунте!')

					results.data.server = server
					__addAccCookies(JSON.parse(results))
				})
				return false
			}

			loading.go()
			$.post('/register', { name: login, pass: pass, email: email }, results =>
			{
				loading.stop()

				if(results === 'exit')return window.location.href = "/account"
				if(results === 'error')return dialog.show('Ошибка!', 'error', null, "Что-то пошло не так. Попробуйте еще раз!")
				if(results === 'notfound')return dialog.show('Ошибка!', 'error', null, `Аккаунт <span style="color: #fda605;">${login}</span> уже существует!`)

				if(results === 'password not valid')return dialog.show('Ошибка!', 'error', null, "Не подходящий пароль. Используйте символы A-Z (a-z) и цифры 0-9!")
				if(results === 'email not valid')return dialog.show('Ошибка!', 'error', null, "Не корректный Email адрес.")

				if(results === 'isemail')return dialog.show('error', 'error', null, 'Данный Email уже использован на другом аккаунте!')

				dialog.show('Ошибка!', 'success', null, `На Email <span style="color: #fda605;">${email}</span> был отправлен код подтверждения!<br>Вставьте данный код в строку ниже и нажмите Далее`)

				$('.login-reg .login-input#regCode input').attr('placeholder', " ")
				$('.login-reg .login-input#regCode').show()

				$('.login-reg .login-input#regCode').attr('disabled', 'disabled')
				checkInputs()

				$('.login-reg .login-enter').html('Далее')
			})

			return false
		}

		const
			login = $('#loginName').val(),
			pass = $('#loginPass').val(),
			server = $('#loginServer').attr('data-id')

		if(!login.length
			|| !pass.length
			|| server === undefined
			|| server < 0 || isNaN(server) || server === null)return $('#loginEnter').attr('disabled', 'disabled')

		loading.go()
		$.get(`/api?method=sha256&params[data]=${pass}`, sha256 =>
		{
			$.get(`/api?method=account_login&params[server]=${server}&params[nickname]=${login}&params[password]=${sha256.data.result}`, results =>
			{
				loading.stop()

				if(results.status === 'error')
				{
					switch(results.response)
					{
						case 'No secret key specified': return dialog.show('error', 'error', null, 'Ошибка индефикации проекта!')
						case 'Invalid server': return dialog.show('error', 'error', null, 'Не верный сервер')
						case 'No Nickname or Password specified': return dialog.show('Ошибка!', 'error', null, "Что-то пошло не так. Попробуйте еще раз!")
						case 'Account not found': return dialog.show('Ошибка!', 'error', null, `Аккаунт <span style="color: #fda605;">${login}</span> не найден на выбранном сервере!`)
						case 'Incorrect password': return dialog.show('Ошибка!', 'error', null, 'Не верный пароль!')
						default: return dialog.show('error', 'error', null, 'Неизвестная ошибка! Перезагрузите страницу!')
					}
					return false
				}
				
				results.data.server = server
				__addAccCookies(results.data)
			})
		})
	}

	$(document).ready(() =>
	{
		$('.wrapper').on('click', '.login-select .login-enter', () => checkLogin())
		$(window).keyup(e =>
		{
			if(e.which == 13
				&& !$('.login-select .login-enter').attr('disabled')) checkLogin()
		})
		$('.wrapper').on('input', '.login-select input', () => checkInputs())

		$('.login').on('click', elem =>
		{
			$('.login').removeClass('login-select')
			$(elem.currentTarget).addClass('login-select')

			checkInputs()
		})

		checkInputs()

		const cookiesCheck = localStorage.getItem('cookies-check')
		if(!cookiesCheck) $('.cookies-check').addClass('cookies-check-show')

		$('.cookies-check button').on('click', () =>
		{
			localStorage.setItem('cookies-check', '1')
			$('.cookies-check').removeClass('cookies-check-show')
		})

		$('.login .login-input-select .input-select div label').on('click', elem =>
		{
			const id = $(elem.currentTarget).attr('data-id')
			if(id === undefined || id < 0 || isNaN(id) || id === null)return false

			$(elem.currentTarget).parent().parent().find('span').text($(elem.currentTarget).text())
			$(elem.currentTarget).parent().parent().attr('data-id', id)

			checkInputs()
		})
	})

	function checkInputs()
	{
		const inputs = Array.from($('.login-select .login-input:not(:hidden) input'))
		let count = 0
		
		inputs.forEach(item => { if($(item).val() !== '') count ++ })

		let selectsCount = 0
		const selects = Array.from($('.login-select .login-input.login-input-select:not(:hidden) .input-select'))

		selects.forEach(item => { if($(item).attr('data-id') !== undefined) selectsCount ++ })

		if(count >= inputs.length
			&& selectsCount >= selects.length) $('.login-select .login-enter').removeAttr('disabled')
		else $('.login-select .login-enter').attr('disabled', 'disabled')
	}
}