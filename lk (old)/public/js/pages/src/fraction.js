import { url } from '../../main.js'
import { loginData } from '../../other-pages/login.js'

export function renderFractionAppsViewPage(data)
{
	data.app.appForms = JSON.parse(data.app.appForms)

	$('.wrapper').html(`
		<div class="report-title">
		    <h1>Анкета #${data.app.appID}</h1>

		    <div>
		    	<a class="button" href="/fraction/applications" style="background-color: silver;">Назад</a>
		    </div>
		</div>

		<div class="fr-apps-flex" style="display: flex; justify-content: space-around; align-items: flex-start; flex-wrap: wrap;">
			<div class="fr-apps" style="display: block;">
			    <div class="fr-apps-box" style="width: 350px;">
			        <div class="fr-apps-title">Анкета</div>
			    </div>
			</div>
		</div>`)

	var spawnNames = "Неизвество"

	if(!data.account.pSetSpawn) spawnNames = "Стандартный"
	else if(data.account.pSetSpawn == 1) spawnnames = "Фракция"
	else if(data.account.pSetSpawn == 2) spawnnames = "Бизнес"
	else if(data.account.pSetSpawn == 3) spawnnames = "Дом"

	if(data.account.pSetSpawnAdm) spawnNames = "Личный"

	var weddingName = "Неимеется"
	if(data.account.pWedding != -1) weddingName = `Имеется (с ${data.account.pWeddingName.replace("_", " ")})`

	data.account.pSkills = data.account.pSkills.split(',')

	$('.fr-apps-flex').append(`
		<div class="account-mains" style="min-width: 450px; width: 650px; padding: 0">
			<div class="account-main" style="width: calc(100% - 60px);">
				<div class="account-main-info">
					<div class="account-info-skin">
						<span class="account-info-skin-nam">${data.account.pName.replace("_", " ")}</span>

						<div class="account-info-skin-img">
							<img src="/styles/images/skins/${data.account.pSkin}.png" alt="Скин ${data.account.pSkin} ID">
						</div>

						<div class="account-info-skin-img-bars">
							<div class="account-info-skin-img-bar">
								<div class="account-info-skin-img-bar-text">
									<h3>Здоровье</h3>
									<span>${data.account.pHealth.toFixed(1)}%</span>
								</div>

								<div class="account-info-skin-img-bar-line">
									<i style="width: ${data.account.pHealth.toFixed(1)}%"></i>
								</div>
							</div>

							<div class="account-info-skin-img-bar">
								<div class="account-info-skin-img-bar-text">
									<h3>Сытость</h3>
									<span>${data.account.pSatiety.toFixed(1)}%</span>
								</div>

								<div class="account-info-skin-img-bar-line" style="box-shadow: inset 0 0 0 2px #e3e300;">
									<i style="width: ${data.account.pSatiety.toFixed(1)}%; background-color: #e3e300;"></i>
								</div>
							</div>

							<div class="account-info-skin-img-bar">
								<div class="account-info-skin-img-bar-text">
									<h3>Жажда</h3>
									<span>${data.account.pThirst.toFixed(1)}%</span>
								</div>

								<div class="account-info-skin-img-bar-line" style="box-shadow: inset 0 0 0 2px #00ffff;">
									<i style="width: ${data.account.pThirst.toFixed(1)}%; background-color: #00ffff;"></i>
								</div>
							</div>
						</div>
					</div>

					<div class="account-info">
						<div class="account-info-box">
							<h1 class="account-info-box-title">ID аккаунта</h1>
							<span class="account-info-box-desc">${data.account.pID}</span>
						</div>

						<div class="account-info-box">
							<h1 class="account-info-box-title">Игровой уровень</h1>
							<span class="account-info-box-desc">${data.account.pLevel}</span>
						</div>

						<div class="account-info-box">
							<h1 class="account-info-box-title">Опыта</h1>
							<span class="account-info-box-desc">${data.account.pExp} / ${(data.account.pLevel + 1) * 4}</span>
						</div>

						<div class="account-info-box">
							<h1 class="account-info-box-title">Наличные</h1>
							<span class="account-info-box-desc">${data.account.pCash.toLocaleString()} $</span>
						</div>

						<div class="account-info-box">
							<h1 class="account-info-box-title">Банковская карта</h1>
							<span class="account-info-box-desc">${data.account.pBankCash.toLocaleString()} $</span>
						</div>

						<div class="account-info-box">
							<h1 class="account-info-box-title">Депозитный счет</h1>
							<span class="account-info-box-desc">${data.account.pDeposit.toLocaleString()} $</span>
						</div>
					</div>
				</div>
			</div>

			<div class="account-main" style="width: calc(100% - 60px);">
				<div class="account-main-other" style="width: 100%;">
					<h1>Прочее</h1>

					<div class="account-main-other-item">
						<span>Пол</span>
						<span>${!data.account.pSex ? "Мужской" : "Женский"}</span>
					</div>
					<div class="account-main-other-item">
						<span>Предупреждений</span>
						<span>${data.account.pWarn}</span>
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
						${data.account.pOnline != -1 ? "<span style='color: green'>Онлайн</span>" : `<span>${new Date(data.account.pLastEnter).toLocaleString()}</span>`}
					</div>
					<div class="account-main-other-item">
						<span>Промокод</span>
						${data.account.pPromoName == '-' ? "<span>Неимеется</span>" : `<span>${data.account.pPromoName.name}</span>`}
					</div>
				</div>
			</div>

			<div class="account-main" style="width: calc(100% - 60px);">
			    <div class="account-main-skills" style="justify-content: space-around;">
			        <h1>Навыки владения оружием</h1>

			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="0"><img src="/styles/images/weapons/24.png" alt="Оружие Desert Eagle" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[2] == 999 ? "100" : parseInt(data.account.pSkills[2] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[2] == 999 ? "100" : parseInt(data.account.pSkills[2] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="1"><img src="/styles/images/weapons/25.png" alt="Оружие Shotgun" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[3] == 999 ? "100" : parseInt(data.account.pSkills[3] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[3] == 999 ? "100" : parseInt(data.account.pSkills[3] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="2"><img src="/styles/images/weapons/26.png" alt="Оружие Sawnoff Shotgun" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[4] == 999 ? "100" : parseInt(data.account.pSkills[4] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[4] == 999 ? "100" : parseInt(data.account.pSkills[4] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="3"><img src="/styles/images/weapons/27.png" alt="Оружие Spas12 Shotgun" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[5] == 999 ? "100" : parseInt(data.account.pSkills[5] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[5] == 999 ? "100" : parseInt(data.account.pSkills[5] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="4"><img src="/styles/images/weapons/28.png" alt="Оружие Micro UZI" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[7] == 999 ? "100" : parseInt(data.account.pSkills[6] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[7] == 999 ? "100" : parseInt(data.account.pSkills[6] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="5"><img src="/styles/images/weapons/29.png" alt="Оружие MP5" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[8] == 999 ? "100" : parseInt(data.account.pSkills[7] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[8] == 999 ? "100" : parseInt(data.account.pSkills[7] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="6"><img src="/styles/images/weapons/30.png" alt="Оружие AK47" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[9] == 999 ? "100" : parseInt(data.account.pSkills[8] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[9] == 999 ? "100" : parseInt(data.account.pSkills[8] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="7"><img src="/styles/images/weapons/31.png" alt="Оружие M4" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[0] == 999 ? "100" : parseInt(data.account.pSkills[9] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[0] == 999 ? "100" : parseInt(data.account.pSkills[9] / 10)}%</span>
			        </div>
			        <div style="width: calc(100% / 2 - 40px);" class="account-main-skills-item" data-skills-weapon-id="8"><img src="/styles/images/weapons/33.png" alt="Оружие SniperRifle" />
			            <div class="account-main-skills-item-line"><i style="width: ${data.account.pSkills[2] == 999 ? "100" : parseInt(data.account.pSkills[10] / 10)}%;"></i></div><span class="account-main-skills-item-info">${data.account.pSkills[2] == 999 ? "100" : parseInt(data.account.pSkills[10] / 10)}%</span>
			        </div>
			    </div>
			</div>
		</div>`)

	data.app.appForms.forEach((item, i) =>
	{
		if(item.type === 'input')
		{
			$('.fr-apps-box').append(`
				<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="input">
				    <div class="fr-apps-form-title">
				    	<h2>${item.name}</h2>
				    	${item.important ? "<span>*</span>" : ""}
				    </div>
				    <input class="input" type="text" placeholder="Введите ответ" value="${item.value}" disabled />
				</div>`)
		}
		else if(item.type === 'radio' || item.type === 'checkbox')
		{
			$('.fr-apps-box').append(`
				<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="radio">
				    <div class="fr-apps-form-title">
				    	<h2>${item.name}</h2>
				    	${item.important ? "<span>*</span>" : ""}
				    </div>
				</div>`)

			item.value.forEach((elemItem, elemI) =>
			{
				$(`.fr-apps-box .fr-apps-form[data-fr-apps-form-id="${i}"]`).append(`
					<div class="fr-apps-form-label" data-fr-apps-form-${item.type}-id="${elemI}">
				    	<input class="${item.type}" type="${item.type}" name="fr-apps-form-${item.type}-${i}" ${elemItem.checked ? 'checked="checked"' : ''}, disabled />
				    	<label>${elemItem.value}</label>
				    </div>`)
			})
		}
	})

	$('.fr-apps-box').append(`
	    <div style="width: 100%; margin-top: 50px; display: flex; justify-content: space-around;">
	    	<button class="button" id="fr-apps-form-cancel" style="background-color: #fc6b6b;">Отклонить</button>
		    <button class="button" id="fr-apps-form-accept">Принять</button>
		</div>`)
}

