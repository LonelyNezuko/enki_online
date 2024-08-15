import React from 'react'
import { Link } from 'react-router-dom'
import $ from 'jquery'

import Moment from 'moment'
import 'moment/locale/ru'

import './accountBan.scss'

import { TbShieldLockFilled } from 'react-icons/tb'

export default function AccountBanModal({ props }) {
    return (
        <div id="accountBanModal">
            <div className="accountBanModalWrapper">
                <header>
                    <div className="icon">
                        <TbShieldLockFilled />
                    </div>
                    <h1 className="title">Аккаунт заблокирован</h1>
                </header>
                <div className="body">
                    <div className="desc">
                        <section>
                            <span>Заблокировал:</span>
                            <h1>
                                <Link to={`/account/${props.banAdminID}`} className="link">{props.banAdminName}</Link>
                            </h1>
                        </section>
                        <section>
                            <span>Причина:</span>
                            <h1>{props.banReason}</h1>
                        </section>
                        <section>
                            <span>Дата блокировки:</span>
                            <h1>{Moment(new Date(props.banDate * 1000)).format('DD.MM.YYYY')}</h1>
                        </section>
                        <section>
                            <span>Будет разблокирован:</span>
                            <h1>{Moment(new Date(props.banTime * 1000)).format('DD.MM.YYYY')}</h1>
                        </section>
                    </div>
                    <div className="info">
                        Если Вы не согласны с решением администратора, Вы можете подать на него <Link className="link color" to="/report#create">жалобу</Link>.
                    </div>
                    <div className="buttons">
                        <Link to="/report#create" className="btn color">Жалоба</Link>
                        <Link to="" className="btn nothover">Закрыть</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}