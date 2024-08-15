import { returnAcsData, realtyTypeNames } from '../../other.js'
import { loginData } from '../../other-pages/login.js'

import { errorGoogleAuth } from '../index.js'

const accRealtyPay =
{
	realty: [],
	cash:
	{
		cash: 0,
		bank: 0
	},

	show: (info = null) =>
	{
		$('.account-realty-pay #account-realty-pay-type-realty input').val('Невыбрано')
		$('.account-realty-pay #account-realty-pay-type-realty input').removeAttr('data-info')

		$('.account-realty-pay #account-realty-pay-type-cash input').val('Наличные')
		$('.account-realty-pay #account-realty-pay-type-cash input').attr('data-info', 'cash')

		$('.account-realty-pay #account-realty-pay-block-info, .account-realty-pay #account-realty-pay-block-btn').hide()

		if(info !== null) accRealtyPay.btnDirection('realty', 'right', info)
		$('.account-realty-pay').addClass('account-realty-pay-show')
	},
	btnDirection: (type, direction, currentInfo = null) =>
	{
		if(type !== 'realty' && type !== 'cash'
			&& direction !== 'left' && direction !== 'right')return false

		if(type === 'realty')
		{
			if(accRealtyPay.realty.length === 0)return $('.account-realty-pay').removeClass('account-realty-pay-show')
			let
				info = $('.account-realty-pay #account-realty-pay-type-realty input').attr('data-info'),
				id = 0

			if(info === undefined)
			{
				info = accRealtyPay.realty[0]
				id = 0
			}
			else
			{
				info = JSON.parse(info)
				accRealtyPay.realty.forEach((item, i) =>
				{
					if(item.id === info.id && item.type === info.type) id = i
				})
			}

			if(direction === 'right')
			{
				id ++
				if(id >= accRealtyPay.realty.length) id = 0
			}
			else if(direction === 'left')
			{
				id --
				if(id < 0) id = accRealtyPay.realty.length - 1
			}

			info = accRealtyPay.realty[id]
			if(currentInfo !== null) info = currentInfo

			switch(info.type)
			{
				case 'house':
				{
					$('.account-realty-pay #account-realty-pay-type-realty input').val(`${realtyTypeNames.house[info.types]} #${info.id}`)
					break
				}
				case 'biz':
				{
					$('.account-realty-pay #account-realty-pay-type-realty input').val(`${realtyTypeNames.biz[info.types]} #${info.id}`)
					break
				}
				case 'vehicle':
				{
					$('.account-realty-pay #account-realty-pay-type-realty input').val(`Транспорт #${info.id}`)
					break
				}
			}
			$('.account-realty-pay #account-realty-pay-type-realty input').attr('data-info', JSON.stringify(info))
		}
		else if(type === 'cash')
		{
			let
				cash = $('.account-realty-pay #account-realty-pay-type-cash input').attr('data-info'),
				cashTitle = 'Наличные'

			if(cash !== 'cash' && cash !== 'bank') cash = 'cash'

			if(cash === 'cash') cash = "bank", cashTitle = "Банковская карта"
			else cash = "cash"

			if(cash === 'bank'
				&& accRealtyPay.cash.bank === -1) cash = "cash", cashTitle = "Наличные"

			$('.account-realty-pay #account-realty-pay-type-cash input').val(cashTitle)
			$('.account-realty-pay #account-realty-pay-type-cash input').attr('data-info', cash)
		}

		accRealtyPay.updateInfo()
	},
	updateInfo: () =>
	{
		let
			info = $('.account-realty-pay #account-realty-pay-type-realty input').attr('data-info'),
			id = -1,

			cash = $('.account-realty-pay #account-realty-pay-type-cash input').attr('data-info')

		if(info === undefined)return $('.account-realty-pay #account-realty-pay-block-info, .account-realty-pay #account-realty-pay-block-btn').hide()

		info = JSON.parse(info)
		accRealtyPay.realty.forEach((item, i) =>
		{
			if(item.id === info.id && item.type === info.type) id = i
		})

		if(id === -1)return $('.account-realty-pay #account-realty-pay-block-info, .account-realty-pay #account-realty-pay-block-btn').hide()

		$('.account-realty-pay #account-realty-pay-block-info').html(`
			Сумма налога: ${info.nalog} $
			<br>
			Остаток после оплаты: ${cash === 'cash' ? accRealtyPay.cash.cash - info.nalog : accRealtyPay.cash.bank - info.nalog} $`)
		$('.account-realty-pay #account-realty-pay-block-info, .account-realty-pay #account-realty-pay-block-btn').show()
	},
	go: () =>
	{
		let
			info = $('.account-realty-pay #account-realty-pay-type-realty input').attr('data-info'),
			id = -1,

			cash = $('.account-realty-pay #account-realty-pay-type-cash input').attr('data-info')

		if(info === undefined)return $('.account-realty-pay #account-realty-pay-block-info, .account-realty-pay #account-realty-pay-block-btn').hide()

		info = JSON.parse(info)
		accRealtyPay.realty.forEach((item, i) =>
		{
			if(item.id === info.id && item.type === info.type) id = i
		})

		if(id === -1)return $('.account-realty-pay #account-realty-pay-block-info, .account-realty-pay #account-realty-pay-block-btn').hide()

		$.post('/account/realty-pay', { info: JSON.stringify(info), cash: cash }, results =>
		{
			if(results === 'exit')return __removeAccCookies()
			if(results === 'no nalog')
			{
				dialog.show('error', 'error', null, 'На данное имущества нет налога!')
				accRealtyPay.realty.splice(id, 1)

				accRealtyPay.btnDirection('realty', 'right')
				return true
			}

			if(results.message === 'no cash')
			{
				dialog.show('error', 'error', null, 'Не достаточно средств!')

				accRealtyPay.cash =
				{
					cash: results.data.cash,
					bank: results.data.bank
				}

				accRealtyPay.updateInfo()
				return true
			}
			if(results === 'error')return dialog.show('error', 'error', null, 'Произошла ошибка! Попробуйте обновить страницу.')

			accRealtyPay.cash =
			{
				cash: results.data.cash,
				bank: results.data.bank
			}

			dialog.show('success', 'success', null, 'Вы успешно оплатили налог на выбранное имущество!')
			accRealtyPay.btnDirection('realty', 'right')
		})
	}
}