export function renderFractionAppFormPage(data)
{
	var
		urlData = new URL(window.location.href),
		attrs = {}

	for(var value of new URLSearchParams(urlData.search.split('?')[1])) attrs[value[0]] = value[1]
	if(attrs.frac == undefined
		|| window.location.pathname != '/fraction/application')return url.locate('/fraction/application')

	$('.wrapper').html(`
		<div class="report-title">
		    <h1>Анкета на вступление в ${attrs.frac}</h1>

		    <div>
		    	<a class="button" href="/fraction/application" style="background-color: silver;">Назад</a>
		    </div>
		</div>

		<div class="fr-apps">
		    <div class="fr-apps-box">
		        <div class="fr-apps-title">Анкета</div>
		    </div>
		</div>`)

	data.forEach((item, i) =>
	{
		if(item.type === 'input')
		{
			$('.fr-apps-box').append(`
				<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="input">
				    <div class="fr-apps-form-title">
				    	<h2>${item.name}</h2>
				    	${item.important ? "<span>*</span>" : ""}
				    </div>
				    <input class="input" type="text" placeholder="Введите ответ" />
				</div>`)
		}
		else if(item.type === 'checkbox' || item.type === 'radio')
		{
			$('.fr-apps-box').append(`
				<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="${item.type}">
				    <div class="fr-apps-form-title">
				    	<h2>${item.name}</h2>
				    	${item.important ? "<span>*</span>" : ""}
				    </div>
				</div>`)

			item.elements.forEach((elemItem, elemI) =>
			{
				$(`.fr-apps-box .fr-apps-form[data-fr-apps-form-id="${i}"]`).append(`
					<div class="fr-apps-form-label" data-fr-apps-form-${item.type}-id="${elemI}">
				    	<input class="${item.type}" type="${item.type}" name="fr-apps-form-${item.type}-${i}" ${!elemI ? 'checked="checked"' : ''} />
				    	<label>${elemItem.name}</label>
				    </div>`)
			})
		}
	})

	$('.fr-apps-box').append(`
	    <div style="width: 100%; margin-top: 50px; display: flex; justify-content: flex-end;">
		    <button class="button" id="fr-app-form-go">Отправить анкету</button>
		</div>`)
}


const frAppEdit =
{
	showMenu: () =>
	{
		if(!$('*').is('.fr-apps-form.fr-apps-form-edit'))return false

		const
			id = $('.fr-apps-form.fr-apps-form-edit').attr('data-fr-apps-form-id'),
			type = $('.fr-apps-form.fr-apps-form-edit').attr('data-fr-apps-form-type')

		if(!id || isNaN(id))return false

		const
			name = $('.fr-apps-form.fr-apps-form-edit .fr-apps-form-title h2').text(),
			important = $('*').is('.fr-apps-form.fr-apps-form-edit .fr-apps-form-title span')

		$('.fr-apps-box-menu').append(`
			<div class="fr-apps-edit" data-fr-apps-edit-id="${id}">
			    <div class="fr-apps-edit-item">
			    	<label for="fr-apps-edit-title">${name}</label>
			    	<input class="input" id="fr-apps-edit-title" type="text" placeholder=" " value="${name}" maxlength="40" />
			    </div>
			    <div class="fr-apps-edit-item">
			    	<label for="fr-apps-edit-important">Обязательно для заполнения</label>
			    	<input class="switch" id="fr-apps-edit-important" type="checkbox" ${important ? "checked" : ""} />
			    </div>
			</div>`)

		if(type === 'radio' || type === 'checkbox')
		{
			const elements = $.makeArray($('.fr-apps-form.fr-apps-form-edit .fr-apps-form-label'))
			elements.forEach(item =>
			{
				const
					elem = $(item),

					radioID = elem.attr(`data-fr-apps-form-${type}-id`),
					name = elem.find('label').text()

				$('.fr-apps-box-menu .fr-apps-edit').append(`
					<div class="fr-apps-edit-item">
						<input class="${type}" type="${type}" disabled="disabled" />
						<input class="input fr-apps-edit-elem" type="text" data-fr-apps-edit-elem-id="${radioID}" data-fr-apps-edit-elem-type="${type}" placeholder=" " value="${name}" maxlength="30" />
						<button class="button fr-apps-edit-delete-elem" data-fr-apps-edit-elem-id="${radioID}" data-fr-apps-edit-elem-type="${type}">Удалить</button>
					</div>`)
			})

			$('.fr-apps-box-menu .fr-apps-edit').append(`
				<div class="fr-apps-edit-item">
					<button class="button" id="fr-apps-edit-elem-add" data-fr-apps-edit-elem-type="${type}">Добавить</button>
				</div>`)
		}

		$('.fr-apps-box-menu .fr-apps-edit').append(`
				<div class="fr-apps-edit-item" style="justify-content: flex-end; margin-top: 60px;">
					<button class="button" id="fr-apps-edit-delete">Удалить</button>
				</div>`)
	},
	hideMenu: () =>
	{
		$('.fr-apps-box-menu .fr-apps-edit').remove()
	},
	deleteForm: () =>
	{
		const elements = $.makeArray($(`.fr-apps-form`))
		elements.forEach(item =>
		{
			const elem = $(item)
			if(parseInt(elem.attr('data-fr-apps-form-id')) > $(`.fr-apps-form.fr-apps-form-edit`).attr('data-fr-apps-form-id')) elem.attr('data-fr-apps-form-id', `${parseInt(elem.attr('data-fr-apps-form-id')) - 1}`)
		})

		$(`.fr-apps-form.fr-apps-form-edit`).remove()
		frAppEdit.hideMenu()
	}
}


