import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import $ from 'jquery'

import './nav.scss'

import { RiAccountCircleFill } from 'react-icons/ri'
import { RiSettings2Fill } from 'react-icons/ri'
import { AiFillFile } from 'react-icons/ai'
import { AiFillFileAdd } from 'react-icons/ai'
import { RiAdminFill } from 'react-icons/ri'
import { IoIosJournal } from 'react-icons/io'
import { FaWrench } from 'react-icons/fa'
import { HiWrenchScrewdriver } from 'react-icons/hi2'

import { FiLogOut } from 'react-icons/fi'

import { RiArrowDownSLine } from 'react-icons/ri'

export default function Nav() {
    const [ hidden, setHidden ] = React.useState({
        report: false,
        fraction: false,
        admin: false
    })
    function onHide(type) {
        setHidden({...hidden, [type]: !hidden[type]})
    }

    React.useEffect(() => {
        localStorage.setItem('navHiddenSubMenu', JSON.stringify(hidden))
    }, [hidden])
    React.useMemo(() => {
        let _navHiddenSubMenu
        try {
            _navHiddenSubMenu = JSON.parse(localStorage.getItem('navHiddenSubMenu'))
        }
        catch(e) {}

        if(_navHiddenSubMenu) setHidden(_navHiddenSubMenu)
    }, [])

    const location = useLocation()
    return (
        <div id="nav" className="hidden">
            <header>
                <Link to={location.pathname !== '/signin' ? '/' : '/signin'}>
                    <img src="/assets/logo.png" alt="Enki Online: Логотип" />
                </Link>
                {/* <div id="navToggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </div> */}  
            </header>
            {location.pathname === '/signin' ? (
                <div id="navPage">
                    <ul>
                        <li className="selected">
                            <Link to="/signin">
                                <RiAccountCircleFill />
                                <h1>Авторизация</h1>
                            </Link>
                        </li>
                    </ul>
                </div>
            ) : (
                <>
                    <div id="navPage">
                        <ul>
                            <li className={location.pathname === '/' && 'selected'}>
                                <Link to="/">
                                    <RiAccountCircleFill />
                                    <h1>Мой аккаунт</h1>
                                </Link>
                            </li>
                            <li className={location.pathname.indexOf('/settings') !== -1 && 'selected'}>
                                <Link to="/settings">
                                    <RiSettings2Fill />
                                    <h1>Настройки аккаунта</h1>
                                </Link>
                            </li>
                        </ul>
                        <ul className={`report ${hidden.report && 'hidden'}`}>
                            <h1 className="title">
                                Жалобы
                                <button onClick={() => onHide('report')}>
                                    <RiArrowDownSLine />
                                </button>
                            </h1>
                            <div className="wrap" style={{display: !hidden.report ? 'block' : 'none'}}>
                                <li className={location.pathname.indexOf('/report') !== -1 && location.hash !== '#create' && 'selected'}>
                                    <Link to="/report">
                                        <AiFillFile />
                                        <h1>Мои жалобы</h1>
                                    </Link>
                                </li>
                                <li className={location.pathname === '/report' && location.hash === '#create' && 'selected'}>
                                    <Link to="/report#create">
                                        <AiFillFileAdd />
                                        <h1>Создать жалобу</h1>
                                    </Link>
                                </li>
                            </div>
                        </ul>
                        <ul className={`fraction ${hidden.fraction && 'hidden'}`}>
                            <h1 className="title">
                                Организация
                                <button onClick={() => onHide('fraction')}>
                                    <RiArrowDownSLine />
                                </button>
                            </h1>
                            <div className="wrap" style={{display: !hidden.fraction ? 'block' : 'none'}}>
                                <li className={location.pathname.indexOf('/fraction') !== -1 && location.pathname !== '/fraction/management' && 'selected'}>
                                    <Link to="/fraction">
                                        <FaWrench />
                                        <h1>Моя фракция</h1>
                                    </Link>
                                </li>
                                <li className={location.pathname.indexOf('/fraction/management') !== -1 && 'selected'}>
                                    <Link to="/fraction/management">
                                        <HiWrenchScrewdriver />
                                        <h1>Управление фракцией</h1>
                                    </Link>
                                </li>
                            </div>
                        </ul>
                        <ul className={`admin ${hidden.admin && 'hidden'}`}>
                            <h1 className="title">
                                Администрация
                                <button onClick={() => onHide('admin')}>
                                    <RiArrowDownSLine />
                                </button>
                            </h1>
                            <div className="wrap" style={{display: !hidden.admin ? 'block' : 'none'}}>
                                <li className={location.pathname.indexOf('/admin') !== -1 && location.pathname !== '/admin/logs' && 'selected'}>
                                    <Link to="/admin">
                                        <RiAdminFill />
                                        <h1>Главная</h1>
                                    </Link>
                                </li>
                                <li className={location.pathname.indexOf('/admin/logs') !== -1 && 'selected'}>
                                    <Link to="/admin/logs">
                                        <IoIosJournal />
                                        <h1>Логи</h1>
                                    </Link>
                                </li>
                            </div>
                        </ul>
                    </div>
                    <div id="navExit">
                        <button>
                            <FiLogOut />
                            <h1>Выйти</h1>
                        </button>
                    </div>
                </>
            )}
            
        </div>
    )
}