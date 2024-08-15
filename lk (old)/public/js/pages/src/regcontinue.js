import { loginData } from '../../other-pages/login.js'
import { url } from '../../main.js'

export default function renderRegContinuePage(data)
{
	$('.wrapper').html(`
		<div class="reg-c">
			<div class="reg-c-title">
				<h3>Создание аккаунта почти уже закончено...</h3>
				<span>Осталось совсем чуть-чуть поиграться с настройками и мы Вас отпустим</span>
			</div>

			<div class="reg-c-body">
				<div class="reg-c-body-item">
					<h4>
						Для начала выберите, какого пола будет Ваш персонаж?
						<span>Одежда будет выбрана рандомно</span>
					</h4>
					<div class="reg-c-body-btns reg-c-body-btns-sex">
						<button class="button" data-sex="0">Мужской</button>
						<button class="button" data-sex="1">Женский</button>
					</div>
				</div>
				<div class="reg-c-body-item">
					<h4>
						Теперь нужно указать, сколько лет Вашему персонажу:
						<span>От 18, до 85 лет</span>
					</h4>
					<div class="input-label">
						<input id="reg-c-body-input-age" type="text" placeholder=" " maxlength="2">
						<label for="reg-c-body-input-age">Пример: 18</label>
					</div>
				</div>
				<div class="reg-c-body-item">
					<h4>
						Ну и наконец, где в первый раз появится Ваш персонаж?
						<span>Это будет основным и главным спавном на продолжительное время<br>Изменить его можно будет в игре через /setspawn</span>
					</h4>
					<div class="reg-c-body-btns reg-c-body-btns-spawn">
						<div class="reg-c-body-img", data-spawn="0-0">
							<img src="./styles/images/spawns/ls1.jpg" alt="Спавн ЖДЛС">
							<span>ЖДЛС</span>
						</div>
						<div class="reg-c-body-img", data-spawn="0-1">
							<img src="./styles/images/spawns/ls2.jpg" alt="Спавн Автовокзал ЛС">
							<span>Автовокзал ЛС</span>
						</div>
						<div class="reg-c-body-img", data-spawn="0-2">
							<img src="./styles/images/spawns/ls3.jpg" alt="Спавн Аэропорт ЛС">
							<span>Аэропорт ЛС</span>
						</div>
						<div class="reg-c-body-img", data-spawn="1-0">
							<img src="./styles/images/spawns/lv1.jpg" alt="Спавн ЖДЛВ">
							<span>ЖДЛВ</span>
						</div>
						<div class="reg-c-body-img", data-spawn="1-1">
							<img src="./styles/images/spawns/lv2.jpg" alt="Спавн Автовокзал ЛВ">
							<span>Автовокзал ЛВ</span>
						</div>
						<div class="reg-c-body-img", data-spawn="1-2">
							<img src="./styles/images/spawns/lv3.jpg" alt="Спавн Аэропорт ЛВ">
							<span>Аэропорт ЛВ</span>
						</div>
						<div class="reg-c-body-img", data-spawn="2-0">
							<img src="./styles/images/spawns/sf1.jpg" alt="Спавн ЖДСФ">
							<span>ЖДСФ</span>
						</div>
						<div class="reg-c-body-img", data-spawn="2-1">
							<img src="./styles/images/spawns/sf2.jpg" alt="Спавн Автовокзал СФ">
							<span>Автовокзал СФ</span>
						</div>
						<div class="reg-c-body-img", data-spawn="2-2">
							<img src="./styles/images/spawns/sf3.jpg" alt="Спавн Аэропорт СФ">
							<span>Аэропорт СФ</span>
						</div>
					</div>
				</div>
			</div>
			<div class="reg-c-footer">
				<button class="button" id="reg-c-go">Закончить создание персонажа</button>
			</div>
		</div>`)
}

$(document).ready(() =>
{
	$(document).on('click', '.reg-c .reg-c-body-btns button', elem =>
	{
		$('.reg-c .reg-c-body-btns button').removeClass('button-select')
		$(elem.currentTarget).addClass('button-select')
	})
	$(document).on('input', '#reg-c-body-input-age', elem =>
	{
		const text = $(elem.currentTarget).val().replace(/[^\d]/, '')
		$(elem.currentTarget).val(text)
	})
	$(document).on('click', '.reg-c .reg-c-body-btns .reg-c-body-img', elem =>
	{
		$('.reg-c .reg-c-body-btns .reg-c-body-img').removeClass('reg-c-body-img-select')
		$(elem.currentTarget).addClass('reg-c-body-img-select')
	})
	$(document).on('click', "#reg-c-go", () =>
	{
		const
			sex = $('.reg-c .reg-c-body-btns-sex button.button-select').attr('data-sex'),
			age = $('#reg-c-body-input-age').val()
		let spawn = $('.reg-c .reg-c-body-btns-spawn .reg-c-body-img.reg-c-body-img-select').attr('data-spawn')

		if(spawn !== undefined) spawn = spawn.split('-')
		if(sex === undefined || age === undefined || spawn === undefined)return dialog.show('error', 'error', null, 'Заполните все поля для продолжения!')

		loading.go()
		$.post('/register/continue', { sex: sex, age: age, spawn: JSON.stringify(spawn) }, results =>
		{
			loading.stop()

			if(results === 'exit')return __removeAccCookies()
			if(results === 'error')return dialog.show('error', 'error', null, 'Не верно заполнены поля!')

			loginData.regContinue = 0
			url.locate()

			if(results !== 'no') dialog.show('success', 'success', null, 'Вы успешно закончили регистрацию аккаунта!')
		})
	})
})