export function renderFractionAppsEditPage(data)
{
	$('.wrapper').html(`
		<div class="report-title">
		    <h1>Редактирование анкеты</h1>

		    <div>
		    	<button class="button" id="fr-apps-edit-save" style="margin-right: 10px;">Сохраннить изменения</button>
		    	<a class="button" href="/fraction/applications" style="background-color: silver;">Назад</a>
		    </div>
		</div>

		<div class="fr-apps">
		    <div class="fr-apps-box fr-apps-box-edit">
		        <div class="fr-apps-title">Анкета</div>
		    </div>

		    <div class="fr-apps-box fr-apps-box-menu">
		        <div class="fr-apps-title">Управление</div>
		        <div class="fr-apps-edit-add">
		        	<button class="button" id="fr-apps-edit-add-input">Добавить поле для ввода</button>
		        	<button class="button" id="fr-apps-edit-add-radio">Добавить радио кнопки</button>
		        	<button class="button" id="fr-apps-edit-add-checkbox">Добавить checkbox кнопки</button>
		        </div>
		    </div>
		</div>`)

	data.forEach((item, i) =>
	{
		if(item.type === 'input')
		{
			$('.fr-apps-box-edit').append(`
				<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="input">
				    <div class="fr-apps-form-title">
				    	<h2>${item.name}</h2>
				    	${item.important ? "<span>*</span>" : ""}
				    </div>
				    <input class="input" type="text" placeholder="Введите ответ" />
				</div>`)
		}
		else if(item.type === 'checkbox' || item.type === 'radio')
		{
			$('.fr-apps-box-edit').append(`
				<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="${item.type}">
				    <div class="fr-apps-form-title">
				    	<h2>${item.name}</h2>
				    	${item.important ? "<span>*</span>" : ""}
				    </div>
				</div>`)

			item.elements.forEach((elemItem, elemI) =>
			{
				$(`.fr-apps-box-edit .fr-apps-form[data-fr-apps-form-id="${i}"]`).append(`
					<div class="fr-apps-form-label" data-fr-apps-form-${item.type}-id="${elemI}">
				    	<input class="${item.type}" type="${item.type}" name="fr-apps-form-${item.type}-${i}" ${!elemI ? 'checked="checked"' : ''} />
				    	<label>${elemItem.name}</label>
				    </div>`)
			})
		}
	})

	// <div class="fr-apps-box">
 //        <div class="fr-apps-title">Цвета</div>
 //        <div id="fr-apps-edit-color-sel"></div>
 //        <div id="fr-apps-edit-color" style="width: 100%; display: flex; justify-content: center; margin-top: 30px;"></div>
 //    </div>

	// $('#fr-apps-edit-color').farbtastic(color =>
	// {
	// 	const type = $('#fr-apps-edit-color-sel').attr('data-select-type')

	// 	if(type === 'Фон') $('.fr-apps-box.fr-apps-box-edit').css('background-color', color)
	// 	else if(type === 'Поля для ввода') $('.fr-apps-box.fr-apps-box-edit input[type="text"]').css('background-color', color)
	// 	else if(type === 'Текст ввода') $('.fr-apps-box.fr-apps-box-edit input[type="text"]').css('color', color)
	// 	else if(type === 'Обводка ввода') $('.fr-apps-box.fr-apps-box-edit input[type="text"]').css('border-color', color)
	// 	else if(type === 'Заголовки форм') $('.fr-apps-box.fr-apps-box-edit .fr-apps-form .fr-apps-form-title').css('color', color)
	// 	else if(type === 'Главный заголовок') $('.fr-apps-box.fr-apps-box-edit .fr-apps-title').css('color', color)
	// 	else if(type === 'Цвет чекбоксов и радио кнопок')
	// 	{
	// 		$('.fr-apps-box.fr-apps-box-edit input[type="checkbox"], .fr-apps-box.fr-apps-box-edit input[type="radio"]').css('border-color', color)
	// 		$('.fr-apps-box.fr-apps-box-edit input[type="checkbox"]:checked:before').css('background-color', color)
	// 	}

	// })
 //    select.add('#fr-apps-edit-color-sel', [ 'Фон', 'Поля для ввода', 'Текст ввода', 'Обводка ввода', 'Заголовки форм', 'Главный заголовок', 'Цвет чекбоксов и радио кнопок' ], { defaultName: 'Фон' })
}

export function renderFractionAppsPage(data)
{
	$('.wrapper').html(`
		<div class="report-title">
			<h1>Управление заявками</h1>
			<a href="/fraction/applications/edit" class="button">Редактировать анкету</a>
		</div>

		<div class="fraction">
		    <div class="fraction-div">
		        <div class="fraction-box">
		        	<h2>Настройки</h2>
		        	<div class="fraction-info fraction-info-flex">
		        		<span>Включить заявления через сайт?</span>
						<input type="checkbox" id="fraction-apps-settings-status" class="switch" ${data.fraction.frSiteApp.status == 0 ? "" : "checked"}>
		        	</div>
		        	<div class="fraction-info fraction-info-flex">
		        		<span>Уровень для подачи заявки</span>
						<input type="text" id="fraction-apps-settings-level" class="input input-check-number" placeholder=" " value="${data.fraction.frSiteApp.level}">
		        	</div>

		        	<div class="fraction-info fraction-info-flex" style="justify-content: flex-end; margin-top: 30px;">
		        		<button id="fraction-apps-settings-save" class="button">Сохраннить</button>
		        	</div>
		        </div>
			</div>
			<div class="fraction-div">
				<div class="fraction-box">
		        	<h2>Последние действия по заявкам</h2>
		        	<div class="list list-border">
		        		<div class="list-box" id="fraction-apps-last-edit"></div>
		        	</div>
		        </div>
			</div>

			<div class="fraction-box">
	        	<h2>Все активные заявки</h2>
	        	<div class="list list-border">
	        		<div class="list-title list-title-desc">
	        			<span>Ник игрока</span>
	        			<span>Дата подачи</span>
	        		</div>
	        		<div class="list-box" id="fraction-apps-all"></div>
	        	</div>
	        </div>
		</div>`)

	data.fraction.apps.forEach(item =>
	{
		$('#fraction-apps-all').append(`
			<a href="/fraction/applications?id=${item.appID}" class="list-item">
				<span>${item.appCreatorName}</span>
				<span>${moment(new Date(item.appCreateDate)).fromNow()}</span>
			</a>`)
	})
	data.fraction.lastAppsEdit.forEach(item =>
	{
		$('#fraction-apps-last-edit').append(`
			<div class="list-item">
				<span>
					<a href="/find?type=account&search=${item.appEditorName}">${item.appEditorName}</a> ${moment(new Date(item.appEditDate)).fromNow()} ${item.appStatus === 1 ? "принял" : "отклонил"} заявку <a href="/find?type=account&search=${item.appCreatorName}">${item.appCreatorName}${item.appStatus == 2 ? `${!item.appEditReason.length ? " без причины." : `. Причина: ${item.appEditReason}`}` : ""}</a>
				</span>
			</div>`)
	})
}

