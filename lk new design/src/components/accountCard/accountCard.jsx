import React from 'react'

import Moment from 'moment'
import 'moment/locale/ru'

import Avatar from '../avatar/avatar'
import './accountCard.scss'

export default function AccountCard({ account = {} }) {
    return (
        <div className="accountCard">
            <div className="image">
                <Avatar status={account.pOnline === -1 ? 'offline' : 'online'} type="medium" image={`/assets/skins/${account.pSkin}.png`} size="200" position={{x: 0, y: 30}} />
            </div>
            <div className="info">
                <header>
                    <span>Имя аккаунта (UID)</span>
                    <h1>{account.pName} ({account.pID})</h1>
                </header>
                <div className="desc">
                    <span>
                        Уровень:
                        <h1>{account.pLevel} ({account.pExp} / {(account.pLevel + 1) * 4})</h1>
                    </span>
                    <span>
                        Регистрация:
                        <h1>{Moment(new Date(account.pRegDate)).format('DD.MM.YYYY')}</h1>
                    </span>
                    <span>
                        Фракция:
                        <h1>{account.pFraction === -1 ? 'Нет' : account.pFractionData.name}</h1>
                    </span>
                    <span>
                        Должность:
                        <h1>{account.pFraction === -1 ? 'Нет' : account.pFractionData.rankName + `(${account.pRank})`}</h1>
                    </span>
                    <span>
                        Последний вход:
                        <h1>{Moment(new Date(account.pLastEnter || 0)).fromNow()}</h1>
                    </span>
                </div>

                <div className="hover">
                    <button className="btn color">Подробнее</button>
                </div>
            </div>
        </div>
    )
}