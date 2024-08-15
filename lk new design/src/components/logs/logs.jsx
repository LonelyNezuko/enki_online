import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom'

import Moment from 'moment'
import 'moment/locale/ru'

import './logs.scss'

export default function Logs({ scheme = { head: [], body: [] }, data = [] }) {
    // scheme: {
    //     head: [ 'Дата', 'Информация', 'Чета еще' ],
    //     body: [
    //         { style: { color: 'red', width: '10%' } }
    //     ]
    // }
    // data: [
    //     [ Moment(new Date()).format(''), 'Log information', 'Чета еще' ]
    // ]

    return (
        <div className="logs">
            <h1 className="title">Последние логи</h1>
            <table className="table">
                <thead>
                    <tr>
                        {scheme.head.map((item, i) => {
                            return (<th key={i}>item</th>)
                        })}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, i) => {
                        return (
                            <>
                                <tr key={i}>
                                    {item.map((item, d) => {
                                        return (<td style={scheme.body[i].style}>{item}</td>)    
                                    })}
                                </tr>
                                {i < data.length - 1 ? (<tr className="margin"></tr>) : ''}
                            </>
                        )    
                    })}
                </tbody>
            </table>
        </div>
    )
}