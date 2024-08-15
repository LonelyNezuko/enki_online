const loading =
{
	loadBody: false,

	go: (data = {}) =>
	{
		if(!loading.loadBody) loading.create()

		if(data.black) $('.loading').addClass('loading-black')
		else $('.loading').removeClass('loading-black')

		$('.loading').addClass('loading-go')
	},
	stop: () =>
	{
		$('.loading').removeClass('loading-go')
	},

	create: () =>
	{
		loading.loadBody = true
		$('body').append(`
			<div class="loading">
				<style>
					.loading
					{
						position: fixed;

						top: 0;
						left: 0;

						width: 100vw;
						height: 100vh;

						display: flex;
						justify-content: center;
						align-items: center;

						z-index: 6000;
						background-color: rgba(0, 0, 0, .5);

						opacity: 0;
						visibility: hidden;
					}
					.loading.loading-go
					{
						opacity: 1;
						visibility: visible;
					}
					.loading.loading-black
					{
						background-color: black;
					}

					.loading .loading-ring
					{
						display: inline-block;
						position: relative;
						width: 80px;
						height: 80px;
					}
					.loading .loading-ring div
					{
						box-sizing: border-box;
						display: block;
						position: absolute;
						width: 64px;
						height: 64px;
						margin: 8px;
						border: 8px solid #fff;
						border-radius: 50%;
						animation: loading-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
						border-color: #fff transparent transparent transparent;
					}
					.loading .loading-ring div:nth-child(1)
					{
						animation-delay: -0.45s;
					}
					.loading .loading-ring div:nth-child(2)
					{
					  	animation-delay: -0.3s;
					}
					.loading .loading-ring div:nth-child(3)
					{
					  	animation-delay: -0.15s;
					}
					@keyframes loading-ring
					{
						0%
						{
							transform: rotate(0deg);
						}
						100%
						{
							transform: rotate(360deg);
						}
					}
				</style>

				<div class="loading-ring">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>`)
	}
}

loading.go({ black: true })