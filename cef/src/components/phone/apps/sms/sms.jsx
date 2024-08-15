import React from 'react'
import $ from 'jquery'
import 'jquery.scrollto'

import Moment from 'moment'
import 'moment/locale/ru'

import Avatar from '../../../_avatar/avatar'
import Modal from '../../modules/modal/modal'

import _cef from '../../../../modules/cef'
import func from '../../../../modules/func'

import './sms.scss'

import { FiPlus } from 'react-icons/fi'
import { LuSearch } from 'react-icons/lu'

import { RiDeleteBinFill } from 'react-icons/ri'
import { GiPin } from 'react-icons/gi'

import { MdKeyboardArrowLeft } from 'react-icons/md'
import { TbDots } from 'react-icons/tb'

import { IoSend } from 'react-icons/io5'

import { IoMdText } from 'react-icons/io'

export default function SMS({ sToggle, openApp, appData }) {
    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        $('.phone .app-sms').removeClass('opened')
        if(sToggle) {
            setToggle(true)
            setTimeout(() => $('.phone .app-sms').addClass('opened'), 100)
        }
        else setToggle(false)
    }, [sToggle, toggle])

    const [ sms, setSMS ] = React.useState([
        { id: 1, avatar: 'https://i.pinimg.com/originals/b1/11/b7/b111b745166f6c58863bbb1d3855888b.jpg', phone: 55555, name: 'LonelyNezuko', lastMessage: 'Привет, как твои дела? Все хорошо? Надеюсь, что да, иначе я буду очень зол на тебя', lastMessageTime: new Date(), unreadCount: 1 }
    ])
    const [ allUnread, setAllUnread ] = React.useState(0)

    function onSearch(text) {
        if(!text.length) $('.phone .apppage.app-sms .list .elem').show()
        else {
            $('.phone .apppage.app-sms .list .elem').each((i, elem) => {
                console.log($(elem).find('.name').text().indexOf(text))
                if($(elem).find('.name').text().indexOf(text) === -1
                    && $(elem).find('.number').attr('data-message').indexOf(text) === -1) $(elem).hide()
                else $(elem).show()
            })
        }
    }
 
    const [ playerNumber, setPlayerNumber ] = React.useState(55555)
    const [ deleteMessages, setDeleteMessages ] = React.useState(false)
    
    const [ messages, setMessages ] = React.useState({
        toggle: false,

        id: -1,

        avatar: 'https://i.pinimg.com/originals/b1/11/b7/b111b745166f6c58863bbb1d3855888b.jpg',
        name: 'LonelyNezuko',
        phone: 55555,

        online: 1,
        messsages: [
            // { id: 1, text: 'text', date: 12312312, phone: 55555 }
        ]
    })

    function openSMS(id) {
        _cef.event('client::phone:sms:open', `${id}`)
    }
    function submitMessage(text) {
        if(!text.length)return

        text = text.replaceAll('~', ' ')
        text = text.substring(0, 255)

        _cef.event('client::phone:sms:message', `${messages.id}~${text}~${messages.phone}`)
        $('.phone #phoneSMSMessageInput').val('')
    }


    React.useMemo(() => {

        let tempSMS = []
        _cef.on('ui::phone:sms:list:clear', () => {
            tempSMS = []
        })
        _cef.on('ui::phone:sms:list:insert', sms => {
            // avatar~phone~name~lastMessage~lastMessageTime~unread~id

            let array = sms.split('~')
            tempSMS.push({ avatar: array[0], phone: parseInt(array[1]), name: array[2], lastMessage: array[3], lastMessageTime: new Date(array[4]), unreadCount: parseInt(array[5]), id: parseInt(array[6]) })
        })
        _cef.on('ui::phone:sms:list:submit', () => {
            setSMS(tempSMS)
            setMessages(old => {
                return {...old, toggle: false}
            })
        })

        let tempMesssages = []
        _cef.on('ui::phone:sms:messages:list:clear', () => {
            tempMesssages = []
        })
        _cef.on('ui::phone:sms:messages:list:insert', messsages => {
            // '1~Привет, как дела?~2135123123~232323'
            
            let array = messsages.split('~')
            tempMesssages.push({ id: parseInt(array[0]), text: array[1], date: new Date(array[2]), phone: parseInt(array[3]) })
        })
        _cef.on('ui::phone:sms:messages:list:add', messsages => {
            // '1~Привет, как дела?~2135123123~232323'
            
            let array = messsages.split('~')
            setMessages(old => {
                let temp = old.messsages
                temp.push({ id: parseInt(array[0]), text: array[1], date: new Date(array[2]), phone: parseInt(array[3]) })

                return { ...old, messsages: temp }
            })
        })
        _cef.on('ui::phone:sms:messages:list:submit', (id, avatar, name, online, phone) => {
            setMessages({
                toggle: true,

                id,

                avatar,
                name,
                phone,
        
                online,
                messsages: tempMesssages
            })
        })

        _cef.on('ui::phone:sms:playerNumber', number => {
            setPlayerNumber(number)
        })
        _cef.on('ui::phone:sms:unread', unread => {
            setAllUnread(unread)
        })
    }, [])
    React.useEffect(() => {
        $('.phone .apppage.app-sms .messages .content').scrollTo($('.phone .apppage.app-sms .messages .content .message:last-child'))
    }, [messages])

    return (
        <div className="apppage app-sms app-contacts" style={{display: !toggle ? 'none' : 'block'}}>
            <Modal toggle={deleteMessages} text='Вы действительно желаете удалить данную переписку?' btns={['Нет', 'Да']} onClick={btn => {
                if(btn) _cef.event('client::phone:sms:deleteMessages', `${messages.phone}`)
                setDeleteMessages(false)
            }} />

            <header>
                <h1>
                    Сообщения
                    {allUnread > 0 ? (<span className="unread" data-unread={allUnread}></span>) : ''}
                </h1>
                <button onClick={() => openApp('contacts', { toSMS: true })}>
                    <FiPlus />
                </button>
            </header>
            <div className="search">
                <LuSearch />
                <input maxlength="255" onChange={event => onSearch(event.target.value)} type="text" placeholder="Поиск..." />
            </div>
            <div className="list">
                {sms.filter(item => item.pin).map((item, i) => {
                    return ( <RenderSMSList sms={item} i={i} openSMS={openSMS} /> )
                })}

                {sms.filter(item => !item.pin).map((item, i) => {
                    return ( <RenderSMSList sms={item} i={i} openSMS={openSMS} /> )
                })}
            </div>
            <div className="bottomshadow"></div>

            <div className={`messages ${messages.toggle ? 'show' : ''}`}>
                <div className="title">
                    <div className="section">
                        <button onClick={() => _cef.event('client::phone:openApp', 'sms')}>
                            <MdKeyboardArrowLeft />
                        </button>
                        <Avatar image={messages.avatar} type="min" />
                        <h1>
                            {messages.name}
                            <span className={messages.online === -1 ? 'offline' : ''}>{messages.online === -1 ? 'Не в сети' : 'В сети'}</span>
                        </h1>
                    </div>
                    {/* {messages.id !== -1 ? (
                        <div className="section">
                            <button>
                                <TbDots />
                            </button>
                            <div className="action">
                                <button onClick={() => _cef.event('client::phone:sms:pin', `${messages.id}`)}>
                                    <GiPin />
                                    <span>Открепить переписку</span>
                                </button>
                                <button onClick={() => setDeleteMessages(true)}>
                                    <RiDeleteBinFill />
                                    <span>Удалить переписку</span>
                                </button>
                            </div>
                        </div>
                    ) : ''} */}
                </div>
                <div className="content">
                    {!messages.messsages.length ? (
                        <div className="nomessages">
                            <section>
                                <IoMdText />
                                <h1>Сообщений пока нет. Напишите первыми</h1>
                            </section>
                        </div>
                    ) : ''}
                    {messages.messsages.map((item, i) => {
                        return (
                            <div className={`message ${item.phone === playerNumber ? 'reverse' : ''}`} key={i}>
                                <div className="text">
                                    <h1>{item.text}</h1>
                                    <span className="time">{parseInt(Moment(item.date).format('YYYY')) === parseInt(Moment(new Date()).format('YYYY'))
                                        ? Moment(item.date).calendar({
                                            sameDay: 'HH:mm',
                                            sameElse: 'Do MMM'
                                        }) : Moment(item.date).format('DD.MM.YYYY')}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="input">
                    <input onKeyDown={event => {
                        if(event.key === 'Enter') submitMessage(event.target.value)
                    }} id="phoneSMSMessageInput" type="text" placeholder='Напишите сообщение...' />
                    <button onClick={() => submitMessage($('.phone #phoneSMSMessageInput').val())}>
                        <IoSend />
                    </button>
                </div>
                <div className="bottomshadow"></div>
            </div>
        </div>
    )
}

function RenderSMSList({ sms, i, openSMS }) {
    return (
        <div className="elem" key={i} onClick={() => openSMS(sms.id)}>
            <Avatar image={sms.avatar} unread={sms.unreadCount} />
            <div className="desc">
                <div className="name">
                    <h2>
                        {sms.name}
                    </h2>
                    <h1 className="time">{parseInt(Moment(sms.lastMessageTime).format('YYYY')) === parseInt(Moment(new Date()).format('YYYY'))
                        ? Moment(sms.lastMessageTime).calendar({
                            sameDay: 'HH:mm',
                            sameElse: 'Do MMM'
                        }) : Moment(sms.lastMessageTime).format('DD.MM.YYYY')}</h1>
                </div>
                <div className="number" data-message={sms.lastMessage}>{sms.lastMessage.length > 26 ? sms.lastMessage.substring(0, 26) + '...' : sms.lastMessage}</div>
            </div>
        </div>
    )
}