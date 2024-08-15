import React from 'react'
import $ from 'jquery'
import { Link, useLocation } from 'react-router-dom'

import Search from '../search/search'
import NotifyMenu from '../notifyMenu/notifyMenu'

import './header.scss'

import { IoSearch } from 'react-icons/io5'

import { RiMessage3Fill } from 'react-icons/ri'
import { TbBellRingingFilled } from 'react-icons/tb'
import { RiAccountCircleFill } from 'react-icons/ri'

import { IoMdMoon } from 'react-icons/io'

export default function Header() {
    const location = useLocation()

    const [ darkTheme, setDarkTheme ] = React.useState(false)
    React.useMemo(() => {
        setDarkTheme($('body').hasClass('darkTheme'))
    }, [])

    return (
        <div id="header">
            <Search />
            
            <div className="right">
                {location.pathname === '/signin' ? '' : (
                    <div className="form" id="formGlobalSearch">
                        <div className="forminput">
                            <IoSearch />
                            <input type="text" placeholder="Начните вводить запрос..." />
                        </div>
                    </div>
                )}
                <div className="theme">
                    <div className="btn icon nothover" data-alt="Включить темную тему">
                        <IoMdMoon />
                    </div>
                </div>
            </div>
            <div className="left">
                {location.pathname === '/signin' ? (
                    <button className="btn color icontext left">
                        <RiAccountCircleFill />
                        <span>Авторизация</span>
                    </button>
                ) : (
                    <>
                        <Link to="/messages" className="btn icon nothover" data-new="3">
                            <RiMessage3Fill />
                        </Link>
                        <Link id="headerNotifyOpen" to='#notify' className="btn icon nothover" data-new="12">
                            <TbBellRingingFilled />
                            {location.hash.indexOf('#notify') !== -1 ? (<NotifyMenu />) : ''}
                        </Link>
                        <Link to="/" className="btn color icontext left">
                            <RiAccountCircleFill />
                            <span>LonelyNezuko</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}