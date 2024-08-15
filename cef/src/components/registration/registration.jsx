import React from 'react'
import $ from 'jquery'

import _cef from '../../modules/cef'
import func from '../../modules/func'

import './registration.scss'

import { IoIosUnlock } from 'react-icons/io'
import { SiMaildotru } from 'react-icons/si'
import { RiUser2Fill } from 'react-icons/ri'

import { FaArrowRight } from 'react-icons/fa'
import { AiOutlineQuestionCircle } from 'react-icons/ai'

import { AiOutlineGoogle } from 'react-icons/ai'

export default function Registration() {
    const [ toggle, setToggle ] = React.useState(false)
    const [ form, setForm ] = React.useState({
        password: '',
        mail: '',
        age: '',
        gender: -1
    })

    const [ auth, setAuth ] = React.useState(false)
    const [ authUsername, setAuthUsername ] = React.useState('Nezuko_Kamado')
    const [ authGoogle, setAuthGoogle ] = React.useState(false)

    function isFormFilled(isAuth = false) {
        if(!func.validatePassword(form.password))return false
        if(!isAuth) {
            if(!func.validateEmail(form.mail))return false
            if(!form.age.length || isNaN(parseInt(form.age)))return false

            return form.password.length > 0 && form.mail.length > 0 && form.age.length > 0 && form.gender != -1
        }
        else {
            if(authGoogle && form.mail.length !== 6)return false
            return form.password.length > 0
        }
        return false
    }
    function onSubmit() {
        if(!isFormFilled(auth))return
        if(!auth && isNaN(parseInt(form.age)))return

        if(!auth) _cef.event('client::reg:go', `${form.password}:${form.mail}:${parseInt(form.age)}:${form.gender}`)
        else _cef.event('client::reg:go:auth', `${form.password}:${form.mail}`)
    }

    React.useMemo(() => {
        _cef.on('ui::reg:show', (auth, authUsername, authGoogle) => {
            setToggle(true)
            
            setAuth(auth || false)
            setAuthUsername(authUsername || '')
            setAuthGoogle(authGoogle || false)
        })
        _cef.on('ui::reg:hide', () => setToggle(false))
    }, [])

    return (
        <div className="registration" style={{display: !toggle ? 'none' : 'block'}}>
            <div className="registration_bg">
                <section></section>

                <img id="registrationBGImg1" src="assets/registration/bg_2.png" />
                <img id="registrationBGImg2"src="assets/registration/bg_1.png" />

                <h1>{!auth ? "Регистрация" : "Авторизация"}<br />ENKI ONLINE</h1>
                {!auth ? (<h1>Путь начинается<br />Начни историю</h1>) : (<h1>Путь продолжается<br />Закончи историю</h1>)}

                <div style={{display: !auth ? 'block' : 'none', opacity: '.2', top: '115px', left: '140px'}}>
                    <AiOutlineQuestionCircle />
                    <span>Твоя история начнется <br />с этого момента</span>
                </div>
                <div style={{display: !auth ? 'block' : 'none', opacity: '.3', top: '300px', left: '250px'}}>
                    <AiOutlineQuestionCircle />
                    <span>Советуем начать с <br />прохождения квестов</span>
                </div>
                <div style={{display: !auth ? 'block' : 'none', opacity: '.5', top: '555px', left: '50px'}}>
                    <AiOutlineQuestionCircle />
                    <span>Чтобы задать вопрос администрации <br />используйте клавишу P</span>
                </div>
                <div style={{display: !auth ? 'block' : 'none', bottom: '95px', left: '320px'}}>
                    <AiOutlineQuestionCircle />
                    <span>Важно! Не знание правил не освобождает <br />Вас от ответственности</span>
                </div>

                <div style={{display: !auth ? 'block' : 'none', opacity: '.2', top: '160px', right: '80px'}}>
                    <AiOutlineQuestionCircle />
                    <span>После регистрации советуем посмотреть Помощь. <br />Используйте клавишу M</span>
                </div>
                <div style={{display: !auth ? 'block' : 'none', opacity: '.3', top: '270px', right: '380px'}}>
                    <AiOutlineQuestionCircle />
                    <span>Вы можете использовать промокод. <br />Используйте клавишу M</span>
                </div>
                <div style={{display: !auth ? 'block' : 'none', opacity: '.5', top: '510px', right: '70px'}}>
                    <AiOutlineQuestionCircle />
                    <span>Чтобы начать видеть ник игрока <br />поздаровайтесь с ним через Взаимодействия. <br />Посмотрите на игрока и используйте H</span>
                </div>
                <div style={{display: !auth ? 'block' : 'none', bottom: '50px', right: '100px'}}>
                    <AiOutlineQuestionCircle />
                    <span>У нас есть инвентарь. <br />Откройте его через клавишу Y</span>
                </div>
            </div>
            <div className="registration-wrap">
                <header>
                    <img src="assets/logo_smile.png" />
                    <div>
                        <h1>Enki Online</h1>
                        {!auth ? (<span>Начни свою историю,<br />прямо сейчас!</span>) : <span>Рады снова тебя видеть, <br />{authUsername}</span>}
                    </div>
                </header>
                <div className="registration-inputs" style={{display: !auth ? 'block' : 'none'}}>
                    <div className="registration-input">
                        <input id="registrationRegPassword" onInput={e => {
                            setForm({...form, password: e.target.value})
                        }} value={form.password} type="password" placeholder="Придумайте пароль для аккаунта" maxlength="45" onKeyDown={event => {
                            if(event.key === 'Enter') $('.registration #registrationRegEmail').focus()
                        }} />
                        <IoIosUnlock />
                    </div>
                    <div className="registration-input">
                        <input id="registrationRegEmail" onInput={e => {
                            setForm({...form, mail: e.target.value})
                        }} value={form.mail} type="text" placeholder="Введите свою электронную почту" maxlength="144" onKeyDown={event => {
                            if(event.key === 'Enter') $('.registration #registrationRegAge').focus()
                        }} />
                        <SiMaildotru />
                    </div>
                    <div className="registration-input">
                        <input id="registrationRegAge" onInput={e => {
                            if(e.target.value.length >= 2) setForm({...form, age: e.target.value.substring(0, 2)})
                            else setForm({...form, age: e.target.value})
                        }} value={form.age} type="number" placeholder="Придумайте возраст персонажа" onKeyDown={event => {
                            if(event.key === 'Enter') onSubmit()
                        }} />
                        <RiUser2Fill />
                    </div>
                    <div className="registration-input registration-input-sex">
                        <h1>Выберите пол персонажа</h1>
                        <button className={form.gender === 0 ? 'selected' : ''} onClick={e => {
                            setForm({...form, gender: 0})
                        }}>Мужской</button>
                        <button className={form.gender === 1 ? 'selected' : ''} onClick={e => {
                            setForm({...form, gender: 1})
                        }}>Женский</button>
                    </div>
                    <button onClick={() => onSubmit()} className={`registration-button ${!isFormFilled() ? 'disabled' : ''}`}>
                        Начать играть
                        <FaArrowRight />
                    </button>
                    <h2 onClick={() => _cef.event('client::reg:exit')}>Выйти</h2>
                </div>
                <div className="registration-inputs" style={{display: auth ? 'block' : 'none'}}>
                    <div className="registration-input">
                        <input id="registrationAuthPassword" onInput={e => {
                            setForm({...form, password: e.target.value})
                        }} value={form.password} type="password" placeholder="Введите пароль от своего аккаунта" maxlength="45" onKeyDown={event => {
                            if(event.key === 'Enter') {
                                if(authGoogle) $('.registration #registrationAuthGoogle').focus()
                                else onSubmit()
                            }
                        }} />
                        <IoIosUnlock />
                    </div>
                    <div className="registration-input" style={{display: !authGoogle ? 'none' : 'flex'}}>
                        <input id="registrationAuthGoogle" onInput={e => {
                            setForm({...form, mail: e.target.value})
                        }} value={form.mail} type="text" placeholder="Введите код из Google Authenticator" maxlength="6" onKeyDown={event => {
                            if(event.key === 'Enter') onSubmit()
                        }} />
                        <AiOutlineGoogle />
                    </div>
                    <button onClick={() => onSubmit()} className={`registration-button ${!isFormFilled(true) ? 'disabled' : ''}`}>
                        Войти в аккаунт
                        <FaArrowRight />
                    </button>
                    <h2 onClick={() => _cef.event('client::reg:exit')}>Выйти</h2>
                </div>
            </div>
        </div>
    )
}