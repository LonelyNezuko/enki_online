import React from 'react'
import $ from 'jquery'

import LoaderMini from '../../components/loaderMini/loaderMini'
import notify from '../../modules/notify'

import './signin.scss'

import { BiUser } from 'react-icons/bi'

import { AiFillEye } from 'react-icons/ai'
import { AiOutlineEye } from 'react-icons/ai'

export default function SigninRoute() {
    const [ passwordShow, setPasswordShow ] = React.useState(false)
    const [ form, setForm ] = React.useState({
        signinNickname: '',
        signinPassword: '',
        signinServer: '',
        signinSaveMe: false
    })

    const [ servers, setServers ] = React.useState([
        { value: 0, title: 'Enki Online | Test' },
        { value: 1, title: 'Enki Online | One' },
        { value: 2, title: 'Enki Online | Two' },
        { value: 3, title: 'Enki Online | Three' },
        { value: 4, title: 'Enki Online | Four' }
    ])

    function onSubmit() {
        if(!form.signinNickname.length
            || !form.signinPassword.length
            || !form.signinServer.length)return
        if(loading)return
        
        setLoading(true)
        setTimeout(() => {
            notify('Пока ты не можешь войти', 'error')
            setLoading(false)
        }, 3000)
    }

    const [ loading, setLoading ] = React.useState(false)
    return (
        <div id="signin">
            <div className="wrapper">
                <div className="icon">
                    <section>
                        <BiUser />
                    </section>
                </div>
                <h1 className="title">Авторизация</h1>
                <span className="desc">Введите следующие данные для прохождения авторизация</span>
                <div className="form">
                    <div className="formdefault forminput">
                        <input id="signinNickname" type="text" maxLength={34} placeholder=" " value={form.signinNickname} onChange={event => setForm({...form, signinNickname: event.target.value})} />
                        <label for="signinNickname">Nick_Name</label>
                    </div>
                    <div className="formdefault forminput">
                        {!passwordShow ? (<AiOutlineEye onClick={() => setPasswordShow(true)} className="right pointer" />) : (<AiFillEye onClick={() => setPasswordShow(false)} className="right pointer" />)}
                        <input id="signinPassword" type={!passwordShow ? 'password' : 'text'} maxLength={64} placeholder=" "  value={form.signinPassword} onChange={event => setForm({...form, signinPassword: event.target.value})} />
                        <label for="signinPassword">Пароль</label>
                        
                    </div>
                    <div className="formdefault formselect">
                        <div id="signinServer" className="select" data-title="Выберите сервер" data-value={form.signinServer}>
                            <ul>
                                {servers.map((item, i) => {
                                    return (
                                        <li onClick={event => setForm({...form, signinServer: event.currentTarget.getAttribute('data-value')})} data-value={item.value}>
                                            <h1>{item.value}</h1>
                                            <span>{item.title}</span>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    </div>
                    <div className="formdefault formcheckbox">
                        <input id="signinSaveMe" type="checkbox" value={form.signinSaveMe} onClick={event => setForm({...form, signinSaveMe: event.target.checked})} />
                        <label for="signinSaveMe">Запомнить меня</label>
                    </div>
                </div>
                <div className="buttons">
                    <div onClick={onSubmit} className={`btn loader ${loading && 'disable'} ${form.signinNickname.length && form.signinPassword.length && form.signinServer.length ? '' : 'disable'}`}>
                        {!loading ? 'Войти' : (<LoaderMini size="mini" />)}
                    </div>
                </div>
            </div>
        </div>
    )
}