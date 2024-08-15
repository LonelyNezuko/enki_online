let
	swipingInterval,
	swipingTime = false

const servers = [
	{ hostname: 'Enki Online | Royal', status: 2, ip: '88.208.241.199', port: '7777', maxplayers: 1000, players: 0 }
]

// servers.push({ hostname: api.hostname, ip: api.ip, maxplayers: api.maxplayers, players: api.players, port: api.port, status: api.status })
// api = undefined

function swipingInfoText(id = null)
{
	if(swipingTime == true)return false

	let targetID = $('.info .text .text-wrap-show').attr('data-info-text-id')
	if(targetID == undefined)
	{
		clearInterval(swipingInterval)
		return false
	}

	if(id != null && id === targetID)return false
	swipingTime = true

	$('.info .text .text-wrap-show').removeClass('text-wrap-show')
	$(`.info .right .bottom .sliders button.sliders-select`).removeClass('sliders-select')

	if(id == null
		&& id >= 0
		&& id < 2)
	{
		if(targetID == 0) targetID = 50
		else if(targetID == 50) targetID = 100
		else if(targetID == 100) targetID = 0

		$(`.info .text .text-body`).css({ 'right': `calc(${targetID}% + ${targetID}%)` })
		$(`.info .text .text-wrap[data-info-text-id="${targetID}"]`).addClass('text-wrap-show')

		$(`.info .text .text-wrap[data-info-text-id="${targetID}"]`).addClass('text-wrap-show')
		$(`.info .right .bottom .sliders button[data-info-text-id="${targetID}"]`).addClass('sliders-select')
	}
	else
	{
		$(`.info .text .text-body`).css({ "right": `calc(${id}% + ${id}%)` })

		$(`.info .text .text-wrap[data-info-text-id="${id}"]`).addClass('text-wrap-show')
		$(`.info .right .bottom .sliders button[data-info-text-id="${id}"]`).addClass('sliders-select')

		clearInterval(swipingInterval)
		swipingInterval = setInterval(swipingInfoText, 7400)
	}

	setTimeout(() => swipingTime = false, 1200)
}

const elementsScroll =
{
	servers: false,
	footer: false
}
$(window).scrollTop(0)

$(document).ready(() =>
{
	swipingInterval = setInterval(swipingInfoText, 7400)
	$(`.info .right .bottom .sliders button`).on('click', elem =>
	{
		const id = $(elem.target).attr('data-info-text-id')
		if(!id)return false

		swipingInfoText(id)
	})

	$.post('/get_servers', {}, results => {
		let serverIPCopied
		JSON.parse(results).forEach((item, i) =>
		{
			let onlineCount = null
			if(item.status !== 0)
			{
				onlineCount = 100 / (item.maxplayers / item.players)
				onlineCount = (126 / 100) * onlineCount
			}

			$(`.servers .wrap .flex`).append(`
				<${item.status === 1 ? "a" : "div"} class="srv-info" id="ip-${i}">
					${item.status !== 0 ? `<input type="text" value="${item.ip}:${item.port}" style="position: absolute; top: -1000; left: -1000; opacity: 0;"/>` : ""}
					<div class="online-draw">
						<div class="online-draw-wrap">
							<div class="online-draw-count">
								${item.status !== 0 ? `<svg id="spinner" viewBox="0 0 50 50">
										<circle id="path" cx="25" cy="25" r="20" fill="none" stroke-width="6" style="stroke-dashoffset: ${-126 + onlineCount};"></circle>
									</svg>` : ""}
							</div>
						</div><span class="online-draw-text">enki</span>
					</div>
					<div class="other">
						<h4>${item.hostname}</h4>
						<div class="online-text">
						${item.status === 0 ? '<div style="background-color: red;"></div><span>Offline</span>' : item.status === 2 ? `<div style="background-color: #ffb64c;"></div><span>${item.date || 'Скоро'}</span>` : `<div></div><span>Online: <span>${item.players} / ${item.maxplayers}</span></span>`}
						</div>
					</div>
					${item.status === 1 || (item.status === 2 && item.date) ? '<section>Подключиться?</section>' : ""}
				</${item.status === 1 ? "a" : "div"}>`)

			if(item.status !== 0)
			{
				$(`#ip-${i}`).on('click', elem =>
				{
					$(elem.currentTarget).find('input').select()
					document.execCommand("copy")

					switch(serverIPCopied)
					{
						case 0:
							$(elem.currentTarget).find('section').text('Скопировано!')
							break
						case 1:
							$(elem.currentTarget).find('section').text('Скопировано! x2')
							break
						case 2:
							$(elem.currentTarget).find('section').text('Скопировано! x3')
							break
						case 3:
							$(elem.currentTarget).find('section').text('Тебе мало?')
							break
						case 4:
							$(elem.currentTarget).find('section').text('Ладно, держи еще раз')
							break
						case 5:
							$(elem.currentTarget).find('section').text('Да ты псих!')
							break
						case 6:
							$(elem.currentTarget).find('section').text('Ну иди играй уже!')
							break
						case 7:
							$(elem.currentTarget).find('section').text('Окей, я вызываю санитаров')
							break
						case 8:
							$(elem.currentTarget).find('section').text('ХВАТИТ!!!')
							break
						case 9:
							$(elem.currentTarget).find('section').text('АААААААААААААААААААААА!!!!!!!11111!!!!11111')
							break
						case 10:
							$(elem.currentTarget).find('section').text('Парни, в 8 майонезную палату его')
							break
					}

					serverIPCopied ++
					if(serverIPCopied > 10) serverIPCopied = 0
				})
				$(`#ip-${i}`).hover(elem =>
				{
					serverIPCopied = 0
					$(elem.currentTarget).find('section').text('Подключиться?')
				})
			}
		})
	})

	$.post('/get_last_news', {}, results =>
	{
		loading.stop()

		if(results === 'notfound') $('.last-news .flex').html('<div class="news-error">Новостей на найдено!</div>')
		else
		{
			results = JSON.parse(results)

			$('.last-news .flex').html(`
				<div class="news"></div>
				<a class="arrow" href="/news">
					<span></span>
					<span></span>
				</a>`)
			results.forEach(item =>
			{
				$('.last-news .flex .news').append(`
					<a href="/news?id=${item.id}">
						<div class="bg-notfound"></div>
						<div class="bg" style="background-image: url(${item.attachments[0].photo ? item.attachments[0].photo.sizes[4].url : ""});"></div>

					    <div class="news-anim">
					        <div class="news-anim-wrap">
					        	<img src="/images/news/look_anim.png" alt="Анимация" />
					        	<span>Смотреть</span>
					        </div>
					    </div>
					</a>`)
			})
		}
	})

	// $(window).scroll(() =>
	// {
	// 	const
	// 		scroll = $(window).scrollTop() + $(window).height(),

	// 		servers = $('.servers').offset().top,
	// 		footer = $('.footer').offset().top

	// 	if(scroll > servers
	// 		&& elementsScroll.servers == false)
	// 	{
	// 		$('.servers .wrap .flex').css('animation', 'flipInX 2s ease')
	// 		$('.servers .wrap h3').css('animation', 'flipInX 2s ease')

	// 		elementsScroll.servers = true
	// 	}
	// 	// if(scroll > footer
	// 	// 	&& elementsScroll.footer == false)
	// 	// {
	// 	// 	$('.footer .wrap').css('animation', 'bounceInDown 2s ease')
	// 	// 	elementsScroll.footer = true
	// 	// }
	// });
})
