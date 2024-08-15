import React from 'react'
import $ from 'jquery'

import Avatar from '../../../_avatar/avatar'
import Modal from '../../modules/modal/modal'

import _cef from '../../../../modules/cef'
import func from '../../../../modules/func'

import './contacts.scss'

import { FaPen } from 'react-icons/fa'
import { LuSearch } from 'react-icons/lu'

import { IoCall } from 'react-icons/io5'
import { RiMessage3Fill } from 'react-icons/ri'

import { FaUser } from 'react-icons/fa'
import { IoPhonePortraitOutline } from 'react-icons/io5'
import { RiImage2Line } from 'react-icons/ri'

export default function Contacts({ sToggle, openApp, appData }) {
    const [ toggle, setToggle ] = React.useState(false)
    React.useEffect(() => {
        $('.phone .app-contacts').removeClass('opened')
        if(sToggle) {
            setToggle(true)
            setTimeout(() => $('.phone .app-contacts').addClass('opened'), 100)
        }
        else setToggle(false)
    }, [sToggle, toggle])

    const [ contacts, setContacts ] = React.useState([])

    function onSearch(text) {
        if(!text.length) $('.phone .apppage.app-contacts .list .elem').show()
        else {
            $('.phone .apppage.app-contacts .list .elem').each((i, elem) => {
                console.log($(elem).find('.name').text().indexOf(text))
                if($(elem).find('.name').text().indexOf(text) === -1
                    && $(elem).find('.number').attr('data-number').indexOf(text) === -1) $(elem).hide()
                else $(elem).show()
            })
        }
    }

    React.useMemo(() => {
        let tempContacts = []
        _cef.on('ui::phone:contacts:list:clear', () => {
            tempContacts = []
        })
        _cef.on('ui::phone:contacts:list:insert', data => {
            // 'id;avatar;name;phone'

            let array = data.split(';')
            tempContacts.push({ id: array[0], avatar: array[1], name: array[2], phone: array[3] })
        })
        _cef.on('ui::phone:contacts:list:submit', () => {
            setContacts(tempContacts)
        })

        _cef.on('ui::phone:contacts:hideAdd', () => {
            setAddContact({...addContact, toggle: false})
        })
        _cef.on('ui::phone:contacts:hideInfo', () => {
            setContactInfo({...contactInfo, toggle: false})
        })
    }, [])

    const [ addContact, setAddContact ] = React.useState({
        toggle: false,

        image: '',
        form: {
            name: '',
            number: ''
        }
    })
    function onAddContactSubmit() {
        if(!addContact.form.name || !addContact.form.number || isNaN(addContact.form.number))return

        addContact.form.name = addContact.form.name.replaceAll(';', '')
        _cef.event('client::phone:contacts:add', `${addContact.form.name};${!addContact.image.length ? '0' : addContact.image};${addContact.form.number}`)
    }

    const [ contactInfo, setContactInfo ] = React.useState({
        toggle: false,

        image: '',
        form: {
            name: '',
            number: ''
        },
        id: -1
    })
    const [ contactInfoDelete, setContactInfoDelete ] = React.useState(false)
    function onSaveContactInfo() {
        if(!contactInfo.form.name || !contactInfo.form.number || isNaN(contactInfo.form.number))return

        contactInfo.form.name = contactInfo.form.name.replaceAll(';', '')
        _cef.event('client::phone:contacts:change', `${contactInfo.id};${!contactInfo.image.length ? '0' : contactInfo.image};${contactInfo.form.name};${contactInfo.form.number}`)
    }
    function openContact(data) {
        if(!toSMS) {
            setContactInfo({
                toggle: true,

                image: data.avatar === 'assets/phone/defaultAvatar.png' ? '' : data.avatar,
                id: data.id,

                form: {
                    name: data.name,
                    number: data.phone
                }
            })
        }
        else openApp('sms', { open: data })
    }

    const [ toSMS, setToSMS ] = React.useState(false)

    React.useEffect(() => {
        if(appData.addContact) {
            setAddContact({
                toggle: true,

                image: '',
                form: {
                    name: '',
                    number: appData.addContact
                }
            })
        }

        if(appData.toSMS) setToSMS(true)
        else setToSMS(false)

        if(!appData.addContact) {
            setAddContact({
                toggle: false,

                image: '',
                form: {
                    name: '',
                    number: ''
                }
            })
            setContactInfo({
                toggle: false,

                image: '',
                form: {
                    name: '',
                    number: ''
                },
                id: -1
            })
        }
    }, [appData])

    return (
        <div className="apppage app-contacts" style={{display: !toggle ? 'none' : 'block'}} data-contacts={JSON.stringify(contacts)}>
            <Modal toggle={contactInfoDelete} text='Вы действительно желаете удалить данный контакт?' btns={['Нет', 'Да']} onClick={btn => {
                if(btn) _cef.event('client::phone:contacts:delete', `${contactInfo.id}`)
                setContactInfoDelete(false)
            }} />

            <header>
                <h1>Контакты</h1>
                {!toSMS ? (
                    <button onClick={() => setAddContact({...addContact, toggle: true})}>
                        <FaPen />
                    </button>
                ) : ''}
            </header>
            <div className="search">
                <LuSearch />
                <input onChange={event => onSearch(event.target.value)} type="text" placeholder="Поиск..." />
            </div>
            <div className="list">
                {contacts.map((item, i) => {
                    return (
                        <div className="elem" key={i} onClick={() => openContact(item)}>
                            <Avatar image={item.avatar} />
                            <div className="desc">
                                <div className="name">{item.name}</div>
                                <div className="number" data-number={item.phone}>{func.formatPhoneNumber(item.phone)}</div>
                            </div>
                            {!toSMS ? (
                                <div className="action">
                                    <button onClick={() => openApp('call', { number: item.phone })}>
                                        <IoCall />
                                    </button>
                                    <button onClick={() => {
                                        openApp('sms', { open: item })
                                    }}>
                                        <RiMessage3Fill />
                                    </button>
                                </div>
                            ) : ''}
                        </div>
                    )
                })}
            </div>
            <div className="bottomshadow"></div>

            <div className={`addcontact ${addContact.toggle ? 'show' : ''}`}>
                <div className="title">Новый контакт</div>
                <div className="image">
                    <Avatar image={!addContact.image.length ? 'assets/phone/defaultAvatar.png' : addContact.image} type="medium" />
                </div>
                <div className="form">
                    <div className="input">
                        <RiImage2Line />
                        <input maxlength="150" type="text" placeholder="Ссылка на изображение" value={addContact.image} onChange={event => setAddContact({...addContact, image: event.target.value})} />
                    </div>
                    <div className="input">
                        <FaUser />
                        <input maxlength="24" type="text" placeholder="Введите имя контакта" value={addContact.form.name} onChange={event => setAddContact({...addContact, form: { ...addContact.form, name: event.target.value }})} />
                    </div>
                    <div className="input">
                        <IoPhonePortraitOutline />
                        <input maxlength="10" type="text" placeholder="Номер телефона" value={addContact.form.number} onChange={event => setAddContact({...addContact, form: { ...addContact.form, number: event.target.value }})} />
                    </div>
                </div>
                <div className="action">
                    <button onClick={() => setAddContact({...addContact, toggle: false})}>Отменить</button>
                    <button onClick={() => onAddContactSubmit()}>Создать</button>
                </div>
            </div>

            <div className={`addcontact contactinfo ${contactInfo.toggle ? 'show' : ''}`}>
                <div className="title">Информация о контакте</div>
                <div className="image">
                    <Avatar image={!contactInfo.image.length ? 'assets/phone/defaultAvatar.png' : contactInfo.image} type="medium" />
                </div>
                <div className="form">
                    <div className="input">
                        <RiImage2Line />
                        <input maxlength="150" type="text" placeholder="Ссылка на изображение" value={contactInfo.image} onChange={event => setContactInfo({...contactInfo, image: event.target.value})} />
                    </div>
                    <div className="input">
                        <FaUser />
                        <input maxlength="24" type="text" placeholder="Введите имя контакта" value={contactInfo.form.name} onChange={event => setContactInfo({...contactInfo, form: { ...contactInfo.form, name: event.target.value }})} />
                    </div>
                    <div className="input">
                        <IoPhonePortraitOutline />
                        <input maxlength="10" type="text" placeholder="Номер телефона" value={contactInfo.form.number} onChange={event => setContactInfo({...contactInfo, form: { ...contactInfo.form, number: event.target.value }})} />
                    </div>
                    <button className="delete" onClick={() => setContactInfoDelete(true)}>Удалить контакт</button>
                </div>
                <div className="action">
                    <button onClick={() => setContactInfo({...contactInfo, toggle: false})}>Закрыть</button>
                    <button onClick={() => onSaveContactInfo()}>Сохранить</button>
                </div>
            </div>
        </div>
    )
}