import React from 'react'
import $ from 'jquery'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import Avatar from '../avatar/avatar'

import './notifyMenu.scss'

import { RiSettings5Fill } from 'react-icons/ri'

export default function NotifyMenu() {
    const location = useLocation()
    const navigate = useNavigate();

    React.useMemo(() => {
        $(document).on('click', event => {
            if($('#notifyMenu').length
                && !$('#notifyMenu').is(event.target) && !$('#notifyMenu').has(event.target).length
                && !$('#headerNotifyOpen').is(event.target) && !$('#headerNotifyOpen').has(event.target).length) {
                    navigate(location.pathname)
                }
        })
    }, [])
    
    return (
        <div id="notifyMenu">
            <header>
                <h1>Уведомления</h1>
                <Link to="/settings" className="btn icon transparent">
                    <RiSettings5Fill />
                </Link>
            </header>
            <div className="body">
                <div className="notf">
                    <Avatar type="min" status='online' image={`/assets/skins/144.png`} size="200" position={{x: 0, y: 30}} />
                    <div className="desc">
                        <h1>
                            <Link className="link" to="/account/1">LonelyNezuko</Link>
                            <div className="date">20:16</div>
                        </h1>
                        <div className="text">
                            Оставил на Вас <Link to="/report/1" className="link color">жалобу #21331</Link>. Просмотрите ее и выдайте опровержение
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}