export function renderAccountPage(data, find = false, parrent = '.wrapper')
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

	accRealtyPay.cash =
	{
		cash: data.pCash,
		bank: data.pBank === 0 ? -1 : data.pBankCash
	}

	$(parrent).append(`
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

		    ${find == false ? `<div class="account-main-grettings">
			        <h1>Знакомства</h1>
			        <div class="account-main-grettings-wrap"></div>
			    </div>` : ""}
		</div>`)

	if(find == false)
	{
		$(parrent).append(`
			<div class="account-main">
			    <h1>Управление аккаунтом</h1>

			    <div class="account-main-settings">
			    	<button id="account-main-settings-passwd">Изменить пароль</button>
			    	<a href="/changemail">Изменить почту</a>
			    </div>
			</div>`)
	}

	if(data.pAdmin > 0)
	{
		let level = (126 / 100) * (100 / (6 / data.pAdmin))

		$(parrent).prepend(`
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
		if(data.banData === 'unban')
		{
			$(parrent).prepend(`
				<div class="account-main" style="width: 450px; max-width: 95%; background-color: rgb(126, 252, 201, .5);">
					<div class="account-ban">
						<h1 style="color: green;">
							Поздравляем!
							<br>
							<span style="font-size: 17px; text-transform: none;">Ваш аккаунт был разблокирован! Теперь Вы можете зайти в игру.</span>
						</h1>
					</div>
				</div>`)
		}
		else
		{
			$(parrent).prepend(`
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
	}

	if(find == false)
	{
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
	}
	if(data.newDonate) $('.wrapper').prepend(`<div class="account-main" style="width: 450px; max-width: 95%; justify-content: center; font-size: 20px;">На Ваш счет было зачислено ${data.newDonate} RUB.</div>`)

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

	if(data.realty.length)
	{
		$('.wrapper').append(`
			<div class="account-main">
			    <h1>Имущество</h1>
			    <div style="width: 100%; display: flex; justify-content: center;" id="account-realty-pay-btn">
			    	<button class="button style-button" id="account-realty-btn">Оплатить имущество</button>
			    </div>
			    <div class="account-main-grettings account-main-houses">
			    	<div class="account-main-grettings-wrap">
			    	</div>
			    </div>
			</div>

			<div class="account-realty-pay">
				<div class="account-realty-pay-block">
					<h3>Выберите имущество</h3>
					<div class="account-realty-pay-type" id="account-realty-pay-type-realty">
						<button data-type="realty" data-direction="left"></button>
						<input type="text" value="Невыбрано" disabled>
						<button data-type="realty" data-direction="right"></button>
					</div>
				</div>
				<div class="account-realty-pay-block">
					<h3>Выберите тип оплаты</h3>
					<div class="account-realty-pay-type" id="account-realty-pay-type-cash">
						<button data-type="cash" data-direction="left"></button>
						<input type="text" value="Наличные" disabled>
						<button data-type="cash" data-direction="right"></button>
					</div>
				</div>
				<div class="account-realty-pay-block" style="margin-top: 30px;" id="account-realty-pay-block-info">
					<h3>Данные</h3>
					<div style="font-size: 13px;">
						Сумма к оплате: 17.555$
						<br>
						Остаток после оплаты: 85.444$
					</div>
				</div>
				<div class="account-realty-pay-block" style="display: flex; justify-content: center;" id="account-realty-pay-block-btn">
					<button class="button style-button" style="color: black; padding: 5px 15px;">Оплатить</button>
				</div>
			</div>`)

		data.realty.forEach(item =>
		{
			if(item.nalog > 0) accRealtyPay.realty.push(item)

			$('.account-main .account-main-houses .account-main-grettings-wrap').append(`
				<div class="account-main-grettings-item account-main-houses-item-${item.type === 'house' ? "h" : item.type === 'biz' ? "b" : "v"}">
					<div class="account-main-grettings-item-img">
						<img src="/styles/images/others/${item.type === 'house' ? "house" : item.type === 'biz' ? "biz" : "vehicle"}.png" alt="${item.type === 'house' ? "Дом" : item.type === 'biz' ? "Бизнес" : "Транспорт"}">
					</div>
					<span>${item.type === 'house' ? `${realtyTypeNames.house[item.types]}` : item.type === 'biz' ? "Бизнес " : "Транспорт"}${item.type === 'biz' ? `${realtyTypeNames.biz[item.types]}` : ""} #${item.id}</span>

					${item.nalog > 0 ? `<div class="account-main-grettings-item-notf account-main-grettings-item-notf-click account-main-grettings-item-notf-click-realty" data-info='${JSON.stringify(item)}'>Нужно оплатить налог</div>` : ""}
				</div>`)
		})

		if(accRealtyPay.realty.length === 0) $('.account-realty-pay-btn').remove()
	}

		// <a href="/find?type=realty&search=1&realty=house" class="account-main-grettings-item account-main-houses-item-h">
		// 	<div class="account-main-grettings-item-img">
		// 		<img src="/styles/images/others/house.png" alt="Дом">
		// 	</div>
		// 	<span>Дом #1</span>
		// </a>
		// <a href="/find?type=realty&search=1&realty=biz" class="account-main-grettings-item account-main-houses-item-b">
		// 	<div class="account-main-grettings-item-img">
		// 		<img src="/styles/images/others/biz.png" alt="Бизнес">
		// 	</div>
		// 	<span>Бизнес #1</span>
		// </a>
		// <a href="/find?type=realty&search=1&realty=vehicle" class="account-main-grettings-item account-main-houses-item-v">
		// 	<div class="account-main-grettings-item-img">
		// 		<img src="/styles/images/others/vehicle.png" alt="Транспорт">
		// 	</div>
		// 	<span>Транспорт #1</span>
		// </a>
}


