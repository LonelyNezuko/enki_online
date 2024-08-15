export default function renderChangemailPage(data)
{
	$('.wrapper').html(`
		<div class="changemail-main">
		    <h3>Изменение почты</h3>
		    <div class="changemail-type"><button data-changemail-type-id="yes-mail">У меня есть доступ к старой почте</button><button data-changemail-type-id="no-mail">У меня нет доступа к старой почте</button></div>
		    <div class="changemail-wrap">
		        <div class="changemail-input-wrap" style="display: none;"></div>
		        <div class="changemail-btn" style="display: none;"><button id="changemail-accept">Изменить</button></div>
		    </div>
		</div>`)
}

var changemail =
{
	type: null,

	change: () =>
	{
		return dialog.show('Ошибка', 'error', 0, `В данный момент не работает!`)
		if(changemail.type == 'yes-mail')
		{
			var
				name = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"]').val(),
				mail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="2"]').val(),
				newMail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="3"]').val()

			if(!name.length
				|| !mail.length
				|| !newMail.length)return false

			if(mail == newMail)return dialog.show('Ошибка', 'error', 0, `Старая и новая почта совпадают!`)

			loading.go()
			$.post('/account/changemail', { nick: name, email: mail, newEmail: newMail, type: 'yes-mail' }, result =>
			{
				loading.stop()

				if(result == 'error')return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте позже.`)
				if(result == 'Аккаунт не найден')return dialog.show('Ошибка', 'error', 0, `Аккаунт ${name} с почтой ${mail} не найден!`)

				dialog.show('Информация', 'notf', 0, `На Вашу почту ${mail} было отправлено письмо с кодом. <br>Вставьте этот код в соответвующее поле.`)

				$('.changemail-btn button#changemail-accept').hide()
				$('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"], input[data-changemail-input-id="2"], input[data-changemail-input-id="3"]').attr('disabled', '')

				$('.changemail-wrap .changemail-input-wrap').append(`
					<div class="changemail-input" style="margin-top: 80px" data-changemail-input-id="code">
						<input type="text" id="changemail-input-code" placeholder=" " name="code" maxlength="5">
						<label for="changemail-input-code">Код подтверждения</label>
					</div>`)

				$('.changemail-type button').attr('disabled', '')
			})
		}
		else if(changemail.type == 'no-mail')
		{
			var
				name = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"]').val(),
				mail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="2"]').val(),
				newMail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="3"]').val(),
				desc = $('.changemail-wrap .changemail-input-wrap .changemail-input textarea').val()

			if(!name.length
				|| !mail.length
				|| !newMail.length
				|| !desc.length)return false

			if(mail == newMail)return dialog.show('Ошибка', 'error', 0, `Старая и новая почта совпадают!`)

			loading.go()
			$.post('/account/changemail', { nick: name, email: mail, newEmail: newMail, type: 'no-mail' }, result =>
			{
				loading.stop()

				if(result == 'error')return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте позже.`)
				if(result == 'Аккаунт не найден')return dialog.show('Ошибка', 'error', 0, `Аккаунт ${name} с почтой ${mail} не найден!`)
				if(result == 'Заявка уже есть')return dialog.show('Ошибка', 'error', 0, `Вы уже отправляли заявку на изменение почты. Ожидайте!`)

				dialog.show('Информация', 'notf', 0, `На Вашу новую почту ${newMail} было отправлено письмо с кодом. <br>Вставьте этот код в соответвующее поле.`)

				$('.changemail-btn button#changemail-accept').hide()
				$('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"], input[data-changemail-input-id="2"], input[data-changemail-input-id="3"], textarea').attr('disabled', '')

				$('.changemail-wrap .changemail-input-wrap').append(`
					<div class="changemail-input" style="margin-top: 80px" data-changemail-input-id="code">
						<input type="text" id="changemail-input-code" placeholder=" " name="code" maxlength="5">
						<label for="changemail-input-code">Код подтверждения</label>
					</div>`)

				$('.changemail-type button').attr('disabled', '')
			})
		}
	},
	check: () =>
	{
		return dialog.show('Ошибка', 'error', 0, `В данный момент не работает!`)
		if(changemail.type == null)return false

		if($('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"], input[data-changemail-input-id="2"], input[data-changemail-input-id="3"]').attr('disabled') != 'disabled')return false
		if($('.changemail-wrap .changemail-input-wrap .changemail-input #changemail-input-code').attr('disabled') == 'disabled')return false

		var code = $('.changemail-wrap .changemail-input-wrap .changemail-input #changemail-input-code').val()
		if(code.length != 5)return false

		if(changemail.type == 'yes-mail')
		{
			var
				name = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"]').val(),
				mail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="2"]').val(),
				newMail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="3"]').val()

			if(!name.length
				|| !mail.length
				|| !newMail.length)return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте позже.`)

			$('.changemail-wrap .changemail-input-wrap .changemail-input #changemail-input-code').removeAttr('disabled')
			loading.go()

			$.post('/account/changemail/check', { nick: name, email: mail, newEmail: newMail, type: 'yes-mail', code: code }, result =>
			{
				loading.stop()
				$('.changemail-wrap .changemail-input-wrap .changemail-input[data-changemail-input-id="code"]').remove()

				$('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"], input[data-changemail-input-id="2"], input[data-changemail-input-id="3"]').val('')
				$('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"], input[data-changemail-input-id="2"], input[data-changemail-input-id="3"]').removeAttr('disabled')

				$('.changemail-btn button#changemail-accept').removeClass('changemail-btn-select')
				$('.changemail-btn button#changemail-accept').show()

				$('.changemail-type button').removeAttr('disabled')

				if(result == 'error')return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте позже.`)
				if(result == 'Вышло время')return dialog.show('Ошибка', 'error', 0, `Вы слишком долго восстнавливали аккаунт. Попробуйте заного!`)
				if(result == 'Код не верный')return dialog.show('Ошибка', 'error', 0, `Вы не верно ввели код!`)
				
				dialog.show('Успешно', 'success', 0, `Вы успешно изменили почту на своем аккаунте! <br><br>Проверьте свою новую почту на наличие письма!`)
			})
		}
		else if(changemail.type == 'no-mail')
		{
			var
				name = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"]').val(),
				mail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="2"]').val(),
				newMail = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="3"]').val(),
				desc = $('.changemail-wrap .changemail-input-wrap .changemail-input textarea').val()

			if(!name.length
				|| !mail.length
				|| !newMail.length
				|| !desc.length)return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте позже.`)

			$('.changemail-wrap .changemail-input-wrap .changemail-input #changemail-input-code').removeAttr('disabled')
			loading.go()

			$.post('/account/changemail/check', { nick: name, email: mail, newEmail: newMail, type: 'no-mail', code: code, desc: desc }, result =>
			{
				loading.stop()
				$('.changemail-wrap .changemail-input-wrap .changemail-input[data-changemail-input-id="code"]').remove()

				$('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"], input[data-changemail-input-id="2"], input[data-changemail-input-id="3"], textarea').val('')
				$('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"], input[data-changemail-input-id="2"], input[data-changemail-input-id="3"], textarea').removeAttr('disabled')

				$('.changemail-btn button#changemail-accept').removeClass('changemail-btn-select')
				$('.changemail-btn button#changemail-accept').show()

				$('.changemail-type button').removeAttr('disabled')

				if(result == 'error')return dialog.show('Ошибка', 'error', 0, `Произошла ошибка! Попробуйте позже.`)
				if(result == 'Вышло время')return dialog.show('Ошибка', 'error', 0, `Вы слишком долго восстнавливали аккаунт. Попробуйте заного!`)
				if(result == 'Код не верный')return dialog.show('Ошибка', 'error', 0, `Вы не верно ввели код!`)
				
				dialog.show('Успешно', 'success', 0, `Вы успешно отправили заявку на изменение почты. <br>Заявка будет рассматриваться администрацией в течении 5ти рабочих дней.<br>Вердикт по изменению почты будет отправлен на Ваш новый Email ${newMail}`)
			})
		}
	}
}

$(document).ready(() =>
{
	$(document).on('input', '.changemail-wrap .changemail-input-wrap .changemail-input #changemail-input-code', changemail.check)
	$(document).on('click', '.changemail-wrap button#changemail-accept', changemail.change)

	$(document).on('input', '.changemail-wrap .changemail-input-wrap .changemail-input input, textarea', e =>
	{
		var
			input1 = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="1"]').val(),
			input2 = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="2"]').val(),
			input3 = $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="3"]').val()

		if(changemail.type == 'yes-mail')
		{
			if(input1.length
				&& input2.length
				&& input3.length) $('.changemail-wrap .changemail-btn button#changemail-accept').addClass('changemail-btn-select')
			else $('.changemail-btn button#changemail-accept').removeClass('changemail-btn-select')
		}
		else if(changemail.type == 'no-mail')
		{
			var input4 = $('.changemail-wrap .changemail-input-wrap .changemail-input textarea').val()

			if(input1.length
				&& input2.length
				&& input3.length
				&& input4.length) $('.changemail-wrap .changemail-btn button#changemail-accept').addClass('changemail-btn-select')
			else $('.changemail-btn button#changemail-accept').removeClass('changemail-btn-select')
		}
	})
	$(document).on('click', '.changemail-type button', e =>
	{
		if(changemail.type != null
			&& $('.changemail-wrap .changemail-input-wrap .changemail-input input[data-changemail-input-id="2"]').attr('disabled') == 'disabled')return false

		$('.changemail-btn button#changemail-accept').removeClass('changemail-btn-select')

		$('.changemail-type button').removeClass('changemail-type-select')
		$('.changemail-type').removeClass('changemail-type-up')

		$('.changemail-input-wrap').html('')

		$('.changemail-input-wrap').css('display', 'none')
		$('.changemail-btn').css('display', 'none')

		if(changemail.type == $(e.target).attr('data-changemail-type-id'))
		{
			changemail.type = null
			return false
		}
		changemail.type = $(e.target).attr('data-changemail-type-id')

		$('.changemail-type').addClass('changemail-type-up')
		$(e.target).addClass('changemail-type-select')

		if(changemail.type == 'yes-mail')
		{
			$('.changemail-input-wrap').append(`
				<br>
				<div class="changemail-input">
					<input type="text" id="changemail-input-nick" placeholder=" " name="name" data-changemail-input-id="1" disabled>
					<label for="changemail-input-nick">Ник аккаунта</label>
				</div>
				<div class="changemail-input">
					<input type="email" id="changemail-input-email" ,="" placeholder=" " name="email" data-changemail-input-id="2">
					<label for="changemail-input-email">Старая почта</label>
				</div>
				<div class="changemail-input">
					<input type="email" id="changemail-input-email-changed" ,="" placeholder=" " name="email" data-changemail-input-id="3">
					<label for="changemail-input-email-changed">Новая почта</label>
				</div>`)
		}
		if(changemail.type == 'no-mail')
		{
			$('.changemail-input-wrap').append(`
				<br>
				<div class="changemail-input">
					<input type="text" id="changemail-input-nick" placeholder=" " name="name" data-changemail-input-id="1" disabled>
					<label for="changemail-input-nick">Ник аккаунта</label>
				</div>
				<div class="changemail-input">
					<input type="email" id="changemail-input-email" placeholder=" " name="email" data-changemail-input-id="2">
					<label for="changemail-input-email">Старая почта</label>
				</div>
				<div class="changemail-input">
					<input type="email" id="changemail-input-email-changed" placeholder=" " name="email" data-changemail-input-id="3">
					<label for="changemail-input-email-changed">Новая почта</label>
				</div>
				<div class="changemail-input">
					<textarea name="desc" id="changemail-input-desc" autocomplete='off' placeholder="Опишите все, что знаете об аккаунте (данные регистрации, первая машина, первый дом, какие посты занимали и тд)"></textarea>
				</div>

				<div class="changemail-info">После отправки будет создана заявка на изменение почты.<br> Заявки рассматривает администрация в течении 5ти рабочих дней.<br> Администратор может отказать в заявке, если сочтет информацию недостоверной!</div>`)
		}

		$('.changemail-input-wrap').slideDown("slow")
		$('.changemail-btn').slideDown("slow")

		$('.wrapper').animate({
	        scrollTop: $(".changemail-btn").offset().top
	    }, 500);
	})
})