import auth from '../../_auth.js'
import { ioConnect, ioSocket } from '../../_io.js'

export function _renderMessages(data)
{
    const
        account = JSON.parse(data).account,
        messagesGroup = JSON.parse(data).messagesGroup

    messagesGroup.forEach((item, i) =>
    {
        item.messages.forEach((mes, mesid) => messagesGroup[i].messages[mesid].accReads = JSON.parse(messagesGroup[i].messages[mesid].accReads))
    })

    console.log(messagesGroup)

    $('.header #headerItemMessages').addClass('header-item-select')

    $('.body').html(`
        <div class="mainbox" style="display: flex">
            <div class="mainbox-section mainbox-section-flex" style="width: 100%;">
                <h1>Сообщения</h1>
                <div class="mainbox-section-wrap" style="width: 350px; margin: 0;">
                    <input class="messages-search" type="text" placeholder="Поиск" />
                    <div class="messages"></div>
                </div>
                <div class="mainbox-section-wrap" style="width: calc(100% - 400px - 80px); margin: 0; margin-left: 80px;">
                    <div class="messages-div" style="display: none;">
                        <h2></h2>
                        <div class="messages-div-section"></div>
                        <div class="messages-div-input messages-div-input-disabled"></div>
                    </div>
                </div>
            </div>
        </div>`)

    function updateMessagesGroup()
    {
        $('.messages').html('')

        messagesGroup.forEach((item, i) =>
        {
            messagesGroup[i].lastMessageDate = +new Date(item.messages[item.messages.length - 1].date)
        })
        messagesGroup.sort((prev, next) => {
            if(prev.lastMessageDate > next.lastMessageDate)return -1
        })

        messagesGroup.forEach((item, i) =>
        {
            let
                groupAvatar = '/images/skins/-2.png',

                newMessages = 0,
                lastMessage = item.messages[item.messages.length - 1],

                lastMessageText = lastMessage.text

            if(item.accounts.length <= 2)
            {
                item.messages.forEach(mes =>
                {
                    if(mes.accID !== account.uid)
                    {
                        messages[i].title = mes.accName
                        groupAvatar = `/images/skins/${mes.accID === -1 ? -1 : mes.accSkin}.png`
                    }

                    if(mes.acc_reads.split(',').indexOf(account.uid.toString()) === -1) newMessages ++
                })
            }
            if(lastMessageText.length > 26)
            {
                lastMessageText = lastMessageText.substring(0, 26)
                lastMessageText += '...'
            }

            if(lastMessage.accID === account.uid) lastMessageText = '<span>Вы: </span>' + lastMessageText
            if(item.accounts.split(',').length > 2
                && lastMessage.accID !== account.uid)  lastMessageText = `<span>${lastMessage.accName}: </span>` + lastMessageText

            $('.messages').append(`
                <div class="messages-item ${parseInt($('.messages-div').attr('data-id')) === item.id ? "messages-item-select" : ""}" data-id="${item.id}" data-title="${messages[i].title}">
                    <div class="avatar ${groupAvatar === '/images/skins/-2.png' || groupAvatar === '/images/skins/-1.png' ? "avatar-img" : ""}">
                        <img src="${groupAvatar}" />
                    </div>
                    <div class="messages-item-box">
                        <h1>
                            <span>${messages[i].title}</span>
                            <span>${moment(new Date(lastMessage.date)).fromNow()}</span>
                        </h1>
                        <div>
                            <span>${lastMessageText}</span>
                            ${newMessages ? `<div class="messages-item-new">${newMessages}</div>` : ''}
                        </div>
                    </div>
                </div>`)

            ioSocket.off(`messages_${item.id}.new`)
            ioSocket.on(`messages_${item.id}.new`, result =>
            {
                addMessage(result.groupID, {
                    accID: result.account.uid,
                    accName: result.account.accName,
                    accSkin: result.account.accSkin,
                    acc_reads: '1',
                    date: new Date(result.date),
                    text: result.text,
                    textAns: 0
                })
            })
        })
    }
    function addMessage(gid, data)
    {
        let group_id = -1
        messages.forEach((item, i) =>
        {
            if(item.id === gid) group_id = i
        })
        if(group_id === -1)return false

        messages[group_id].messages.push({
            accID: data.accID,
            accName: data.accName,
            accSkin: data.accSkin,
            acc_reads: '1',
            date: new Date(),
            group_id: gid,
            text: data.text,
            textAns: 0
        })
        updateMessages()

        if(parseInt($('.messages-div').attr('data-id')) === gid)
        {
            $('.messages-div .messages-div-section').append(`
                <div class="messages-div-section-item messages-div-section-item-me">
                    <div class="messages-div-section-item-avatar">
                        <div>
                            <img src="/images/skins/${data.accSkin}.png" />
                        </div>
                        <h6>${moment(data.date).fromNow()}</h6>
                    </div>
                    <div class="messages-div-section-item-text">
                        <span>${data.text}</span>
                    </div>
                </div>`)

            if(data.accID === account.uid) $('.messages-div .messages-div-section').scrollTop($('.messages-div .messages-div-section')[0].scrollHeight)
        }
    }
    function enterMessage()
    {
        const
            gid = parseInt($('.messages-div').attr('data-id')),
            text = $('.messages-div .messages-div-input input').val()

        if(gid === undefined || isNaN(gid) || gid < 0)return false
        if(!text.length)return false

        let group_id = -1
        messages.forEach((item, i) =>
        {
            if(item.id === gid) group_id = i
        })
        if(group_id === -1)return false

        $('.messages-div .messages-div-input input').val('')
        $.post('/messages/_send', { groupID: gid, text: text }, result =>
        {
            if(result === 'remove_cookies')return auth.removeAccountCookies()

            ioSocket.emit('messages.new', {
                groupID: gid,
                text: text,
                account: {
                    uid: account.uid,
                    accName: account.data.pName,
                    accSkin: account.data.pSkin
                },
                date: new Date()
            })
        })
    }
    function openMessage(gid)
    {
        if(gid === undefined || isNaN(gid) || gid < 0)return false

        let group_id = -1
        messages.forEach((item, i) =>
        {
            if(item.id === gid) group_id = i
        })
        if(group_id === -1)return false

        $('.messages .messages-item').removeClass('messages-item-select')
        if(parseInt($('.messages-div').attr('data-id')) === gid)
        {
            $('.messages-div').removeAttr('data-id')
            return $('.messages-div').hide()
        }

        $('.messages-div').attr('data-id', gid)
        $('.messages-div h2').html(messages[group_id].title)
        $('.messages-div .messages-div-section').html('')

        let unreadCount = 0
        messages[group_id].messages.forEach((item, i) =>
        {
            $('.messages-div .messages-div-section').append(`
                <div class="messages-div-section-item ${item.accID === account.uid ? "messages-div-section-item-me" : ""} ">
                    <div class="messages-div-section-item-avatar ${item.accID === -1 ? 'messages-div-section-item-avatar-un' : ""}">
                        <div>
                            <img src="/images/skins/${item.accID === -1 ? -1 : item.accSkin}.png" />
                        </div>
                        <h6>${moment(new Date(item.date)).fromNow()}</h6>
                    </div>
                    <div class="messages-div-section-item-text">
                        ${item.accID !== account.uid ? `<h2>${item.accName}</h2>` : ""}
                        <span>${item.text}</span>
                    </div>
                </div>`)

            if(item.acc_reads.split(',').indexOf(account.uid.toString()) === -1)
            {
                if(messages[group_id].messages[i].acc_reads.length) messages[group_id].messages[i].acc_reads += `,${account.uid}`
                else messages[group_id].messages[i].acc_reads += `${account.uid}`

                unreadCount ++
            }
        })

        if(messages[group_id].notanswered)
        {
            $('.messages-div .messages-div-input').addClass('messages-div-input-disabled')
            $('.messages-div .messages-div-input').html(`<h3>Вы не можете отправлять сообщения</h3>`)
        }
        else
        {
            $('.messages-div .messages-div-input').removeClass('messages-div-input-disabled')
            $('.messages-div .messages-div-input').html(`
                <input type="text" placeholder="Напишите сообщение..." />
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewbox="0 0 495.003 495.003">
                    <path d="M164.711,456.687c0,2.966,1.647,5.686,4.266,7.072c2.617,1.385,5.799,1.207,8.245-0.468l55.09-37.616l-67.6-32.22V456.687z"></path>
                    <path d="M492.431,32.443c-1.513-1.395-3.466-2.125-5.44-2.125c-1.19,0-2.377,0.264-3.5,0.816L7.905,264.422c-4.861,2.389-7.937,7.353-7.904,12.783c0.033,5.423,3.161,10.353,8.057,12.689l125.342,59.724l250.62-205.99L164.455,364.414l156.145,74.4c1.918,0.919,4.012,1.376,6.084,1.376c1.768,0,3.519-0.322,5.186-0.977c3.637-1.438,6.527-4.318,7.97-7.956L494.436,41.257C495.66,38.188,494.862,34.679,492.431,32.443z"></path>
                </svg>`)
        }

        $('.messages-div').show()
        $('.messages-div .messages-div-section').scrollTop($('.messages-div .messages-div-section')[0].scrollHeight)

        $(`.messages .messages-item[data-id="${gid}"]`).addClass('messages-item-select')
        if(unreadCount)
        {
            $.post('/messages/_read', { groupID: messages[group_id].id }, result =>
            {
                if(result === 'remove_cookies')return auth.removeAccountCookies()
            })

            const freeMessages = $('.header #headerItemMessages h6').attr('data-count')
            if(freeMessages - unreadCount <= 0) $('.header #headerItemMessages h6').remove()
            else
            {
                $('.header #headerItemMessages h6').attr('data-count', freeMessages - unreadCount)
                $('.header #headerItemMessages h6').html(freeMessages - unreadCount > 99 ? '99+' : `${freeMessages - unreadCount}`)
            }

            $(`.messages .messages-item[data-id="${gid}"] .messages-item-box div .messages-item-new`).remove()
        }
    }
    $('.messages').on('click', '.messages-item', elem => openMessage(parseInt($(elem.currentTarget).attr('data-id'))))

    $('.messages-div .messages-div-input').on('click', 'svg', () => enterMessage)
    $(document).keyup(elem =>
    {
    	if(elem.keyCode === 13
            && $('.messages-div .messages-div-input input').is(":focus")) enterMessage()
    });

    $('.messages-search').on('input', () =>
    {
        const text = $('.messages-search').val()

        if(!text.length) $('.messages .messages-item').show()
        else
        {
            $('.messages .messages-item').each((i, item) =>
            {
                if($(item).attr('data-title').indexOf(text) === -1) $(item).hide()
            })
        }
    })

    // updateMessages()
}
