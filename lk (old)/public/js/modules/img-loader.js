const imgLoader =
{
	create: (elem, data = {}) =>
	{
		if(!elem
			|| !$('*').is('#reportAddImgInput'))return false

		$(elem).addClass('img-loader-hide-input')
		$(elem).after(`
			<div class="img-loader" data-img-loader-elem="${elem}">
				<style>
					.img-loader-hide-input
					{
						opacity: 0;
						visibility: hidden;

						position: absolute;
						z-index: -1;
					}
					.img-loader button.img-loader-load
					{
						padding: 15px 30px;

						color: white;
						background-color: #d0d0d0;

						cursor: pointer;
						transition: .3s;
					}
					.img-loader button.img-loader-load:hover
					{
						background-color: #fda605;
					}

					.img-loader .img-loader-items
					{
						display: flex;
						align-items: center;

						flex-wrap: wrap;
						margin-top: 15px;
					}
					.img-loader .img-loader-items .img-loader-item
					{
						margin-right: 10px;
						position: relative;
					}
					.img-loader .img-loader-items .img-loader-item img
					{
						width: 120px;
						height: auto;
					}
					.img-loader .img-loader-items .img-loader-item .img-loader-item-close
					{
						opacity: 0;
						visibility: hidden;

						position: absolute;

						top: 0;
						right: 0;

						background-color: rgb(238, 238, 238, .5);

						height: 20px;
						width: 20px;

						display: flex;
						align-items: center;
						justify-content: center;

						font-weight: bold;

						cursor: pointer;
						transition: .3s;
					}
					.img-loader .img-loader-items .img-loader-item .img-loader-item-info
					{
						opacity: 0;
						visibility: hidden;

						position: absolute;

						bottom: 0;
						left: 0;

						background-color: rgb(238, 238, 238, .8);

						width: 100%;
						height: 25px;

						display: flex;
						align-items: center;
						justify-content: center;

						transition: .3s;
					}

					.img-loader .img-loader-items .img-loader-item:hover .img-loader-item-info,
					.img-loader .img-loader-items .img-loader-item:hover .img-loader-item-close
					{
						opacity: 1;
						visibility: visible;
					}
				</style>

				<button class="img-loader-load">Загрузить изображения</button>
			    <div class="img-loader-items"></div>
			</div>`)

		$('body').on('click', `.img-loader[data-img-loader-elem="${elem}"]`, () => )
	}

	// .img-loader-item
	// 	img(src="/styles/images/links/enki.png", alt="Изображение")
	// 	span.img-loader-item-close &times;
	// 	span.img-loader-item-info name.jpg
}

$(document).ready(() =>
{
	imgLoader.create('#reportAddImgInput')
})