const msearch =
{
	searchLoad: false,
	dialogid: null,

	show: ( dialogid, elements, data = {}) =>
	{
		if(!msearch.searchLoad) msearch.load()
		$('.m-search .m-search-body .m-search-results').html(``)

		msearch.dialogid = dialogid
		elements.forEach(item =>
		{
			$('.m-search .m-search-body .m-search-results').append(`
				<section data="${item.data}">
					<span>${item.name}</span>
					<input type="checkbox" ${item.checked ? "checked" : ""} class="checkbox">
				</section>`)
		})

		$('.m-search-bg').addClass('m-search-show')
	},
	close: () =>
	{
		$('.m-search-bg').removeClass('m-search-show')
		$(document).trigger('m-search-cancel', { dialogid: msearch.dialogid })
	},
	trigger: () =>
	{
		$(document).trigger('m-search-accept', { results: msearch.getResults(), dialogid: msearch.dialogid })
	},

	getResults: (checked = false) =>
	{
		const results = []
		$('.m-search .m-search-body .m-search-results section').each((i, item) =>
		{
			results.push({
				name: $(item).find('span').text(),
				checked: $(item).find('input[type="checkbox"]').is(':checked'),
				data: $(item).attr('data')
			})
		})
		return results
	},
	find: () =>
	{
		if(!$('.m-search-bg').hasClass('m-search-show'))return false

		const text = $('.m-search .m-search-body .m-search-find input').val()
		if(!text.length)
		{
			$('.m-search .m-search-body .m-search-results section').show()
			return false
		}

		$('.m-search .m-search-body .m-search-results section').each((i, item) =>
		{
			if($(item).find('span').text().toLowerCase().indexOf(text.toLowerCase()) === -1) $(item).hide()
			else $(item).show()
		})
		return true
	},

	load: () =>
	{
		msearch.searchLoad = true
		$('body').prepend(`
			<div class="m-search-bg">
				<style type="text/css">
					.m-search-bg
					{
						position: fixed;

						top: 0;
						left: 0;

						z-index: 2000;
						background-color: rgba(0, 0, 0, .5);

						opacity: 0;
						visibility: hidden;

						display: flex;
						justify-content: center;
						align-items: center;

						width: 100%;
						height: 100%;
					}
					.m-search-bg.m-search-show
					{
						opacity: 1;
						visibility: visible;
					}

					.m-search
					{
						width: 600px;

						max-width: 90%;
						min-height: 600px;

						background-color: white;
						box-shadow: 0 10px 13px 1px rgba(0, 0, 0, .15);

						border-radius: 8px 8px 0 0;
						overflow: hidden;
					}

					.m-search .m-search-title
					{
						background-color: #fda605;
						color: white;

						padding: 12px 20px;

						display: flex;
						justify-content: space-between;
						align-items: center;

						font-size: 18px;
					}
					.m-search .m-search-title div
					{
						font-size: 30px;

						cursor: pointer;
						transition: .2s;
					}
					.m-search .m-search-title div:hover
					{
						color: #eee;
					}

					.m-search .m-search-body
					{
						padding: 15px;
					}
					.m-search .m-search-body .m-search-find input
					{
						width: calc(100% - 40px);
						padding: 15px 20px;

						border: 0;
						background-color: #eee;

						border-radius: 4px;
					}
					.m-search .m-search-body .m-search-find input:focus
					{
						border: 0;
						outline: 0;
					}

					.m-search .m-search-body .m-search-results
					{
						margin-top: 30px;
						height: 350px;

						overflow-x: auto;
					}
					.m-search .m-search-body .m-search-results section
					{
						width: 100%;

						display: flex;
						justify-content: space-between;
						align-items: center;
					}
					.m-search .m-search-body .m-search-results section:not(:last-child)
					{
						margin-bottom: 15px;
						border-bottom: 1px solid #eee;

						padding-bottom: 16px;
					}
					.m-search .m-search-body .m-search-results section span
					{
						font-size: 15px;
					}

					.m-search .m-search-btn
					{
						margin-top: 30px;
						margin-bottom: 20px;

						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: row-reverse;

						padding: 0 25px;
					}
					.m-search .m-search-btn button
					{
						background-color: transparent;
						border: 0;

						padding: 8px 15px;
						border-radius: 5px;

						cursor: pointer;
						transition: .2s;

						margin: 0 5px;
					}
					.m-search .m-search-btn button:hover
					{
						background-color: #ececec;
					}

					.m-search .m-search-btn button[data-id="accept"]
					{
						background-color: #fda605;
						color: white;
					}
					.m-search .m-search-btn button[data-id="accept"]:hover
					{
						background-color: #ffb01e;
					}
				</style>
				<div class="m-search">
					<div class="m-search-title">
						Выберите игроков
						<div>&times;</div>
					</div>
					<div class="m-search-body">
						<div class="m-search-find">
							<input type="text" placeholder="Начните вводить ник">
						</div>
						<div class="m-search-results"></div>
					</div>
					<div class="m-search-btn">
						<button data-id="accept">Выбрать</button>
						<button data-id="cancel">Отмена</button>
					</div>
				</div>
			</div>`)

		$('.m-search .m-search-body .m-search-find input').on('input', (elem) => msearch.find())
		$('.m-search .m-search-title div').on('click', () => msearch.close())

		$('.m-search .m-search-btn button[data-id="cancel"]').on('click', () => msearch.close())
		$('.m-search .m-search-btn button[data-id="accept"]').on('click', () => msearch.trigger())
	}
}

// $(document).ready(() => msearch.show('test', [ { name: 'test', data: '1' }, { name: 'test 2', data: '2', checked: true }, { name: 'test 3', data: '3' }, { name: 'test 4', data: '4' } ]))
// $(document).on('m-search-accept', (elem, data) => console.log('trigger: ', data))