export function renderAccountSettingsPage(data)
{
	$('.wrapper').append(`
		<div class="report-title">
		    <h1>Настройки аккаунта</h1>
		</div>

		<div class="account-settings">
			<div class="account-settings-title">Уведомления</div>
			<div class="account-settings-body">
				<div class="account-settings-item">
					<span>Изменение статуса Ваших жалоб</span>
					<input type="checkbox" class="switch" id="acc-settings-notf-status-report" ${!data.settings.notf.reportStatusMy ? "" : "checked"}>
				</div>
				<div class="account-settings-item">
					<span>Изменения статуса жалоб на Вас</span>
					<input type="checkbox" class="switch" id="acc-settings-notf-status-report-other"  ${!data.settings.notf.reportStatus ? "" : "checked"}>
				</div>
				<div class="account-settings-item" style="justify-content: flex-end; margin-top: 40px;">
					<button class="button" id="acc-settings-notf-save">Сохранить</button>
				</div>
			</div>
		</div>`)

	// otpauth://totp/Enki Online Plus: ${loginData.name}?secret=${data.pGoogleAuth}&issuer=Enki Online Plus&choe=UTF-8
	// https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=${data.auth.otpauth_url}

	// https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=otpauth://totp/Enki Online Plus: ${loginData.name}?secret=${data.auth.pGoogleAuth}&issuer=Enki Online Plus&algorithm=SHA1&digits=6&period=30
	// if(data.auth.pGoogleAuthOff)
	// {
	// 	$('.wrapper').append(`
	// 		<div class="account-settings">
	// 			<div class="account-settings-title">Двухфакторная авторизация: Google Authenticator</div>
	// 			<div class="account-settings-body">
	// 				<div class="account-settings-info">
	// 					<span>Двухфакторная авторизация: Google Authenticator</span> - это способ авторизации, при котором Вам необходимо будет вводить одноразовый 6ти значный код, если в Ваш аккаунт входять с незнакомого IP адреса.<br><br>
	// 					Вы можете подключить двухфакторную авторизацию просканировав QR-код в приложении Google Authenticator или вписав одноразовый код в ручную.
	// 				</div>
	// 				<dvi class="account-settings-item" style="margin-top: 30px; justify-content: space-around; align-items: flex-start;">
	// 					<div class="account-settings-qr">
	// 						<img src="https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=otpauth://totp/Enki Online Plus: ${loginData.name}?secret=${data.auth.pGoogleAuth}&issuer=Enki Online Plus&algorithm=SHA1&digits=6&period=30" alt="">
	// 					</div>
	// 					<div style="width: 400px;">
	// 						<div style="margin-top: 30px;">
	// 							Зайдите в приложение Gogole Authenticator, выберите "Сканировать QR-код" или "Ввести ключ настройки" и заполните данные коля:
	// 							<br><br>
	// 							Название аккаунта: <h4 style="font-weight: bold; font-size: 18px; margin: 0;">${loginData.name}</h4>
	// 							<br>
	// 							Вставьте ключ: <h4 style="font-weight: bold; font-size: 18px; margin: 0;">${data.auth.pGoogleAuth}</h4>
	// 							<br>
	// 							Тип ключа: <h4 style="font-weight: bold; font-size: 18px; margin: 0;">По времени</h4>
	// 							<br>
	// 							<br>
	// 							<div id="acc-settings-google-auth-accept-div" style="display: none;">
	// 								<div style="text-align: center; width: 100%;">Введите одноразовый код из приложения, чтобы проверить подключение:</div>
	// 								<div class="google-auth-code" data-id="google-auth-accept">
	// 									<input type="text" disabled placeholder="1" data-id="1">
	// 									<input type="text" disabled placeholder="2" data-id="2">
	// 									<input type="text" disabled placeholder="3" data-id="3">
	// 									<input type="text" disabled placeholder="4" data-id="4">
	// 									<input type="text" disabled placeholder="5" data-id="5">
	// 									<input type="text" disabled placeholder="6" data-id="6">
	// 								</div>
	// 							</div>
	// 							<br>
	// 							<br>
	// 							<div style="width: 100%; display: flex; justify-content: flex-end;">
	// 								<button id="acc-settings-google-auth-accept" class="button">Подключить</button>
	// 							</div>
	// 						</div>
	// 					</div>
	// 				</dvi>
	// 			</div>
	// 		</div>`)
	// }
	// else
	// {
	//
	// }
}


