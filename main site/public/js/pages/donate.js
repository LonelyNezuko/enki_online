let
	swipingInterval,
	swipingTime = false

const serversDonatePrices = [
	{
		loaded: false,
		serverName: 'Enki Online',
		prices:
		[
			{ name: 'Обмен валюты', price: 0 },
			{ name: 'Снятие предупреждения', price: 0 },
			{ name: 'Смена ника', price: 0 },
			{ name: 'Рюкзак 20 кг', price: 0 },
			{ name: "Аксессуар 'Часы Rolex'", price: 0 },
			{ name: "Аксессуар 'Часы Supreme'", price: 0 },
			{ name: 'Все навыки владением оружия', price: 0 },
			{ name: "Услуга 'Живой'", price: 0 },
			{ name: "Аксессуар Новогодний подарок", price: 0 },
			{ name: "Аксессуар Новогодняя елка", price: 0 },
			{ name: "iPhone", price: 0 }
		]
	}
]

function swipingIMG(id = null)
{
	if(swipingTime == true)return false

	let targetID = $('.donate-bg .bg-select').attr('data-donate-bg-id')
	if(targetID == undefined)
	{
		clearInterval(swipingInterval)
		return false
	}

	if(id != null && id === targetID)return false
	swipingTime = true

	$(`.donate-bg .donate-bg-select button`).removeClass('donate-bg-selected')
	if(id == null
		&& id >= 0
		&& id < 2)
	{
		if(targetID == 2) targetID = 0
		else targetID ++

		$(`.donate-bg .donate-bg-select button[data-donate-bg-id="${targetID}"]`).addClass('donate-bg-selected')
	}
	else $(`.donate-bg .donate-bg-select button[data-donate-bg-id="${id}"]`).addClass('donate-bg-selected')

	$('.donate-bg .bg-select').animate({ "opacity": "0" }, 1200, () =>
	{
		$('.donate-bg .bg-select').removeClass('bg-select')

		if(id == null
			&& id >= 0
			&& id < 2)
		{
			$(`.donate-bg .bg[data-donate-bg-id="${targetID}"]`).addClass('bg-select')
			$(`.donate-bg .bg[data-donate-bg-id="${targetID}"]`).animate({ "opacity": "1" }, 1200, () => swipingTime = false)
		}
		else
		{
			$(`.donate-bg .bg[data-donate-bg-id="${id}"]`).addClass('bg-select')
			$(`.donate-bg .bg[data-donate-bg-id="${id}"]`).animate({ "opacity": "1" }, 1200, () => swipingTime = false)

			clearInterval(swipingInterval)
			swipingInterval = setInterval(swipingIMG, 7400)
		}
	})
}

