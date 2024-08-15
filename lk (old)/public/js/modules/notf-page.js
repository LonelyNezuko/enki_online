const notfPage =
{
	show: (message, type) =>
	{
		let items = localStorage.getItem('notf-page-closed')
		if(!items) items = ''

		if(items.indexOf(type) != -1)return false

		$('.wrapper').prepend(`
			<div class="notf-page" data-type="${type}">
				<div class="notf-page-title">
					<span>Уведомление</span>
					<div>
						<span></span>
					</div>
				</div>

				<div class="notf-page-text">
					${message}
				</div>
			</div>`)

		$('.notf-page .notf-page-title div').unbind().on('click', notfPage.hide)
	},
	hide: () =>
	{
		const type = $('.notf-page').attr('data-type')
		if(type && type !== 'global')
		{
			$('.notf-page').append(`
				<div class="notf-page-closed">
					<h1>Не показывать больше подобные уведомления?</h1>
					<div>
						<button class="button" id="notf-page-closed-no">Нет</button>
						<button class="button" id="notf-page-closed-yes">Да</button>
					</div>
				</div>`)

			$('.notf-page-closed').unbind().on('click', elem =>
			{
				const id = $(elem.target).attr('id')

				if(id === 'notf-page-closed-yes')
				{
					let items = localStorage.getItem('notf-page-closed')

					if(items) items = JSON.parse(items)
					else items = []

					items.push(type)
					localStorage.setItem('notf-page-closed', JSON.stringify(items))

					dialog.show('', 'success', null, 'Подобные уведомления больше не будут появляться у Вас.')
				}
				$('.notf-page').remove()
			})
		}
		else $('.notf-page').remove()
	}
}