export function renderFractionAppPage(data)
{
	$('.wrapper').html(`
		<div class="list">
			<div class="list-title">Выберите фракцию</div>
			<div class="list-box" id="fraction-app-list"></div>
		</div>`)

	data.forEach(item =>
	{
		$('#fraction-app-list').append(`
			<a href="/fraction/application?frac=${item.name}" class="list-item">
				<span>${item.name}</span>
				<span>Необходим ${item.level} уровень для подачи заявки</span></a>`)
	})
}

export function renderFractionPage(data)
{
	if(data.status === 'notFraction')
	{
		if(!data.data)
		{
			$('.wrapper').html(`
				<div class="report-title">
				    <h1>Вы не состоите во фракции</h1>
				</div>`)

			if(Date.now() >= data.errTiming + 3600000) $('.report-title').append('<a class="button" href="/fraction/application">Отправить заявку на вступление</a>')
			else $('.wrapper').append(`
				<div style="width: 100%; display: flex; justify-content: center; margin-top: 30px; color: red;">
					Следующую заявку Вы сможете подать ${new Date(data.errTiming + 3600000).toLocaleString()}
				</div>`)
		}
		else
		{
			data = data.data

			let appStatus = "<span style='color: grey'>В ожидании</span>"

			if(data.appStatus === 1) appStatus = "<span style='color: green'>Одобрена</span>"
			else if(data.appStatus === 2) appStatus = "<span style='color: red'>Отклонена</span>"

			$('.wrapper').html(`
				<div class="report-title">
				    <h1>Вы не состоите во фракции, но Вы уже подали заявку в ${data.appFracName}</h1>
				</div>

				<div class="fr-apps-flex" style="display: flex; justify-content: space-around; align-items: flex-start; flex-wrap: wrap;">
					<div class="fr-apps" style="display: block;">
					    <div class="fr-apps-box" style="width: 350px;">
					        <div class="fr-apps-title">
					        	Ваша анкета<br>
					        	<span style="font-size: 13px;">Статус анкеты: ${appStatus}</span>
					        </div>
					    </div>
					</div>
				</div>`)

			data.appForms.forEach((item, i) =>
			{
				if(item.type === 'input')
				{
					$('.fr-apps-box').append(`
						<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="input">
						    <div class="fr-apps-form-title">
						    	<h2>${item.name}</h2>
						    	${item.important ? "<span>*</span>" : ""}
						    </div>
						    <input class="input" type="text" placeholder="Введите ответ" value="${item.value}" disabled />
						</div>`)
				}
				else if(item.type === 'radio' || item.type === 'checkbox')
				{
					$('.fr-apps-box').append(`
						<div class="fr-apps-form" data-fr-apps-form-id="${i}" data-fr-apps-form-type="radio">
						    <div class="fr-apps-form-title">
						    	<h2>${item.name}</h2>
						    	${item.important ? "<span>*</span>" : ""}
						    </div>
						</div>`)

					item.value.forEach((elemItem, elemI) =>
					{
						$(`.fr-apps-box .fr-apps-form[data-fr-apps-form-id="${i}"]`).append(`
							<div class="fr-apps-form-label" data-fr-apps-form-${item.type}-id="${elemI}">
						    	<input class="${item.type}" type="${item.type}" name="fr-apps-form-${item.type}-${i}" ${elemItem.checked ? 'checked="checked"' : ''}, disabled />
						    	<label>${elemItem.value}</label>
						    </div>`)
					})
				}
			})

			$('.fr-apps-box').append(`
			    <div style="width: 100%; margin-top: 50px; display: flex; justify-content: flex-end;">
			    	<button class="button" id="fr-apps-form-close" style="background-color: #fc6b6b;">Отменить заявку</button>
				</div>`)
		}
	}
	else
	{
		data = data.data

		$('.wrapper').html(`
			<div class="report-title">
			    <h1>Вы состоите в ${data.frName}</h1>
			</div>

			<div class="fraction">
			    <div class="fraction-div">
			        <div class="fraction-box">
			            <h2>Информация по фракции</h2>
			            <div class="fraction-info">
			                <div class="text-list">
			                    <div class="text-list-item">
			                    	<span>Название</span>
			                    	<span>${data.frName}</span>
			                    </div>
			                   	<div class="text-list-item">
			                    	<span>Номер</span>
			                    	<span>${data.frID}</span>
			                    </div>
			                    <div class="text-list-item">
			                    	<span>Лидер</span>
			                    	<span>
			                    		${data.frLeader == -1 ? "Неимеется" : `<a href="/find?type=account&search=${data.frLeaderName}" class="href-color">${data.frLeaderName}</a>`}
			                    	</span>
			                    </div>
			                    <div class="text-list-item">
			                    	<span>Банк</span>
			                    	<span>${data.frBank.toLocaleString()} $</span>
			                    </div>
			                </div>
			                <div class="list" style="margin-top: 30px;">
			                    <div class="list-title">Игроки онлайн</div>
			                    <div class="list-box" id="fraction-list-onlines"></div>
			                </div>
			            </div>
			        </div>
			    </div>

			    <div class="fraction-div">
			        <div class="fraction-box">
			            <h2>Заявки на вступление</h2>
			            <div class="fraction-info" ${data.frType == 5 || data.frType == 6 ? "style='display: flex; justify-content: center;'" : ''}>
			            	${data.frType == 5 || data.frType == 6 ? "Недоступно" : `<div class="text-list">
			                    <div class="text-list-item">
				                    	<span>Всего заявок</span>
				                    	<span>${data.allApps}</span>
				                    </div>
				                </div>
				                <div style="margin-top: 10px; display: flex; justify-content: center;">
				                	<a class="button" href="/fraction/applications">Управление заявками</a>
				                </div>

				                <div class="list" style="margin-top: 30px;">
				                    <div class="list-title">Последние заявки</div>
				                    <div class="list-box" id="fraction-list-applications"></div>
				                </div>`}
			            </div>
			        </div>

			        <div class="fraction-box">
			            <h2>Все игроки во фракции</h2>
			            <div class="fraction-info">
			                <div class="text-list">
			                    <div class="text-list-item">
			                    	<span>Всего игроков</span>
			                    	<span>${data.allPlayers}</span>
			                    </div>
			                    <div class="text-list-item">
			                    	<span>Из них онлайн</span>
			                    	<span>${data.onlinePlayers.length}</span>
			                    </div>
			                </div>
			                <div style="margin-top: 10px; display: flex; justify-content: center;">
			                	<a class="button" href="/fraction/players">Все игроки</a>
			                </div>

			                <div class="list" style="margin-top: 30px;">
			                    <div class="list-title">Последние заходившие</div>
			                    <div class="list-box" id="fraction-list-last-online-players"></div>
			                </div>
			            </div>
			        </div>
			    </div>
			</div>`)

		data.onlinePlayers.forEach(item =>
		{
			$('#fraction-list-onlines').append(`
				<a href="/find?type=account&search=${item.pName}" class="list-item">
					<span>${item.pName}</span>
					<span>ID: ${item.pOnline}</span>
				</a>`)
		})

		data.lastOnlinePlayers.forEach(item =>
		{
			$('#fraction-list-last-online-players').append(`
				<a class="list-item" href="/find?type=account&search=${item.pName}">
					<span>${item.pName}</span>
					<span>${moment(new Date(item.pLastEnter)).fromNow()}</span>
				</a>`)
		})

		data.lastApps.forEach(item =>
		{
			$('#fraction-list-applications').append(`
				<a class="list-item" href="/fraction/applications?id=${item.appID}">
					<span>${item.appCreatorName}</span>
					<span>${moment(new Date(item.appCreateDate)).fromNow()}</span>
				</a>`)
		})

		if(loginData.id === data.frLeader)
		{
			$('.wrapper .fraction .fraction-div:first-child').append(`
				<div class="fraction-box">
		            <h2>Настройки</h2>
		            <div class="fraction-info">
		                <div class="fr-settings">
		                	<div class="item" id="frac-settings-view-app-bl">
		                		<span>Кто может просматривать заявки</span>

		                		<span>
		                			<div id="frac-settings-view-app"></div>

		                			<div class="item-other">
										<input class="input" type="text" id="frac-settings-view-app-rank" value="${data.siteSettings.access.app.view.rank}" style="display: none;">
			                			<h4 class="href-hover" id="frac-settings-view-app-players" style="display: none;"></h4>
			                		</div>
		                		</span>

		                	</div>
		                	<div class="item" id="frac-settings-status-app-bl">
		                		<span>Кто может принимать/отклонять заявки</span>

		                		<span>
		                			<div id="frac-settings-status-app"></div>

		                			<div class="item-other">
										<input class="input" type="text" id="frac-settings-status-app-rank" value="${data.siteSettings.access.app.status.rank}" style="display: none;">
			                			<h4 class="href-hover" id="frac-settings-status-app-players" style="display: none;"></h4>
		                			</div>
		                		</span>
		                	</div>
		                	<div class="item" id="frac-settings-edit-app-bl">
		                		<span>Кто может редактировать анкету заявки</span>

		                		<span>
		                			<div id="frac-settings-edit-app"></div>

		                			<div class="item-other">
										<input class="input" type="text" id="frac-settings-edit-app-rank" value="${data.siteSettings.access.app.edit.rank}" style="display: none;">
			                			<h4 class="href-hover" id="frac-settings-edit-app-players" style="display: none;"></h4>
			                		</div>
		                		</span>
		                	</div>
		                	<div class="item" style="justify-content: flex-end; margin-top: 40px;">
		                		<button class="button" id="frac-settings-save">Сохранить</button>
		                	</div>
		                </div>
		            </div>
		        </div>`)

			$("#frac-settings-view-app-bl span .item-other h4").unbind().on('click', () => msearch.show('frac-settings-view-app-players', getPlayerList().view))
			$("#frac-settings-status-app-bl span .item-other h4").unbind().on('click', () => msearch.show('frac-settings-status-app-players', getPlayerList().status))
			$("#frac-settings-edit-app-bl span .item-other h4").unbind().on('click', () => msearch.show('frac-settings-edit-app-players', getPlayerList().edit))

			updateSetting()
			function updateSetting()
			{
				let
					playersViewApp = "Никто не выбран",
					playersViewAppCount = 0,

					playersStatusApp = "Никто не выбран",
					playersStatusAppCount = 0,

					playersEditApp = "Никто не выбран",
					playersEditAppCount = 0

				data.siteSettings.access.app.view.players.forEach((item, i) =>
				{
					if(i === 0) playersViewApp = ""

					let parse = item.split(';')
					if(i < 3) playersViewApp += `${parse[1]}, `

					playersViewAppCount ++
				})
				if(playersViewAppCount >= 1) playersViewApp = playersViewApp.substring(0, playersViewApp.length - 2)
				if(playersViewAppCount >= 3) playersViewApp += ' и другие...'

				data.siteSettings.access.app.status.players.forEach((item, i) =>
				{
					if(i === 0) playersStatusApp = ""

					let parse = item.split(';')
					if(i < 3) playersStatusApp += `${parse[1]}, `

					playersStatusAppCount ++
				})
				if(playersStatusAppCount >= 1) playersStatusApp = playersStatusApp.substring(0, playersStatusApp.length - 2)
				if(playersStatusAppCount >= 3) playersStatusApp += ' и другие...'

				data.siteSettings.access.app.edit.players.forEach((item, i) =>
				{
					if(i === 0) playersEditApp = ""

					let parse = item.split(';')
					if(i < 3) playersEditApp += `${parse[1]}, `

					playersEditAppCount ++
				})
				if(playersEditAppCount >= 1) playersEditApp = playersEditApp.substring(0, playersEditApp.length - 2)
				if(playersEditAppCount >= 3) playersEditApp += ' и другие...'

				$('#frac-settings-view-app-bl span .item-other h4').text(playersViewApp)
				$('#frac-settings-status-app-bl span .item-other h4').text(playersStatusApp)
				$('#frac-settings-edit-app-bl span .item-other h4').text(playersEditApp)
			}
			function getPlayerList()
			{
				var
					allPlayersView = [],
					allPlayersStatus = [],
					allPlayersEdit = []

				data.allPlayersList.forEach(item => allPlayersView.push({ data: item.pID, name: item.pName, checked: false }))
				data.allPlayersList.forEach(item => allPlayersStatus.push({ data: item.pID, name: item.pName, checked: false }))
				data.allPlayersList.forEach(item => allPlayersEdit.push({ data: item.pID, name: item.pName, checked: false }))

				allPlayersView.forEach((elem, list) =>
				{
					data.siteSettings.access.app.view.players.forEach((item, i) =>
					{
						let parse = item.split(';')
						if(parse[1] === elem.name
							&& parseInt(parse[0]) === elem.data) allPlayersView[list].checked = true
					})
					data.siteSettings.access.app.status.players.forEach((item, i) =>
					{
						let parse = item.split(';')
						if(parse[1] === elem.name
							&& parseInt(parse[0]) === elem.data) allPlayersStatus[list].checked = true
					})
					data.siteSettings.access.app.edit.players.forEach((item, i) =>
					{
						let parse = item.split(';')
						if(parse[1] === elem.name
							&& parseInt(parse[0]) === elem.data) allPlayersEdit[list].checked = true
					})
				})
				return { view: allPlayersView, status: allPlayersStatus, edit: allPlayersEdit }
			}

			select.add('#frac-settings-view-app', [
					'Все',
					'Только я',
					'Определенный ранг',
					'Определенные игроки' ],
					{
						defaultName: data.siteSettings.access.app.view.type === 'i' ? "Только я" :
							data.siteSettings.access.app.view.type === 'all' ? "Все" :
							data.siteSettings.access.app.view.type === 'rank' ? "Определенный ранг" :
							data.siteSettings.access.app.view.type === 'players' ? "Определенные игроки" : "Неизвестно",
						elements:
						{
							onclick: [
								"$('#frac-settings-view-app-rank, #frac-settings-view-app-players').hide();",
								"$('#frac-settings-view-app-rank, #frac-settings-view-app-players').hide();",
								"$('#frac-settings-view-app-rank').show(); $('#frac-settings-view-app-players').hide()",
								"$('#frac-settings-view-app-rank').hide(); $('#frac-settings-view-app-players').show()"
							]
						}
					})
			$('#frac-settings-view-app').unbind().on('selectChanges', (elem, sel) =>
			{
				if(sel.type !== 'Определенные игроки')return false

				msearch.show('frac-settings-view-app-players', getPlayerList().view)
			})

			select.add('#frac-settings-status-app', [
					'Только я',
					'Определенный ранг',
					'Определенные игроки' ],
					{
						defaultName: data.siteSettings.access.app.status.type === 'i' ? "Только я" :
							data.siteSettings.access.app.status.type === 'all' ? "Только я" :
							data.siteSettings.access.app.status.type === 'rank' ? "Определенный ранг" :
							data.siteSettings.access.app.status.type === 'players' ? "Определенные игроки" : "Неизвестно",
						elements:
						{
							onclick: [
								"$('#frac-settings-status-app-rank, #frac-settings-status-app-players').hide();",
								"$('#frac-settings-status-app-rank').show(); $('#frac-settings-status-app-players').hide()",
								`$('#frac-settings-status-app-rank').hide(); $('#frac-settings-status-app-players').show()`
							]
						}
					})
			$('#frac-settings-status-app').unbind().on('selectChanges', (elem, data) =>
			{
				if(data.type !== 'Определенные игроки')return false
				msearch.show('frac-settings-status-app-players', getPlayerList().status)
			})

			select.add('#frac-settings-edit-app', [
					'Только я',
					'Определенный ранг',
					'Определенные игроки' ],
					{
						defaultName: data.siteSettings.access.app.edit.type === 'i' ? "Только я" :
							data.siteSettings.access.app.edit.type === 'all' ? "Только я" :
							data.siteSettings.access.app.edit.type === 'rank' ? "Определенный ранг" :
							data.siteSettings.access.app.edit.type === 'players' ? "Определенные игроки" : "Неизвестно",
						elements:
						{
							onclick: [
								"$('#frac-settings-edit-app-rank, #frac-settings-edit-app-players').hide();",
								"$('#frac-settings-edit-app-rank').show(); $('#frac-settings-edit-app-players').hide()",
								"$('#frac-settings-edit-app-rank').hide(); $('#frac-settings-edit-app-players').show()"
							]
						}
					})
			$('#frac-settings-edit-app').unbind().on('selectChanges', (elem, data) =>
			{
				if(data.type !== 'Определенные игроки')return false
				msearch.show('frac-settings-edit-app-players', getPlayerList().edit)
			})

			$(document).on('m-search-accept', (elem, results) =>
			{
				if(results.dialogid === 'frac-settings-view-app-players')
				{
					data.siteSettings.access.app.view.players = []
					results.results.forEach(item =>
					{
						if(item.checked === true) data.siteSettings.access.app.view.players.push(`${item.data};${item.name}`)
					})
				}
				else if(results.dialogid === 'frac-settings-status-app-players')
				{
					data.siteSettings.access.app.status.players = []
					results.results.forEach(item =>
					{
						if(item.checked === true) data.siteSettings.access.app.status.players.push(`${item.data};${item.name}`)
					})
				}
				else if(results.dialogid === 'frac-settings-edit-app-players')
				{
					data.siteSettings.access.app.edit.players = []
					results.results.forEach(item =>
					{
						if(item.checked === true) data.siteSettings.access.app.edit.players.push(`${item.data};${item.name}`)
					})
				}

				updateSetting()
				msearch.close()
			})
			$('body').on('click', "#frac-settings-save", () =>
			{
				data.siteSettings.access.app.view.type = $('#frac-settings-view-app').attr('data-select-type') === "Все" ? "all" :
					$('#frac-settings-view-app').attr('data-select-type') === "Только я" ? 'i' :
					$('#frac-settings-view-app').attr('data-select-type') === 'Определенный ранг' ? "rank" :
					$('#frac-settings-view-app').attr('data-select-type') === 'Определенные игроки' ? "players" : "no"
				data.siteSettings.access.app.view.rank = $('#frac-settings-view-app-bl span .item-other input').val()

				data.siteSettings.access.app.status.type = $('#frac-settings-status-app').attr('data-select-type') === "Все" ? "i" :
					$('#frac-settings-status-app').attr('data-select-type') === "Только я" ? 'i' :
					$('#frac-settings-status-app').attr('data-select-type') === 'Определенный ранг' ? "rank" :
					$('#frac-settings-status-app').attr('data-select-type') === 'Определенные игроки' ? "players" : "no"
				data.siteSettings.access.app.status.rank = $('#frac-settings-status-app-bl span .item-other input').val()

				data.siteSettings.access.app.edit.type = $('#frac-settings-edit-app').attr('data-select-type') === "Все" ? "i" :
					$('#frac-settings-edit-app').attr('data-select-type') === "Только я" ? 'i' :
					$('#frac-settings-edit-app').attr('data-select-type') === 'Определенный ранг' ? "rank" :
					$('#frac-settings-edit-app').attr('data-select-type') === 'Определенные игроки' ? "players" : "no"
				data.siteSettings.access.app.edit.rank = $('#frac-settings-edit-app-bl span .item-other input').val()

				loading.go()
				$.post('/fraction/settings/save-access', { data: JSON.stringify(data.siteSettings.access) }, results =>
				{
					loading.stop()

					if(results === 'exit')return __removeAccCookies()
					if(results === 'notrights')return url.locate('/fraction')

					if(results === 'error')return dialog.show('error', 'error', null, 'Ошибка! Проверьте все данные еще раз или обновите страницу!')
					dialog.show('success', 'success', null, 'Настройки успешно сохранены!')
				})
			})
		}
	}
}