$(document).ready(() =>
{
	$('.donate-bg .bg-select').css('opacity', '1')

	swipingInterval = setInterval(swipingIMG, 7400)
	$(`.donate-bg .donate-bg-select button`).on('click', elem =>
	{
		const id = $(elem.target).attr('data-donate-bg-id')
		if(!id)return false

		swipingIMG(id)
	})

	$('.donate-form .donate-form-input input#donate-input-sum').on('input', elem =>
	{
		const text = $(elem.target).val().replace(/[^\d]/, '')
		$(elem.target).val(text)
	})
	$('.donate-form #donate-btn').on('click', () =>
	{
		const
			server = $('.donate-form .donate-form-input #donate-input-server').attr('data-id'),
			name = $('.donate-form .donate-form-input input#donate-input-name').val(),
			sum = $('.donate-form .donate-form-input input#donate-input-sum').val()

		loading.go()

		$.post('/donate/payment', { name: name, sum: sum, server: server }, results =>
		{
			loading.stop()

			if(results === 'error')return dialog.show('error', 'error', null, 'Отправленные данные некорректны! Перепроверьте их или обновите страницу.')
			if(results === 'notfound')return dialog.show('error', 'error', null, 'Введенный аккаунт не найден на выбранном сервере')
			if(results === 'abort')return dialog.show('error', 'error', null, 'На данный аккаунт уже есть операция по зачислению средств.')
			if(results === 'not valid server')return dialog.show('error', 'error', null, 'Сервер не найден!')

			window.location.href = results.url
		})
	})

	var
		urlData = new URL(window.location.href),
		attrs = {}

	for(var value of new URLSearchParams(urlData.search.split('?')[1])) attrs[value[0]] = value[1]
	if(attrs.success !== undefined)
	{
		$('.success-bg').removeClass('s-error')

		$('.success .s-title').html('Оплата прошла успешно')
		$('.success .s-desc').html('На Ваш аккаунт были зачислены средства, которые Вы приобрели только что.<br>Зайдите в личный кабинет или игру, чтобы активировать их')

		$('.success-bg').addClass('success-bg-show')
	}
	else if(attrs.failed !== undefined)
	{
		$('.success-bg').addClass('s-error')

		$('.success .s-title').html('Оплата не была произведена!')
		$('.success .s-desc').html('По каким-то причинам оплата не была произведена.<br>Но если с Вас уже списали деньги, то пожалуйста обратитесь на форум в специальную тему.')

		$('.success-bg').addClass('success-bg-show')
	}


	$(document).mouseup(elem =>
	{
		if($('.success-bg').hasClass('success-bg-show'))
		{
			$('.success-bg').removeClass('success-bg-show')
			history.pushState("", "", '/donate')
		}

		if($('.donate-info-wrap').hasClass('donate-info-wrap-show')
			&& $('.donate-info-wrap .info .info-list section').has(elem.target).length === 0) $('.donate-info-wrap').removeClass('donate-info-wrap-show')

		if($('.donate-form-input.donate-form-input-select .donate-select-list').hasClass('donate-select-list-show')
			&& $('.donate-form-input.donate-form-input-select .donate-select-list').has(elem.target).length === 0)
		{
			$('.donate-form-input.donate-form-input-select .donate-select-list').removeClass('donate-select-list-show')
			$('.donate-form-input.donate-form-input-select').removeClass('donate-select-list-show')
		}
	});


	$(`.donate-form .donate-form-info`).on('click', elem =>
	{
		$('#donate-info-server').addClass('donate-info-wrap-show')
	})
	$(`#donate-info-server section`).on('click', elem =>
	{
		const id = $(elem.currentTarget).attr('data-id')
		if(id === undefined || isNaN(id) || id === null || id < 0 || id >= serversDonatePrices.length)return false

		function pricesShow(item)
		{
			$('#donate-info-prices h3').text(`Что можно купить за RUB на ${item.serverName}`)
			$('#donate-info-prices .info-list').html('')
			item.prices.forEach(prices =>
			{
				$('#donate-info-prices .info-list').append(`
					<section>
						${prices.name}
						${prices.name === 'Обмен валюты' ? `<span>1 RUB - ${prices.price}$</span>` : `<span>${prices.price} RUB</span>`}
					</section>`)
			})

			$('#donate-info-prices').addClass('donate-info-wrap-show')
		}
		if(serversDonatePrices[id].loaded === true)return pricesShow(serversDonatePrices[id])

		loading.go()
		$.post('/donate/loadPrices', { server: id }, results =>
		{
			loading.stop()
			if(results === 'notfound')return dialog.show('error', 'error', null, 'Сервер не найден!')

			serversDonatePrices[id].loaded = true
			results.forEach(( item, slot ) => serversDonatePrices[id].prices[slot].price = item)

			pricesShow(serversDonatePrices[id])
		})
	})


	$('.donate-form-input.donate-form-input-select').on('click', elem =>
	{
		if($(elem.target).hasClass('donate-select-item'))
		{
			$('#donate-input-server').attr('data-id', $(elem.target).attr('data-id'))
			$('#donate-input-server').text($(elem.target).text())
		}

		if(!$('.donate-form-input.donate-form-input-select .donate-select-list').hasClass('donate-select-list-show'))
		{
			$('.donate-form-input.donate-form-input-select .donate-select-list').addClass('donate-select-list-show')
			$('.donate-form-input.donate-form-input-select').addClass('donate-select-list-show')
		}
		else
		{
			$('.donate-form-input.donate-form-input-select .donate-select-list').removeClass('donate-select-list-show')
			$('.donate-form-input.donate-form-input-select').removeClass('donate-select-list-show')
		}
	})
})
