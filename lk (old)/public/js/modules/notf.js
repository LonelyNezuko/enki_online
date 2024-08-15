import { loginData } from '../other-pages/login.js'

export const notf =
{
	reload: false,

	unread: (data = {}) =>
	{
		$.post('/notf/get', { all: 0 }, results =>
		{
			if(results === 'exit')return __removeAccCookies()

			$('#header-item-notf .header-item-notf').remove()
			if(results.length)
			{
				$('#header-item-notf').append(`<div class="header-item-notf">${results.length}</div>`)
				// if(data.display === undefined) notf.display.add(`У Вас <span style="color: #fda605;">${results.length}</span> не прочитаных уведомлений. <br>Откройте уведомления, чтобы прочитать их.`)
			}
		})
	},

	add: (text, accID = loginData.id) =>
	{
		// $.post('/notf/create', { accID: accID, text: text }, results =>
		// {
		// 	if(results === 'notfound'
		// 		|| results === 'error')return false

		// 	if(accID == loginData.id) notf.unread({ display: false })
		// })
	},

	display:
	{
		add: (text, data = {}) =>
		{
			if(data.color)
			{
				$('.notf').css("border-color", data.color)
				$('.notf .notf-timer').css("background-color", data.color)
			}

			$('.notf .notf-text').html(text)
			$('.notf .notf-timer').css('width', '100%')

			if(!$('.notf-all').hasClass('notf-all-show')) $('.notf').animate({ "top": "80px" }, 200)
			else $('.notf').animate({ "top": $('.notf-all').height() + $('.notf').height() + 50 + "px" }, 50)
			
			$('.notf .notf-timer').animate({ "width": "0" }, !data.time ? 5000 : data.time, () => $('.notf').animate({ "top": "-500px" }, 200))
		},
		show: () =>
		{
			if($('.notf-all').hasClass('notf-all-show')) notf.display.hide()
			else
			{
				$.post('/notf/get', { all: 1 }, results =>
				{
					if(results === 'exit')return __removeAccCookies()

					$('.notf-all .notf-all-items').html('')
					$('.notf-all .notf-all-remove').remove()

					$('#header-item-notf .header-item-notf').remove()

					if(!results.length) $('.notf-all .notf-all-items').html(`<div class="notf-all-item-error">Уведомлений не найдено!</div>`)
					else
					{
						results.forEach(item =>
						{
							$('.notf-all .notf-all-items').append(`
								<div class="notf-all-item ${!item.notfRead ? 'notf-all-item-read' : ""}">
								    <h2>${item.notfText}</h2>
								    <span>${new Date(item.notfDate).toLocaleString()}</span>
								</div>`)
						})
						$('.notf-all').append(`<div class="notf-all-remove">Очистить уведомления</div>`)
					}

					if(parseInt($('.notf').css('top')) > 0)
					{
						$('.notf').animate({ "top": $('.notf-all').height() + $('.notf').height() + 50 + "px" }, 50)
					}
					$('.notf-all').addClass('notf-all-show')
				})
			}
		},
		hide: () =>
		{
			$('.notf-all').removeClass('notf-all-show')
			if(parseInt($('.notf').css('top')) > 0
				&& parseInt($('.notf .notf-timer').css('width')) > 2) $('.notf').animate({ "top": "80px" }, 100)
		},
		remove: () =>
		{
			$.post('/notf/remove', {  }, results =>
			{
				if(results === 'exit')return __removeAccCookies()

				$('.notf-all .notf-all-items').html('')
				$('.notf-all .notf-all-remove').remove()

				$('.notf-all .notf-all-items').html(`<div class="notf-all-item-error">Уведомлений не найдено!</div>`)
			})
		}
	}
}

$(document).ready(() =>
{
	$('#header-item-notf').on('click', elem =>
	{
		let parent = $(elem.target)

		if(parent[0].localName == 'a')return notf.display.hide()
		if(parent[0].localName == 'img') parent = $(parent).parent()

		if(parent.attr('id') != 'header-item-notf')return false
		notf.display.show()
	})
	$('.notf-all').on('click', '.notf-all-remove', notf.display.remove)

	$(document).mouseup(elem =>
	{
		if($('.notf-all').hasClass('notf-all-show'))
		{
			var div = $('.notf-all')

			let parent = $(elem.target)
			if(parent[0].localName == 'img') parent = $(parent).parent()

			if(parent.attr('id') == 'header-item-notf')return false

			if(!div.is(elem.target)
			    && div.has(elem.target).length === 0) notf.display.hide()
		}
	});

	$('body').append(`
		<style>
			.notf
			{
				position: fixed;

				right: 40px;
				top: -500px;

				background-color: #eee;

				border: 2px solid #fda605;
				border-radius: 10px;

				z-index: 100;

				max-width: calc(400px - 30px);
				min-width: calc(150px - 30px);

				padding: 15px;
				transition: .5s;
			}

			.notf .notf-text
			{
				text-align: right;
			}
			.notf .notf-timer
			{
				margin-top: 20px;

				width: 100%;
				height: 3px;

				background-color: #fda605;
			}
		</style>

		<div class="notf">
		    <div class="notf-text"></div>
		    <div class="notf-timer"></div>
		</div>`)
})