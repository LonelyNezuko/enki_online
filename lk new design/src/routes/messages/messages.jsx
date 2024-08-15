import React from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'
import 'jquery.scrollto'
import autosize from 'autosize'

import Moment from 'moment'
import 'moment/locale/ru'

import LoaderMini from '../../components/loaderMini/loaderMini'
import Avatar from '../../components/avatar/avatar'

import './messages.scss'

import { IoSend } from 'react-icons/io5'
import { IoSearch } from 'react-icons/io5'

import { IoCheckmarkDoneSharp } from 'react-icons/io5'
import { IoCheckmarkSharp } from 'react-icons/io5'

import { RiNewspaperFill } from 'react-icons/ri'

export default function MessagesRoute() {
    const [ account, setAccount ] = React.useState({
        pID: 1,
        pName: 'LonelyNezuko',
        pEmail: '@mail.ru',

        pRegDate: '2023-05-07 10:55:32',

        pSex: 0,
        pAge: 23,

        pLevel: 1,
        pExp: 0,
        
        pSkin: 18,

        pCash: 200,
        
        pWarn: 0,
        pWarnTime: 0,

        pLastEnter: new Date() - 1000000000000000,

        pMute: 3600,
        pJail: 0,

        pFraction: -1,
        pRank: 0,

        pSetSpawn: 0,
        
        pDonate: 0,

        pBank: 0,
        pBankCash: 0,

        pOnline: -1,
        pJob: 0,

        pDeposit: 0,
        pAcs: '0, 19350, 0, 0, 3026, 0',

        pWanted: 2,
        pWantedData: '-,-',

        pWedding: 2,
        pWeddingName: 'Nezuko_Kamado',

        pSkills: '1000, 1000, 232, 0, 513, 0, 758',

        pGoogleAuth: 0,

        pUpExp: 0,
        pPrison: 105923,

        invModel: '20, 21, 22, 23, 24, 26',
        invCustom: '',
        invQuantity: '',
        invSimCost: ''
    })
    const [ dialogs, setDialogs ] = React.useState([
        {
            id: 1,
            type: 'personal',
            accounts: [
                { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                { pID: 2, pName: 'Nezuko_Kamado', pSkin: 234, pLastEnter: new Date() - 1000000000000000, pOnline: -1 }
            ],
            lastMessage: {
                id: 2,
                owner: { pID: 2, pName: 'Nezuko_Kamado', pSkin: 234, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                date: new Date(),
                readers: [2],
                text: 'Нет, иди нахуй'
            },
            messages: [
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597885000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597886000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597887000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597888000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597889000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597890000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597885000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672597885000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 1,
                    owner: { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: 1672598985000,
                    readers: [1,2],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                },
                {
                    id: 2,
                    owner: { pID: 2, pName: 'Nezuko_Kamado', pSkin: 234, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: new Date(),
                    readers: [2],
                    text: 'Нет, иди нахуй'
                },
                {
                    id: 2,
                    owner: { pID: 2, pName: 'Nezuko_Kamado', pSkin: 234, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                    date: new Date(),
                    readers: [2],
                    text: 'Извини, я погоречился'
                }
            ],
            unreadCount: 1
        },
        {
            id: 2,
            type: 'personal',
            accounts: [
                { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                { pID: 3, pName: 'ENKI ONLINE', pSkin: 232, pLastEnter: new Date() - 1000000000000000, pOnline: -1, avatar: { image: '/assets/enki_avatar.png' } }
            ],
            lastMessage: {
                date: 1672597885000,
                text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!',
                type: 'message',
                owner: { pID: 3, pName: 'ENKI ONLINE', pSkin: 232, pLastEnter: new Date() - 1000000000000000, pOnline: -1, avatar: { image: '/assets/enki_avatar.png' } }
            },
            unreadCount: 1,
            ban: '',
            messages: [
                {
                    id: 1,
                    owner: { pID: 3, pName: 'ENKI ONLINE', pSkin: 232, pLastEnter: new Date() - 1000000000000000, pOnline: -1, avatar: { image: '/assets/enki_avatar.png' } },
                    date: 1672597885000,
                    readers: [1],
                    text: 'Привет, ты подписан на нас, друг? Если нет, то срочно подписывайся. Здесь ты узнаешь все, что проиходит на данной площадке!'
                }
            ]
        },
        {
            id: 3,
            type: 'personal',
            accounts: [
                { pID: 1, pName: 'LonelyNezuko', pSkin: 23, pLastEnter: new Date() - 1000000000000000, pOnline: -1 },
                { pID: 2, pName: 'Alexey_Guborov', pSkin: 234, pLastEnter: new Date() - 1000000000000000, pOnline: -1, avatar: { image: 'https://forum.enki-rp.ru/data/avatars/o/0/2.jpg?1662743900' } }
            ],
            messages: []
        },
    ])

    const [ dialogSelected, setDialogSelected ] = React.useState(0)
    React.useEffect(() => {
        $('#messagesRoute .messages .wrap').scrollTo($('#messagesRoute .messages .wrap .message:last-child'))
    }, [dialogSelected, dialogs])


    function onMessageSend(text, dialog) {
        if(!text.length)return

        function format() {
            let newText = text

            // console.log(newText[newText.length])

            return newText
        }
        
        const dialogid = dialogs.findIndex(item => item.id === dialog.id)
        const tempDialogs = dialogs.slice()
        const newMessage = {
            id: 612313,
            owner: account,
            date: new Date(),
            readers: [account.pID],
            text: format(),
            type: 'message'
        }

        if(!tempDialogs[dialogid].messages) tempDialogs[dialogid].messages = []

        tempDialogs[dialogid].messages.push(newMessage)
        tempDialogs[dialogid].lastMessage = newMessage
        tempDialogs[dialogid].unreadCount = 0

        setDialogs(tempDialogs)
    }
    function onMessageTyping(dialog) {}

    return (
        <div id="messagesRoute">
            <div className="wrapper">
                <div className="dialogs">
                    <h1 className="title">Сообщения</h1>
                    <div className="form" id="formMessagesSearch">
                        <div className="forminput">
                            <IoSearch />
                            <input type="text" placeholder="Что ищем?" />
                        </div>
                    </div>
                    <div className="list">
                        {dialogs.map((item, i) => {
                            return ( <Dialog onClick={() => dialogSelected === i ? setDialogSelected(-1) : setDialogSelected(i)} key={i} dialog={item} dialogSelected={dialogSelected} i={i} account={account} /> )
                        })}
                    </div>
                </div>
                <div className="body">
                    {dialogSelected !== -1 ? (<Body dialog={dialogs[dialogSelected]} account={account} onMessageSend={onMessageSend} onMessageTyping={onMessageTyping} />) : ''}
                </div>
            </div>
        </div>
    )
}

function Dialog({ dialog, dialogSelected, i, account, onClick }) {
    const CONFIG = require('../../config.json')
    function returnPreview() {
        let text = ''
        let preview = {
            avatar: { image: '' },
            name: '',
            id: 1
        }

        if(dialog.lastMessage && dialog.lastMessage.owner.pID === account.pID) {
            let tempText = dialog.lastMessage.text
            
            tempText = ('Вы: ' + dialog.lastMessage.text).substring(0, CONFIG.maxDialogsSubStringLength).replace('Вы: ', '')
            if(('Вы:' + dialog.lastMessage.text).length > CONFIG.maxDialogsSubStringLength) tempText += '...'
    
            text = (
                <>
                    <h1>Вы: </h1>
                    <span>{tempText}</span>
                </>
            )
        }
        
        if(dialog.type === 'personal') {
            if(!preview.name.length) {
                const user = dialog.accounts.find(elem => elem.pID !== account.pID)
                if(user) preview = {
                    avatar: user.avatar || { image: `/assets/skins/${user.pSkin}.png`, size: 200, position: {x: 0, y: 30} },
                    name: user.pName,
                    link: '/account/' + user.pID,
                    online: user.pOnline
                }
            }

            if(!text || (dialog.isTyping && dialog.isTyping.pID !== account.pID)) {
                if(dialog.isTyping) text = (<span className="color">печатает...</span>)
                else if(dialog.lastMessage) {
                    let tempText = dialog.lastMessage.text
                    
                    tempText = dialog.lastMessage.text.substring(0, CONFIG.maxDialogsSubStringLength)
                    if(dialog.lastMessage.text.length > CONFIG.maxDialogsSubStringLength) tempText += '...'
    
                    text = (<span>{tempText}</span>)
                }
            }
        }

        return { preview, text }
    }
    
    return (
        <div onClick={onClick} className={`elem ${dialogSelected === i && 'selected'}`}>
            <Avatar status={returnPreview().preview.online === -1 ? 'offline' : 'online'} image={returnPreview().preview.avatar.image} size={returnPreview().preview.avatar.size} position={returnPreview().preview.avatar.position} />
            <div className="desc">
                <div className="username">
                    <h1>{returnPreview().preview.name}</h1>
                    {dialog.lastMessage ? (<h1 className="date">
                        {parseInt(Moment(dialog.lastMessage.date).format('YYYY')) === parseInt(Moment(new Date()).format('YYYY'))
                            ? Moment(dialog.lastMessage.date).calendar({
                                sameDay: 'HH:mm',
                                sameElse: 'Do MMM'
                            }) : Moment(dialog.lastMessage.date).format('DD.MM.YYYY')}
                    </h1>) : ''}
                </div>
                <h1 className="text">
                    <span>{returnPreview().text}</span>
                    {!dialog.unreadCount ? '' : (<div data-new={dialog.unreadCount}></div>)}
                    {dialog.lastMessage && dialog.lastMessage.owner.pID === account.pID && dialog.lastMessage.readers.length === 1 ? (<div className="readyoumessage"></div>) : ''}
                </h1>
            </div>
        </div>
    )
}

function Body({ dialog, account, onMessageTyping, onMessageSend }) {
    let preview = {
        avatar: { image: '' },
        name: '',
        id: 1
    }
    let typings = ''

    if(dialog.type === 'personal') {
        if(!preview.name.length) {
            const user = dialog.accounts.find(elem => elem.pID !== account.pID)
            if(user) preview = {
                avatar: user.avatar || { image: `/assets/skins/${user.pSkin}.png`, size: 200, position: {x: 0, y: 30} },
                name: user.pName,
                link: '/account/' + user.pID,
                online: user.pOnline,
                user
            }
        }
    }
    if(dialog.isTyping) {
        if(dialog.isTyping.length === 1) typings = dialog.isTyping[0].pName
        else if(dialog.isTyping.length === 2) typings = dialog.isTyping[0].pName + ' и ' + dialog.isTyping[1].pName
        else {
            for(var i = 0; i < dialog.isTyping.length && i < 6; i ++) {
                typings += dialog.isTyping[i].pName
                if(i < dialog.isTyping.length - 1 && i < 5) typings += ', '
            }

            if(dialog.isTyping.length > 6) typings += ` и еще ${dialog.isTyping.length - 6} чел.`
        }
    }

    return (
        <>
            <div className="title">&nbsp;</div>
            <div className="header">
                <h1>{preview.name}</h1>
                <span>({preview.online === -1 ? 'offline' : 'online'})</span>
            </div>
            <div className="messages">
                <div className="wrap">
                    <Message messages={dialog.messages} account={account} preview={preview} dialog={dialog} />
                </div>
                <div className="form">
                    {dialog.isTyping ? (
                        <div className="typing">
                            {typings}
                            {dialog.isTyping.length === 1 ? ' печатает...' : ' печатают...'}
                        </div>
                    ) : ''}
                    {dialog.ban === undefined ? (
                        <>
                            <div className="forminput formtextareadiv">
                                <div onKeyDown={event => {
                                    if(event.key === 'Enter' && !event.shiftKey)
                                    {
                                        event.preventDefault()
                                        if(event.target.textContent.length) {
                                            onMessageSend($(event.target).html(), dialog)

                                            $(event.target).html('')
                                            $(event.target).removeClass('hideplaceholder')
                                        }
                                    }
                                }} onInput={event => {
                                    if(event.target.textContent.length) $(event.target).addClass('hideplaceholder')
                                    else $(event.target).removeClass('hideplaceholder')

                                    onMessageTyping(dialog)
                                }} id="messagesRouteInput" className="textarea" contentEditable={true} aria-multiline="true" data-placeholder="Напишите сообщение..."></div>
                            </div>
                        </>
                    ) : (
                        <div className="ban">
                            <h1>Вы не можете отправлять сообщения данному пользователю</h1>
                        </div>
                    )}
                </div>
                {/* {dialog.ban === undefined ? (
                    <div className="action">
                        <IoSend onClick={() => onMessageSend($('#messagesRoute #messagesRouteInput').val(), dialog)} className="right" />
                    </div>
                ) : ''} */}
            </div>
        </>
    )
}
function Message({ messages, account, preview, dialog }) {
    if(!messages) {
        return (
            <div className="_center">
                <LoaderMini />
            </div>
        )
    }
    if(!messages.length) {
        return (
            <div className="newmessage">
                <div className="newmessage-wrap">
                    <RiNewspaperFill />
                    <h1>Скорее начните общаться</h1>
                    <h2>
                        <span>У Вас еще нет сообщений с</span>
                        <Link to={`/account/${preview.user.pID}`} className="link color">{preview.name}</Link>
                    </h2>
                </div>
            </div>
        )
    }

    return messages.map((item, i) => {
        let user = dialog.accounts.find(elem => item.owner.pID === elem.pID)

        // if(messages[i + 1]) {
        //     let nextUser = dialog.accounts.find(elem => messages[i + 1].owner.pID === elem.pID)

        //     if(user.pID === nextUser.pID
        //         && new Date(item.date + 120000) >= new Date(messages[i + 1].date)) {
        //             return (<></>)
        //         }
        // }

        let avatar = { image: `/assets/skins/${user.pSkin}.png`, size: 200, position: {x: 0, y: 30} }
        if(user.avatar) avatar = user.avatar

        let blockTime
        if(!i || (i > 0 && Moment(item.date).format('YYYY MM DD') !== Moment(messages[i - 1].date).format('YYYY MM DD'))) {
            if(Moment(item.date).format('YYYY') !== Moment(new Date()).format('YYYY')) blockTime = Moment(item.date).format('DD.MM.YYYY')
            else blockTime = Moment(item.date).format('DD MMMM')
        }

        let hideAvatar = false
        if(messages[i + 1]
            && user.pID === dialog.accounts.find(elem => messages[i + 1].owner.pID === elem.pID).pID) hideAvatar = true

        return (
            <>
                {blockTime ? (<div className="blockTime">
                    <span>{blockTime}</span>
                </div>) : ''}
                <div key={i} className={`message ${item.owner.pID === account.pID ? 'reverse' : ''}`}>
                    {!hideAvatar ? (
                        <div className="image">
                            <div className="center">
                                <Avatar status={user.pOnline === -1 ? 'offline' : 'online'} image={avatar.image} size={avatar.size} position={avatar.position} />
                            </div>
                        </div>
                    ) : (
                        <div className="imageHidden"></div>
                    )}
                    <div className="contentList">
                        <div className="content">
                            <h1 className="text" dangerouslySetInnerHTML={{ __html: item.text }}></h1>
                            {item.owner.pID === account.pID ? (
                                <div className="read">
                                    {item.readers.length === 1 ? (<IoCheckmarkSharp />) : (<IoCheckmarkDoneSharp />)}
                                </div>
                            ) : ''}
                            <h1 className="date">
                                {Moment(item.date).format('HH:mm')}
                            </h1>
                        </div>
                    </div>
                </div>
            </>
        )
    })
}