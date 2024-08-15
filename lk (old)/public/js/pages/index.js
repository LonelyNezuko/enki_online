import { renderAccountPage, renderAccountSettingsPage } from './src/account.js'
import renderChangemailPage from './src/changemail.js'
import { renderReportPage, renderReportInfoPage, renderReportAddPage } from './src/report.js'
import { renderFindPage } from './src/find.js'
import { renderFractionPage, renderFractionAppPage, renderFractionAppsPage, renderFractionAppsEditPage, renderFractionAppFormPage, renderFractionAppsViewPage } from './src/fraction.js'
import { renderAdminPage, renderAdminPromoPage, renderAdminRealtyPage, renderAdminAccountPage, renderAdminReportPage, renderAdminSettingsPage } from './src/admin.js'
import { renderMessagesPage, renderMessagesNamePage } from './src/messages.js'
import { renderRoulettePage } from './roulette.js'

import renderErrorPage from './error.js'
import renderRegContinuePage from './src/regcontinue.js'

import { bugsMenu } from './bugs.js'

import { loginData } from '../other-pages/login.js'

export const page =
{
	render: (name, data = {}) =>
	{
		$('.wrapper').html('')

		if(name === 'regContinue') renderRegContinuePage()

		else if(name === 'account') renderAccountPage(data)
		else if(name === 'account-settings') renderAccountSettingsPage(data)

		else if(name === 'changemail') renderChangemailPage(data)

		else if(name === 'report') renderReportPage(data)
		else if(name === 'report/info') renderReportInfoPage(data)
		else if(name === 'report/add') renderReportAddPage(data)

		else if(name === 'find') renderFindPage(data)
		else if(name === 'find-error') renderFindPage(data)

		else if(name === 'fraction') renderFractionPage(data)
		else if(name === 'fraction-application') renderFractionAppPage(data)
		else if(name === 'fraction-application-form') renderFractionAppFormPage(data)
		else if(name === 'fraction-applications') renderFractionAppsPage(data)
		else if(name === 'fraction-applications-edit') renderFractionAppsEditPage(data)
		else if(name === 'fraction-applications-view') renderFractionAppsViewPage(data)

		else if(name === 'admin') renderAdminPage(data)
		else if(name === 'admin-promo') renderAdminPromoPage(data)
		else if(name === 'admin-realty') renderAdminRealtyPage(data)
		else if(name === 'admin-account') renderAdminAccountPage(data)
		else if(name === 'admin-report') renderAdminReportPage(data)
		else if(name === 'admin-settings') renderAdminSettingsPage(data)

		else if(name === 'messages') renderMessagesPage(data)
		else if(name === 'messages-id') renderMessagesNamePage(data)

		else if(name === 'roulette') renderRoulettePage(data)

		else if(name === 'error') renderErrorPage(data)

		$('.wrapper').scrollTop(0)
		// notfPage.show(`Уважаемые игроки, личный кабинет находится в разработке.<br>
		// 		По всем багам/ошибкам личного кабинета просьба сообщать на форум, в необходимую тему.<br><br>
		// 		<a href="http://forum.enki-rp.ru/index.php?forums/panel_bags/" target="_blank" class="button" style="padding: 10px 30px;">Открыть форум</a>`, 'global')

		// bugsMenu.render()

		// $('.wrapper').append(`
		// 	<div class="google-auth-wrap">
		// 		<div class="google-auth">
		// 			<div class="google-auth-title">Аунтификация</div>
		// 			<div class="google-auth-body">
		// 				<img src="/styles/images/google-auth.png" alt="Google Authenticator">
		// 				<div class="google-auth-desc">
		// 					На данном аккаунте установлен Google Authenticator.<br>
		// 					Введите одноразовый код с приложения Google Authenticator, чтобы продолжить пользоваться сайтом
		// 				</div>
		// 				<div class="google-auth-code">
		// 					<input type="text" autofocus placeholder="1" data-id="1">
		// 					<input type="text" disabled placeholder="2" data-id="2">
		// 					<input type="text" disabled placeholder="3" data-id="3">
		// 					<input type="text" disabled placeholder="4" data-id="4">
		// 					<input type="text" disabled placeholder="5" data-id="5">
		// 					<input type="text" disabled placeholder="6" data-id="6">
		// 				</div>
		// 				<div class="google-auth-error">
		// 					Ошибка! Не корректный код!
		// 				</div>
		// 			</div>
		// 		</div>
		// 	</div>`)

		// $('.wrapper').append(`
		// 	<div class="messages-create">
		// 		<div class="messages-create-left">

		// 		</div>
		// 		<div class="messages-create-right">
		// 		</div>
		// 	</div>`)
	}
}


$(document).ready(() =>
{
	$(document).on('input', '.google-auth-code input', elem =>
	{
		if($('.google-auth-code').hasClass('google-auth-code-error')
			|| $('.google-auth-error').hasClass('google-auth-error-anim'))
		{
			$('.google-auth-code').removeClass('google-auth-code-error')
			$('.google-auth-error').removeClass('google-auth-error-anim')
		}

		let number = $(elem.currentTarget).val().replace(/[^\d]/, '')
		if(number.length === 6)
		{
			number = number.toString().split('')

			$('.google-auth-code input').each((i, item) =>
			{
				$(item).attr('disabled', 'disabled')
				$(item).val(number[i])
			})

			goGoogleAuth()
			return false
		}
		if(number.length !== 1)return $(elem.currentTarget).val('')

		const id = parseInt($(elem.currentTarget).attr('data-id'))
		$(`.google-auth-code input[data-id="${id}"]`).attr('disabled', 'disabled')

		if(id == 6) goGoogleAuth()
		else
		{
			$(`.google-auth-code input[data-id="${id + 1}"]`).removeAttr('disabled')
			$(`.google-auth-code input[data-id="${id + 1}"]`).focus()
		}
	})

	function goGoogleAuth()
	{
		let number = ''
		$(`.google-auth-code input`).each((i, item) => number += $(item).val())
		if(number === undefined)return errorGoogleAuth('Не корректный код!')

		number = parseInt(number)
		if(isNaN(number))return errorGoogleAuth('Не корректный код!')

		$('.google-auth-code').trigger('google-auth-code-success', { code: number, data: $('.google-auth-code').attr('data-id') })
	}
})

export function errorGoogleAuth(message)
{
	$('.google-auth-code input').val('')
	$('.google-auth-code').addClass('google-auth-code-error')

	$('.google-auth-error').text(message)
	$('.google-auth-error').addClass('google-auth-error-anim')

	setTimeout(() =>
	{
		$('.google-auth-code').removeClass('google-auth-code-error')

		$(`.google-auth-code input[data-id="1"]`).removeAttr('disabled')
		$(`.google-auth-code input[data-id="1"]`).focus()
	}, 1100)
	setTimeout(() => $('.google-auth-error').removeClass('google-auth-error-anim'), 3000)
}
