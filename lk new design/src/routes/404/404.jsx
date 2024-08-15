import React from 'react'
import { Link } from 'react-router-dom'

import './404.scss'

export default function Router404({ text }) {
    return (
        <div className="router404">
            <div className="wrap">
                <img src="/assets/404.png" alt="404 Not found" />
                <h1>Упс, мы сталкнулись с проблемами</h1>
                <h2>{text || 'Это что? Ошибка 404?'}</h2>
            </div>
        </div>
    )
}