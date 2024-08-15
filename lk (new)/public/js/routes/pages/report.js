import { reportStatusNames } from '../../_other.js'
import { url } from '../../_url.js'

export function _renderReports(data)
{
    const
        account = JSON.parse(data).account,

        reports = JSON.parse(data).reports,
        reportsMe = JSON.parse(data).reportsMe,

        allReports = []

    reports.forEach(item => allReports.push(item))
    reportsMe.forEach(item => allReports.push(item))

    console.log(reports, reportsMe)
    $('.menu .menu-nav-item[href="/report"]').addClass('menu-nav-item-select')

    function updateReports(_reports, _reportsMe)
    {
        $('#_reports .report').html('')
        _reports.forEach(item =>
        {
            $('#_reports .report').append(`
                <a href="/report?id=${item.reportID}" class="report-item" data-id="${item.reportID}">
                    <div class="report-item-header">
                        <section>
                            <button class="report-tag" style="background-color: #6a86cd; color: white;">Админ</button>
                            <h1>${item.reportName}</h1>
                        </section>
                        <span>${moment(new Date(item.reportCreateDate)).fromNow()}</span>
                    </div>
                    <div class="report-item-body">
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/${item.reportCreatorData.pSkin}.png">
                            </div>
                            <span class="href"}">${item.reportCreatorData.pName}</span>
                        </section>
                        <h3></h3>
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/${item.reportPlayerData.pSkin}.png">
                            </div>
                            <span class="href">${item.reportPlayerData.pName}</span>
                        </section>
                    </div>
                    <button class="report-status report-item-status" style="background-color: ${reportStatusNames[item.reportStatus].color}; color: ${reportStatusNames[item.reportStatus].textColor};">${reportStatusNames[item.reportStatus].name}</button>
                </a>`)
        })

        $('#_reportsMe .report').html('')
        _reportsMe.forEach(item =>
        {
            $('#_reportsMe .report').append(`
                <a href="/report?id=${item.reportID}" class="report-item" data-id="${item.reportID}">
                    <div class="report-item-header">
                        <section>
                            <button class="report-tag" style="background-color: #6a86cd; color: white;">Админ</button>
                            <h1>${item.reportName}</h1>
                        </section>
                        <span>${moment(new Date(item.reportCreateDate)).fromNow()}</span>
                    </div>
                    <div class="report-item-body">
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/${item.reportCreatorData.pSkin}.png">
                            </div>
                            <span class="href">${item.reportCreatorData.pName}</span>
                        </section>
                        <h3></h3>
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/${item.reportPlayerData.pSkin}.png">
                            </div>
                            <span class="href">${item.reportPlayerData.pName}</span>
                        </section>
                    </div>
                    <button class="report-status report-item-status" style="background-color: ${reportStatusNames[item.reportStatus].color}; color: ${reportStatusNames[item.reportStatus].textColor};">${reportStatusNames[item.reportStatus].name}</button>
                </a>`)
        })
    }

    let openedReport
    function showReportMessages(repid)
    {
        if(openedReport) hideReportMessages()

        allReports.forEach(item =>
        {
            if(item.reportID === repid) openedReport = item
        })
        if(!openedReport)return

        $('.report-modal .report-modal-header section:first-child h1').html(openedReport.reportName)

        $('.report-modal .report-modal-header section:last-child .report-status').html(reportStatusNames[openedReport.reportStatus].name)
        $('.report-modal .report-modal-header section:last-child .report-status').css({ 'background-color': reportStatusNames[openedReport.reportStatus].color, 'color': reportStatusNames[openedReport.reportStatus].textColor })

        $('.report-modal .report-modal-body').html('')
        openedReport.messages.forEach(item =>
        {
            let messageRole = ''

            if(item.messageCreator === openedReport.reportCreatorData.pID) messageRole = '<span id="reportModalMessageRoleOwner">Автор жалобы</span>'
            if(item.messageCreator === openedReport.reportPlayerData.pID) messageRole = '<span id="reportModalMessageRoleSuspect">Подозреваемый</span>'
            if(item.messageCreator !== openedReport.reportCreatorData.pID
                && item.messageCreator !== openedReport.reportPlayerData.pID
                && item.messageAdmin) messageRole = '<span id="reportModalMessageRoleAdm">Администратор</span>'

            $('.report-modal .report-modal-body').append(`
                <div class="report-modal-message ${item.messageCreator === account.uid ? 'report-modal-message-me' : ''}">
                    <section>
                        <div class="avatar avatar-medium">
                            <img src="/images/skins/${item.messageCreatorData.pSkin}.png">
                        </div>
                        <h2>${moment(new Date(item.messageCreateDate)).fromNow()}</h2>
                    </section>
                    <section>
                        <h2>
                            ${item.messageCreatorData.pName}
                            ${messageRole}
                        </h2>
                        <div class="report-modal-message-text">
                            ${item.messageText}
                        </div>
                    </section>
                </div>`)
        })

        if(openedReport.reportStatus === 0
            || openedReport.reportStatus === 3)
        {
            $('.report-modal').removeClass('report-modal-not-input')
            $('.report-modal').append(`
                <div class="report-modal-input">
                    <h2>Нажмите, чтобы открыть поле ввода</h2>
                </div>`)
        }
        else
        {
            $('.report-modal .report-modal-input').remove()
            $('.report-modal').addClass('report-modal-not-input')
        }

        $('#modal-wrap-reports').addClass('modal-wrap-show')
    }
    function hideReportMessages()
    {
        openedReport = undefined
        $('#modal-wrap-reports').removeClass('modal-wrap-show')

        url.set('/report')
    }

    function searchReport(repname, reptype)
    {
        if(repname.length === 0)return updateReports(reports, reportsMe)
        var reps = []

        if(!reptype.length) reports.forEach(item => reps.push(item))
        else if(reptype.length) reportsMe.forEach(item => reps.push(item))

        reps.forEach((item, i) =>
        {
            if(item.reportName.indexOf(repname) === -1) reps.splice(i, 1)
        })

        updateReports(!reptype.length ? reps : reports, !reptype.length ? reportsMe : reps)
    }

    function openCreateReport()
    {

    }

    $('.body').html(`
        <div class="mainbox" style="display: flex; justify-content: space-between; flex-wrap: wrap; align-items: flex-start;">
            <div class="mainbox-section mainbox-section-flex" style="width: calc(50% - 40px)" id="_reports">
                <h1 style="display: flex; justify-content: space-between; align-items: center;">
                    Жалобы от меня
                    <a href="/report#create" class="button">Написать жалобу</a>
                </h1>
                <div class="mainbox-section-wrap" style="width: 100%; margin: 0;">
                    <input class="messages-search" type="text" placeholder="Поиск" style="width: 60%;" />
                    <div class="report"></div>
                </div>
            </div>
            <div class="mainbox-section mainbox-section-flex" style="width: calc(50% - 40px)" id="_reportsMe">
                <h1 style="display: flex; justify-content: space-between; align-items: center;">
                    Жалобы на меня
                    <a class="button" style="position: relative; z-index: -1;">Написать жалобу</a>
                </h1>
                <div class="mainbox-section-wrap" style="width: 100%; margin: 0;">
                    <input class="messages-search" type="text" placeholder="Поиск" style="width: 60%;" />
                    <div class="report"></div>
                </div>
            </div>
        </div>`)
    $('.body').append(`
        <div class="modal-wrap" id="modal-wrap-reports">
            <div class="report-modal">
                <div class="report-modal-header">
                    <section>
                        <button class="report-tag" style="background-color: #6a86cd; color: white;">Админ</button>
                        <h1>Название репорта</h1>
                    </section>
                    <section>
                        <button class="report-status report-modal-status">На проверке</button>
                        <div class="close-btn" id="reportModalClose"></div>
                    </section>
                </div>
                <div class="report-modal-body"></div>
            </div>
        </div>`)

    $('.body').append(`
        <div class="modal-wrap modal-wrap-show" id="modal-wrap-create-report">
            <div class="report-modal">
                <div class="report-modal-header">
                    <section>
                        <h1>Создание жалобы</h1>
                    </section>
                    <section>
                        <div class="close-btn" id="reportModalClose"></div>
                    </section>
                </div>
                <div class="report-modal-body">
                    <!-- <div class="report-add-player">
                        <input type="text" placeholder="Найти игрока...">
                        <button>По нику</button>
                    </div>
                    <div class="report-add-searching">
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/120.png">
                            </div>
                            <h1>dasdsadasdsadsadsadasddd (ID: 12312312313)</h1>
                        </section>
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/120.png">
                            </div>
                            <h1>dasdsadasdsadsadsadasddd (ID: 12312312313)</h1>
                        </section>
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/120.png">
                            </div>
                            <h1>dasdsadasdsadsadsadasddd (ID: 12312312313)</h1>
                        </section>
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/120.png">
                            </div>
                            <h1>dasdsadasdsadsadsadasddd (ID: 12312312313)</h1>
                        </section>
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/120.png">
                            </div>
                            <h1>dasdsadasdsadsadsadasddd (ID: 12312312313)</h1>
                        </section>
                        <section>
                            <div class="avatar">
                                <img src="/images/skins/120.png">
                            </div>
                            <h1>dasdsadasdsadsadsadasddd (ID: 12312312313)</h1>
                        </section>
                    </div> -->

                    <div class="report-add-body">
                        <div class="report-add-body-player">
                            <h2>Вы подаете жалобу на</h2>
                            <section>
                                <div class="avatar avatar-medium">
                                    <img src="/images/skins/120.png">
                                </div>
                                <h1>MyAngelNezuko <br><span>(ID: 12312312313)</span></h1>
                            </section>
                        </div>

                        <div class="report-add-body-header">
                            <div class="input input-white">
                                <input id="test2134" type="text" placeholder=" ">
                                <label for="test2134">Введите название жалобы</label>
                            </div>
                        </div>

                        <div class="report-add-body-bottom">
                            <div class="textarea textarea-white">
                                <textarea id="texsadas" placeholder=" "></textarea>
                                <label for="texsadas">Опишите Вашу жалобу</label>
                            </div>
                            <div class="report-add-body-bottom-attachments">
                                <div class="report-add-body-bottom-attachments-add">
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512">
                                        <path d="M467.076,68.86c-59.902-59.902-156.846-59.896-216.741,0L34.919,284.276c-46.558,46.557-46.558,122.312,0,168.87 c46.57,46.571,122.326,46.544,168.87,0L419.205,237.73c33.36-33.36,33.36-87.64,0-121c-33.359-33.361-87.64-33.361-121,0 L114.478,300.457c-6.975,6.975-6.975,18.285,0,25.259c6.975,6.975,18.285,6.975,25.259,0l183.727-183.727c19.432-19.432,51.05-19.432,70.481,0c19.431,19.432,19.431,51.05,0,70.481L178.53,427.887c-32.71,32.71-85.646,32.706-118.352,0c-15.806-15.806-24.511-36.821-24.511-59.175s8.706-43.369,24.511-59.176L275.594,94.119c45.94-45.94,120.287-45.934,166.222,0c45.827,45.828,45.827,120.395,0,166.222l-95.741,95.741c-6.975,6.975-6.975,18.284,0,25.259s18.285,6.975,25.259,0l95.741-95.741C526.978,225.7,526.971,128.754,467.076,68.86z"/>
                                    </svg>
                                    <div>
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 490 490">
                                                <path d="M0,439.576h490V50.424H0V439.576z M30.625,81.049h428.75v327.902H30.625V81.049z"/>
                                                <path d="M213.627,266.395l-36.11-41.73L65.66,353.933h105.702h118.014H424.34L281.107,188.42L213.627,266.395z M171.362,323.308h-38.71l44.85-51.848l44.881,51.848H171.362z M262.875,323.308l-29-33.513l47.231-54.579l76.241,88.093H262.875z"/>
                                                <path d="M211.481,208.235c21.713,0,39.368-17.625,39.368-39.261c0-21.667-17.655-39.277-39.368-39.277c-21.713,0-39.368,17.609-39.368,39.277C172.113,190.625,189.768,208.235,211.481,208.235z M211.481,160.307c4.823,0,8.743,3.889,8.743,8.652c0,4.762-3.92,8.636-8.743,8.636c-4.824,0-8.743-3.874-8.743-8.636C202.738,164.196,206.658,160.307,211.481,160.307z"/>
                                            </svg>
                                        </button>
                                        <button>
                                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 49 49">
                                                <path d="M39.256,6.5H9.744C4.371,6.5,0,10.885,0,16.274v16.451c0,5.39,4.371,9.774,9.744,9.774h29.512c5.373,0,9.744-4.385,9.744-9.774V16.274C49,10.885,44.629,6.5,39.256,6.5z M47,32.726c0,4.287-3.474,7.774-7.744,7.774H9.744C5.474,40.5,2,37.012,2,32.726V16.274C2,11.988,5.474,8.5,9.744,8.5h29.512c4.27,0,7.744,3.488,7.744,7.774V32.726z"/>
                                                <path d="M33.36,24.138l-13.855-8.115c-0.308-0.18-0.691-0.183-1.002-0.005S18,16.527,18,16.886v16.229c0,0.358,0.192,0.69,0.502,0.868c0.154,0.088,0.326,0.132,0.498,0.132c0.175,0,0.349-0.046,0.505-0.137l13.855-8.113c0.306-0.179,0.495-0.508,0.495-0.863S33.667,24.317,33.36,24.138z M20,31.37V18.63l10.876,6.371L20,31.37z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </duv>
                            </div>
                        </div>
                    </div>

                    <div class="report-add-btns">
                        <button class="button">Далее</button>
                    </div>
                </div>
            </div>
        </div>`)

    selectmenu.add('.report-add-body-header', 'reportCreateSelectTag', 'Выберите тег', [ { id: 1, name: 'Админ' }, { id: 1, name: 'Развод' } ])
    $('.report-add-body-header .selectmenu').addClass('selectmenu-white')

    $('.body').on('click', '#modal-wrap-reports .close-btn', () => hideReportMessages())

    $('.body').on('input', '#_reports .messages-search', elem => searchReport($(elem.currentTarget).val(), ''))
    $('.body').on('input', '#_reportsMe .messages-search', elem => searchReport($(elem.currentTarget).val(), 'me'))

    $('.body').on('click', '.report-add-body-bottom-attachments-add', elem =>
    {
        $(elem.currentTarget).toggleClass('report-add-body-bottom-attachments-add-show')
    })
    $(document).mouseup(e =>
	{
		if($('.report-add-body-bottom-attachments-add').hasClass('report-add-body-bottom-attachments-add-show'))
		{
			if(!$('.report-add-body-bottom-attachments-add').is(e.target)
			    && $('.report-add-body-bottom-attachments-add').has(e.target).length === 0) $('.report-add-body-bottom-attachments-add').removeClass('report-add-body-bottom-attachments-add-show')
		}
	})

    updateReports(reports, reportsMe)
    if(url.getSearch(window.location.href).id) showReportMessages(parseInt(url.getSearch(window.location.href).id))
}