$(document).ready(() =>
{
	$(document).on('click', '#account-realty-btn', () => accRealtyPay.show())
	$(document).mouseup(e =>
	{
		if($('.account-realty-pay').hasClass('account-realty-pay-show'))
		{
			var div = $('.account-realty-pay')

			if(!div.is(e.target)
			    && div.has(e.target).length === 0) $('.account-realty-pay').removeClass('account-realty-pay-show')
		}
	})
	$(document).on('click', '.account-realty-pay .account-realty-pay-type button', elem => accRealtyPay.btnDirection($(elem.currentTarget).attr('data-type'), $(elem.currentTarget).attr('data-direction')))
	$(document).on('click', '.account-main-grettings-item-notf-click-realty', item =>
	{
		console.log($(item.currentTarget).attr('data-info'))
		accRealtyPay.show($(item.currentTarget).attr('data-info') === undefined ? null : JSON.parse($(item.currentTarget).attr('data-info')))
	})

	$(document).on('click', '#acc-settings-notf-save', () =>
	{
		const
			statusMyReports = $('#acc-settings-notf-status-report').is(":checked"),
			statusReports = $('#acc-settings-notf-status-report-other').is(":checked")

		loading.go()
		$.post('/account/settings/save/notf', { data: JSON.stringify({ statusMyReports: statusMyReports, statusReports: statusReports }) }, results =>
		{
			loading.stop()

			if(results === 'exit')return __removeAccCookies()
			if(results === 'error')return dialog.show('error', 'error', null, 'Ошибка! Перезагрузите страницу!')

			dialog.show('success', 'success', null, 'Вы успешно сохранили данные!')
		})
	})

	$(document).on('click', '#acc-settings-google-auth-accept', () =>
	{
		$('#acc-settings-google-auth-accept-div').slideDown(500)

		$('#acc-settings-google-auth-accept-div input[data-id="1"]').removeAttr('disabled')
		$('#acc-settings-google-auth-accept-div input[data-id="1"]').focus()

		$('#acc-settings-google-auth-accept').hide()

		$('#acc-settings-google-auth-accept-div .google-auth-code').unbind().on('google-auth-code-success', (elem, data) =>
		{
			if(data.data !== 'google-auth-accept')return false

			$.post('/account/settings/accept-google-auth', { code: data.code }, results =>
			{
				if(results === 'exit')return __removeAccCookies()
				if(results === 'error')return errorGoogleAuth('Не верный код!')

				if(results === 'fatal')return url.locate('/account/settings')

				console.log('success')
			})
		})
	})
})
