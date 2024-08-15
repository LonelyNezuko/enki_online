import React from 'react'
import $ from 'jquery'

import _cef from '../../modules/cef'

import GoogleAuthCode from '../../modules/googleAuthCode'

import './googleauth.scss'

import { IoClose } from 'react-icons/io5'

export default function GoogleAuth() {
    const [ toggle, setToggle ] = React.useState(false)
    const [ type, setType ] = React.useState(0)

    const [ secret, setSecret ] = React.useState('')

    const [ accountName, setAccountName ] = React.useState('')
    const [ serverID, setServerID ] = React.useState(0)

    React.useMemo(() => {
        _cef.on('ui::googleAuth:toggle', toggle => setToggle(toggle))
        _cef.on('ui::googleAuth:type', type => setType(type))
        
        _cef.on('ui::googleAuth:secret', secret => setSecret(secret))

        _cef.on('ui::googleAuth:accountName', accountName => setAccountName(accountName))
        _cef.on('ui::googleAuth:serverID', serverID => setServerID(serverID))

        _cef.on('ui::googleAuth:add:clear', () => {
            $('.googleauth-code#googleAuthAdd input').val('')
            $('.googleauth-code#googleAuthAdd input:first-child').focus()
        })
        _cef.on('ui::googleAuth:delete:clear', () => {
            $('.googleauth-code#googleAuthDelete input').val('')
            $('.googleauth-code#googleAuthDelete input:first-child').focus()
        })
    }, [])

    return (
        <div className="googleAuth" style={{display: !toggle ? 'none' : 'block'}}>
            <h1>
                Google Authenticator
                <IoClose onClick={() => _cef.event('client::googleAuth:close')} />
            </h1>
            <section style={{display: !type ? 'block' : 'none'}}>
                <h2>Подключите к Вашему аккаунту двухфакторную аутентификацию “Google Authenticator”.<br />Это значительно увеличит уровень защиты</h2>
                <div className="account-googleauth-enable">
                    <div className="account-googleauth-enable-qr">
                        <section>
                            <div>Подождите, <br />идет загрузка...</div>
                            <img src={`https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=otpauth://totp/${accountName}%3Fsecret%3D${secret}%26issuer%3DENKI%20ONLINE%20${serverID}`} />
                        </section>
                        <section>
                            <h5 className="copied">{secret}</h5>
                        </section>
                    </div>
                    <div className="account-googleauth-enable-info">
                        <div>
                            <h2>1. Скачайте Google Authenticator Android/IOS</h2>
                            <span>Google Authenticator можно скачать с App store или Google Play наберите в поиске “Google Authenticator” и перейдите к скачиванию</span>
                        </div>
                        <div>
                            <h2>2. Отсканируйте QR-CODE или введите кодовую фразу</h2>
                            <span>Откройте Google Authenticator, отсканируйте QR-CODE, или введите кодовую фразу вручную, указанную ниже, чтобы активировать ключ верификации. Кодовая фраза используеться для восстановления доступа к Google Authenticator в случаи потери или покупки нового телефона. Перед тем как установить кодовую фразу, пожалуйста, убедитесь, что Вы записали или сохранили её в надежном месте!</span>
                        </div>
                    </div>
                </div>
                <div className="account-googleauth-code" style={{marginTop: "16px"}}>
                    <h1>3. Ведите 6-ти значный ключ из Google Authenticator</h1>
                    <section>
                        <GoogleAuthCode id={'googleAuthAdd'} callback={code => {
                            _cef.event('client::googleAuth:add', code)
                        }} />
                        <button onClick={() => _cef.event('client::googleAuth:close')}>Выйти</button>
                    </section>
                </div>
            </section>
            <section style={{display: type ? 'block' : 'none'}}>
                <h2>На Вашем аккаунте подключен “Google Authenticator”. <br />Для его отключения введите одноразовый ключ с приложения:</h2>
                <div className="account-googleauth-code" style={{marginTop: "16px"}}>
                    <section>
                        <GoogleAuthCode id={'googleAuthDelete'} callback={code => {
                            _cef.event('client::googleAuth:delete', code)
                        }} />
                        <button onClick={() => _cef.event('client::googleAuth:close')}>Выйти</button>
                    </section>
                </div>
            </section>
        </div>
    )
}