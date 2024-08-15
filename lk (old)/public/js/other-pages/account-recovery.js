import { emailValid } from '../other.js'

$(document).ready(() =>
{
	$('#recoveryEnter').on('click', () =>
	{
		// return dialog.show('Ошибка', 'error', 0, `В данный момент не доступно!`)

		var
			name = $('#recoveryLogin').val(),
			email = $('#recoveryEmail').val()

		if(!name.length
			|| !email.length)return dialog.show("Ошибка", "error", 0, "Заполните поле с Ником и Почтой.")

		if(name.length > 24)return dialog.show('Ошибка', 'error', 0, 'Длина ника должна быть максимум 24 символа!')
		if(!emailValid(email))return dialog.show('Ошибка', 'error', 0, 'Не верно указана почта!')

		$.post('/recovery', { name: name, email: email }, results =>
		{
			if(results == 'error')return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте позже.`)
			if(results == 'notFound')return dialog.show('Ошибка', 'error', 0, `Аккаунт <span style="font-weigth: bold; font-style: italic;">${name}</span> с данной почтой не найден!`)

			$('#recoveryLogin, #recoveryEmail').attr('disabled', 'disabled')
			
			dialog.show('Код', 'input', 'account-recovery', `На Вашу почту ${email} было отправлено письмо с кодом. <br>Вставьте этот код сюда и нажмите 'Продолжить'`, "Отмена", "Продолжить", false)
			$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
			{
				if(data.dialogid !== 'account-recovery')return false
				accountRecoveryCheckCode(name, email, data.inputs[0])
			})
		})
	})
})

function accountRecoveryCheckCode(name, email, code)
{
	if(!code || code.length != 5)
	{
		$('#recoveryLogin, #recoveryEmail').removeAttr('disabled')
		return dialog.show('Ошибка', 'error', null, 'Не верный формат кода!')
	}

	$.post('/recovery/check', { name: name, email: email, code: parseInt(code) }, results =>
	{
		if(results == 'Не найдено')return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте восстановить заного!`) 
		if(results == 'Вышло время')return dialog.show('Ошибка', 'error', 0, `Вы слишком долго восстнавливали аккаунт. Попробуйте заного!`)
		if(results == 'Код не верный')return dialog.show('Ошибка', 'error', 0, `Вы не верно ввели код!`)

		dialog.show('Успешно', 'success', 0, `Вы успешно восстановили свой аккаунт! <br><br>Новый пароль был отправлен на почту ${email}. <br>Для изменения пароля перейдите в личный кабинет на сайте.`)
 		setTimeout(() => window.location.href = "/login", 10000)
	})
}