$(document).ready(() =>
{
	// $('#fraction-app-go').on('click', () =>
	// {
	// 	const
	// 		frac = $('#fraction-app-frac').attr('data-select-type'),
	// 		rank = $('#fraction-app-rank').val(),
	// 		pass = $('#fraction-app-pass').val(),
	// 		lic = $('#fraction-app-lic').val(),
	// 		text = $('#fraction-app-text').val()

	// 	if(frac === 'Не выбрано')return dialog.show('Ошибка!', 'error', null, 'Выберите фракцию!')
	// 	if(!rank || !pass || !lic || !text
	// 		|| rank.length < 1 || pass.length < 1 || lic.length < 1 || text.length < 1)return dialog.show('Ошибка!', 'error', null, 'Заполните все поля правильно!')

	// 	if(!/(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i.test(pass)
	// 		|| !/(^https?:\/\/)?[a-z0-9~_\-\.]+\.[a-z]{2,9}(\/|:|\?[!-~]*)?$/i.test(lic))return dialog.show('Ошибка!', 'error', null, 'Не валидные ссылки!')
	// })

	$(document).on('click', '#fraction-apps-settings-save', () =>
	{
		const
			status = $('#fraction-apps-settings-status').is(":checked"),
			level = parseInt($('#fraction-apps-settings-level').val())

		if(isNaN(level))return dialog.show('Ошибка!', 'error', null, 'Параметр Уровня не корректный!')

		loading.go()
		$.post('/fraction/applications/save-settings', { status: !status ? 0 : 1, level: level }, results =>
		{
			loading.stop()

			if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Некорректные данные!')
			if(results === 'exit')return __removeAccCookies()

			if(results === 'returnURLFraction')return url.locate('/fraction')
			if(results === 'fractionNotFound')return page.render('error', { message: "Фракция не найдена! Попробуйте позже." })

			if(results === 'notRights')return dialog.show('Ошибка!', 'error', null, 'Ошибка доступа!')

			dialog.show('Успешно!', 'success', null, 'Настройки успешно сохранены!')
		})
	})


	// Редактирование анкеты
	$(document).on('click', '#fr-apps-edit-add-input', () =>
	{
		let count = $('.fr-apps-box-edit .fr-apps-form').length

		$('.fr-apps-box-edit').append(`
			<div class="fr-apps-form" data-fr-apps-form-id="${count}" data-fr-apps-form-type="input">
			    <div class="fr-apps-form-title">
			    	<h2>Название</h2>
			    </div>
			    <input class="input" type="text" placeholder="Введите ответ" />
			</div>`)
	})
	$(document).on('click', '#fr-apps-edit-add-radio', () =>
	{
		let count = $('.fr-apps-box-edit .fr-apps-form').length

		$('.fr-apps-box-edit').append(`
			<div class="fr-apps-form" data-fr-apps-form-id="${count}" data-fr-apps-form-type="radio">
			    <div class="fr-apps-form-title">
			    	<h2>Название</h2>
			    </div>

			    <div class="fr-apps-form-label" data-fr-apps-form-radio-id="0">
			    	<input class="radio" type="radio" name="fr-apps-form-radio-${count}" checked="checked" />
			    	<label>Название</label>
			    </div>
			</div>`)
	})
	$(document).on('click', '#fr-apps-edit-add-checkbox', () =>
	{
		let count = $('.fr-apps-box-edit .fr-apps-form').length

		$('.fr-apps-box-edit').append(`
			<div class="fr-apps-form" data-fr-apps-form-id="${count}" data-fr-apps-form-type="checkbox">
			    <div class="fr-apps-form-title">
			    	<h2>Название</h2>
			    </div>

			    <div class="fr-apps-form-label" data-fr-apps-form-checkbox-id="0">
			    	<input class="checkbox" type="checkbox" name="fr-apps-form-checkbox-${count}" checked="checked" />
			    	<label>Название</label>
			    </div>
			</div>`)
	})

	$(document).on('click', '.fr-apps-form', elem =>
	{
		let id = $(elem.currentTarget).attr('data-fr-apps-form-id')

		if($('.fr-apps-form.fr-apps-form-edit').attr('data-fr-apps-form-id') === id)
		{
			$('.fr-apps-form.fr-apps-form-edit').removeClass('fr-apps-form-edit')
			frAppEdit.hideMenu()

			return true
		}

		$('.fr-apps-form.fr-apps-form-edit').removeClass('fr-apps-form-edit')
		$(elem.currentTarget).addClass('fr-apps-form-edit')

		frAppEdit.hideMenu()
		frAppEdit.showMenu()
	})

	$(document).on('input', '#fr-apps-edit-title', elem =>
	{
		const text = $(elem.currentTarget).val()
		if(!$('*').is('.fr-apps-form.fr-apps-form-edit'))return frAppEdit.hideMenu()

		$('.fr-apps-form.fr-apps-form-edit .fr-apps-form-title h2').text(text)
	})
	$(document).on('change', '#fr-apps-edit-important', elem =>
	{
		const status = $(elem.currentTarget).is(':checked')
		if(!$('*').is('.fr-apps-form.fr-apps-form-edit'))return frAppEdit.hideMenu()

		if(!status) $('.fr-apps-form.fr-apps-form-edit .fr-apps-form-title span').remove()
		else $('.fr-apps-form.fr-apps-form-edit .fr-apps-form-title').append('<span>*</span>')
	})

	$(document).on('input', '.fr-apps-edit-elem', elem =>
	{
		const
			text = $(elem.currentTarget).val(),
			id = $(elem.currentTarget).attr('data-fr-apps-edit-elem-id'),
			type = $(elem.currentTarget).attr('data-fr-apps-edit-elem-type')

		if(!$('*').is('.fr-apps-form.fr-apps-form-edit'))return frAppEdit.hideMenu()
		if(type !== 'checkbox' && type !== 'radio')return frAppEdit.hideMenu()

		$(`.fr-apps-form.fr-apps-form-edit .fr-apps-form-label[data-fr-apps-form-${type}-id="${id}"] label`).text(text)
	})
	$(document).on('click', '.fr-apps-edit-delete-elem', elem =>
	{
		const
			id = $(elem.currentTarget).attr('data-fr-apps-edit-elem-id'),
			type = $(elem.currentTarget).attr('data-fr-apps-edit-elem-type')

		if(!$('*').is('.fr-apps-form.fr-apps-form-edit'))return frAppEdit.hideMenu()
		if(type !== 'checkbox' && type !== 'radio')return frAppEdit.hideMenu()

		$(`.fr-apps-form.fr-apps-form-edit .fr-apps-form-label[data-fr-apps-form-${type}-id="${id}"]`).remove()
		$(`.fr-apps-box-menu .fr-apps-edit .fr-apps-edit-item input[data-fr-apps-edit-elem-id="${id}"]`).parent().remove()

		if(!$(`.fr-apps-form.fr-apps-form-edit .fr-apps-form-label`).length) frAppEdit.deleteForm()
		else
		{
			const elements = $.makeArray($(`.fr-apps-form.fr-apps-form-edit .fr-apps-form-label`))
			elements.forEach(item =>
			{
				const elem = $(item)
				if(parseInt(elem.attr(`data-fr-apps-form-${type}-id`)) > parseInt($(`.fr-apps-form.fr-apps-form-edit .fr-apps-form-label`).attr(`data-fr-apps-form-${type}-id`)))
				{
					$(`.fr-apps-box-menu .fr-apps-edit .fr-apps-edit-item input[data-fr-apps-edit-elem-id="${elem.attr(`data-fr-apps-form-${type}-id`)}"]`).attr(`data-fr-apps-edit-elem-id`, `${parseInt(elem.attr(`data-fr-apps-form-${type}-id`)) - 1}`)
					$(`.fr-apps-box-menu .fr-apps-edit .fr-apps-edit-item button[data-fr-apps-edit-elem-id="${elem.attr(`data-fr-apps-form-${type}-id`)}"]`).attr(`data-fr-apps-edit-elem-id`, `${parseInt(elem.attr(`data-fr-apps-form-${type}-id`)) - 1}`)

					elem.attr(`data-fr-apps-form-${type}-id`, `${parseInt(elem.attr(`data-fr-apps-form-${type}-id`)) - 1}`)
				}
			})
		}
	})
	$(document).on('click', '#fr-apps-edit-elem-add', elem =>
	{
		const
			type = $(elem.currentTarget).attr('data-fr-apps-edit-elem-type'),
			id = $(`.fr-apps-form.fr-apps-form-edit`).attr('data-fr-apps-form-id')

		if(!$('*').is('.fr-apps-form.fr-apps-form-edit'))return frAppEdit.hideMenu()
		if(type !== 'checkbox' && type !== 'radio')return frAppEdit.hideMenu()

		const count = $(`.fr-apps-form.fr-apps-form-edit .fr-apps-form-label`).length

		$(`.fr-apps-form.fr-apps-form-edit`).append(`
			<div class="fr-apps-form-label" data-fr-apps-form-${type}-id="${count}">
		    	<input class="${type}" type="${type}" name="fr-apps-form-${type}-${id}" ${!count ? "checked" : ""} />
		    	<label>Название</label>
		    </div>`)

		$(`.fr-apps-box-menu .fr-apps-edit .fr-apps-edit-item input[data-fr-apps-edit-elem-id="${count - 1}"]`).parent().after(`
			<div class="fr-apps-edit-item">
				<input class="${type}" type="${type}" disabled="disabled" />
				<input class="input fr-apps-edit-elem" type="text" data-fr-apps-edit-elem-id="${count}" data-fr-apps-edit-elem-type="${type}" placeholder=" " value="Название" maxlength="30" />
				<button class="button fr-apps-edit-delete-elem" data-fr-apps-edit-elem-id="${count}" data-fr-apps-edit-elem-type="${type}">Удалить</button>
			</div>`)
	})
	$(document).on('click', '#fr-apps-edit-delete', elem =>
	{
		if(!$('*').is('.fr-apps-form.fr-apps-form-edit'))return frAppEdit.hideMenu()

		frAppEdit.deleteForm()
	})

	$(document).on('click', '#fr-apps-edit-save', () =>
	{
		const
			forms = $.makeArray($('.fr-apps-box.fr-apps-box-edit .fr-apps-form'))
		if(!forms.length)return dialog.show('Ошибка!', 'error', null, 'Вы должны создать хотя бы одну форму!')

		const saveForms = []
		forms.forEach((item, i) =>
		{
			const elem = $(item)

			saveForms.push({
				type: elem.attr('data-fr-apps-form-type'),
				name: elem.find('.fr-apps-form-title h2').text(),
				important: !elem.find('.fr-apps-form-title span').length ? false : true,
				elements: [  ]
			})

			if(elem.attr('data-fr-apps-form-type') === 'radio' || elem.attr('data-fr-apps-form-type') === 'checkbox')
			{
				$.makeArray(elem.find('.fr-apps-form-label')).forEach(labelItem =>
				{
					saveForms[i].elements.push({
						name: $(labelItem).find('label').text()
					})
				})
			}
		})

		loading.go()
		$.post('/fraction/applications/save-forms', { forms: JSON.stringify(saveForms) }, results =>
		{
			loading.stop()

			if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Ошибка при сохранении. Попробуйте перезагрузить страницу.')
			if(results === 'exit')return __removeAccCookies()

			if(results === 'returnURLFraction')return url.locate('/fraction')
			if(results === 'notRights')return dialog.show('Ошибка!', 'error', null, 'Вы не можете сохранять данные!')

			dialog.show('Успешно!', 'success', null, 'Данные успешно сохранены!')
		})
	})

	// Отправка данных с формы
	$(document).on('click', '#fr-app-form-go', () =>
	{
		const forms = []
		let importantError = false

		$.makeArray($('.fr-apps-form')).forEach((item, i) =>
		{
			forms.push({
				type: $(item).attr('data-fr-apps-form-type'),
				name: $(item).find('.fr-apps-form-title h2').text(),
				important: $(item).find('.fr-apps-form-title span').length == 0 ? false : true
			})

			if(forms[i].type === 'input') forms[i].value = $(item).find('input').val()
			else if(forms[i].type === 'radio' || forms[i].type === 'checkbox')
			{
				forms[i].value = []
				$.makeArray($(item).find('.fr-apps-form-label')).forEach(radioElem =>
				{
					forms[i].value.push({
						checked: $(radioElem).find('input').is(":checked"),
						value: $(radioElem).find('label').text()
					})
				})
			}

			if(forms[i].important)
			{
				if((forms[i].type === 'input' || forms[i].type === 'checkbox' || forms[i].type === 'radio')
					&& (!forms[i].value
						|| !forms[i].value.length)) importantError = true
			}
		})

		var
			urlData = new URL(window.location.href),
			attrs = {}

		for(var value of new URLSearchParams(urlData.search.split('?')[1])) attrs[value[0]] = value[1]
		if(attrs.frac == undefined
			|| window.location.pathname != '/fraction/application')return url.locate('/fraction/application')

		if(importantError)return dialog.show('Ошибка!', 'error', null, 'Все важные поля должны быть заполнены!<br><span style="color: grey;">Они подсвечены знаком <span style="color: red;">*</span></span>')

		loading.go()
		$.post('/fraction/application/go', { forms: JSON.stringify(forms), fraction: attrs.frac }, results =>
		{
			loading.stop()

			if(results === 'error')return dialog.show('Ошибка!', 'error', null, 'Произошла ошибка при отправке.<br><span style="color: grey;">Попробуйте обновить страницу с заполните поля снова!</span>')
			if(results === 'exit')return __removeAccCookies()

			if(results === 'returnURLFraction')return url.locate('/fraction')

			if(results === 'fractionNotStatus')
			{
				dialog.show('Ошибка!', 'error', null, 'Фракция выключила заявки!')
				return url.locate('/fraction/application')
			}
			if(results === 'level')
			{
				dialog.show('Ошибка!', 'error', null, 'Уровень Вашего аккаунта не совпадает с минимальными требованиями фракции.')
				return url.locate('/fraction/application')
			}
			if(results === 'fractionNotForms')
			{
				dialog.show('Ошибка!', 'error', null, 'У фракции не настроены поля!')
				return url.locate('/fraction/application')
			}

			url.locate('/fraction')
			dialog.show('Успешно!', 'success', null, 'Вы успешно отправили заявку на вступление во фракцию.<br>Ожидайте ответа.')
		})
	})

	// Отмена заявки
	$(document).on('click', '#fr-apps-form-close', () => dialog.show('Уверены?', 'accept', 'frac-close-app', 'Вы действительно хотите отменить заявку?<br><span style="color:red">Вы сможете подать следующую заявку только через 1 час.</span>', 'Нет', 'Да', false))
	$('.dialog').unbind().on('dialogSuccess', (elem, data) =>
	{
		if(data.dialogid !== 'frac-close-app')return false

		loading.go()
		$.post('/fraction/application/close', {}, results =>
		{
			loading.stop()

			if(results === 'exit')return __removeAccCookies()
			if(results === 'error')return url.locate('/fraction')

			dialog.show('Успешно', 'success', null, "Вы успешно отменили заявку")
			url.locate('/fraction')
		})
	})

	// Отклонение заявки
	$(document).on('click', '#fr-apps-form-cancel', () => dialog.show('Причина', 'input', 'frac-apps-accept', 'Введите причину отклонения заявки:<br><span style="color: grey">Оставьте поле пустым, чтобы отклонить без причины</span>', 'Отмена', 'Отклонить'))
	$('.dialog').on('dialogSuccess', (elem, data) =>
	{
		if(data.dialogid !== 'frac-apps-accept')return false

		dialog.close()
		const reason = data.inputs[0]

		var
    		urlData = new URL(window.location.href),
    		search = {}

    	for(var value of new URLSearchParams(urlData.search.split('?')[1])) search[value[0]] = value[1]
    	if(search.id == undefined
    		|| isNaN(search.id)
    		|| window.location.pathname != '/fraction/applications')return url.locate('/fraction/applications')

    	loading.go()
    	$.post('/fraction/applications/status', { id: search.id, status: 2, reason: reason }, results =>
    	{
    		loading.stop()

    		if(results === 'exit')return __removeAccCookies()
    		if(results === 'error')return url.locate('/fraction')
    		if(results === 'notfound')return url.locate('/fraction/applications')

    		dialog.show('Успешно!', 'success', null, `Вы успешно отклонили заявку #${search.id}`)
			url.locate('/fraction/applications')
    	})
	})
	// Принятие заявки
	$(document).on('click', '#fr-apps-form-accept', () =>
	{
		var
    		urlData = new URL(window.location.href),
    		search = {}

    	for(var value of new URLSearchParams(urlData.search.split('?')[1])) search[value[0]] = value[1]
    	if(search.id == undefined
    		|| isNaN(search.id)
    		|| window.location.pathname != '/fraction/applications')return url.locate('/fraction/applications')

    	loading.go()
    	$.post('/fraction/applications/status', { id: search.id, status: 1 }, results =>
    	{
    		loading.stop()

    		if(results === 'exit')return __removeAccCookies()
    		if(results === 'error')return url.locate('/fraction')
    		if(results === 'notfound')return url.locate('/fraction/applications')
    		if(results === 'playerisfraction')
    		{
    			dialog.show('Информация', 'info', null, "Игрок уже состоит во фракции!")
    			return url.locate('/fraction/applications')
    		}

    		dialog.show('Успешно!', 'success', null, `Вы успешно одобрили заявку #${search.id}`)
			url.locate('/fraction/applications')
    	})
	})
})
