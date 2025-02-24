export const bugsMenu =
{
	render: () =>
	{
		$('.wrapper').prepend(`
			<div class="bugs-menu">
				<h3>Баг трекер</h3>
				<div class="bugs-menu-wrap">
					<section class="input-label">
						<input id="bugs-menu-input-title" type="text" placeholder=" ">
						<label for="bugs-menu-input-title">Краткая суть бага</label>
					</section>
					<section class="input-label textarea-label">
						<textarea id="bugs-menu-input-text" rows="4" maxlength="255" placeholder="Как нашли, после каких действий случился баг, возможно как то исправили сами..."></textarea>
						<label for="bugs-menu-input-text">Подробное описание бага</label>
					</section>
					<section id="bugs-menu-types" class="bugs-menu-section-bg">
						<h4>Где нашли баг?</h4>
						<button data-id="site" class="button button-select">На сайте</button>
						<button data-id="server" class="button">На сервере</button>
					</section>
					<section class="bugs-menu-section-bg">
						<h4>Доказательства</h4>
						<div class="input-file">
							<input type="file" class="input-file" id="bugs-menu-images" multiple accept="image/jpeg,image/jpg,image/png">
							<label for="bugs-menu-images">
								<span>Загрузите скриншоты</span>
								<span>Файлов загружено</span>
								<svg height="512pt" viewBox="0 -24 512.00046 512" width="512pt" xmlns="http://www.w3.org/2000/svg"><path d="m413.492188 128.910156c-17.292969-86.765625-101.648438-143.082031-188.414063-125.789062-63.460937 12.648437-113.082031 62.238281-125.769531 125.691406-61.519532 7.089844-105.648438 62.707031-98.5625 124.230469 6.523437 56.621093 54.480468 99.339843 111.476562 99.300781h80.09375c8.847656 0 16.019532-7.171875 16.019532-16.019531 0-8.847657-7.171876-16.019531-16.019532-16.019531h-80.09375c-44.238281-.261719-79.882812-36.332032-79.625-80.566407.261719-44.234375 36.332032-79.882812 80.570313-79.625 8.164062.003907 15.023437-6.140625 15.921875-14.253906 8.132812-70.308594 71.722656-120.710937 142.03125-112.578125 59.109375 6.839844 105.738281 53.464844 112.574218 112.578125 1.34375 8.257813 8.5 14.308594 16.867188 14.253906 44.238281 0 80.097656 35.859375 80.097656 80.097657 0 44.234374-35.859375 80.09375-80.097656 80.09375h-80.09375c-8.847656 0-16.019531 7.171874-16.019531 16.019531 0 8.847656 7.171875 16.019531 16.019531 16.019531h80.097656c61.925782-.386719 111.816406-50.898438 111.433594-112.828125-.351562-56.394531-42.53125-103.753906-98.507812-110.605469zm0 0"/><path d="m313.019531 287.464844c6.148438 6.367187 16.289063 6.542968 22.652344.394531 6.363281-6.144531 6.539063-16.285156.394531-22.648437-.128906-.136719-.261718-.265626-.394531-.394532l-67.9375-67.953125c-6.246094-6.265625-16.390625-6.277343-22.65625-.03125-.007813.011719-.019531.019531-.027344.03125l-67.9375 67.953125c-6.363281 6.144532-6.539062 16.285156-.394531 22.648438 6.148438 6.363281 16.289062 6.539062 22.652344.394531.132812-.128906.265625-.261719.394531-.394531l40.609375-40.625v201.617187c0 8.847657 7.171875 16.019531 16.019531 16.019531 8.84375 0 16.015625-7.171874 16.015625-16.019531v-201.617187zm0 0"/></svg>
							</label>
						</div>
						<div class="input-label" style="margin-top: 20px; margin-bottom: 10px;">
							<input id="bugs-menu-input-video-url" type="text" placeholder=" ">
							<label for="bugs-menu-input-video-url">Или вставьте ссылку на видео</label>
						</div>
					</section>

					<section id="bugs-menu-btns">
						<button class="button" data-id="go">Отправить</button>
						<button class="button" data-id="cancel">X</button>
					</section>
				</div>
			</div>`)

		setTimeout(() => bugsMenu.show(), 200)
	},
	show: () =>
	{
		$('.bugs-menu #bugs-menu-input-title').val('')
		$('.bugs-menu #bugs-menu-input-text').val('')

		$('.wrapper .bugs-menu').addClass('bugs-menu-show')
	},
	hide: () =>
	{
		$('.wrapper .bugs-menu').removeClass('bugs-menu-show')
	}
}

$(document).ready(() =>
{
	$(document).on('click', '#bugs-menu-btns button', elem =>
	{
		const id = $(elem.currentTarget).attr('data-id')
		if(id === 'cancel')return bugsMenu.hide()


	})
})