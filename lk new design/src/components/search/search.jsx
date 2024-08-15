import React from 'react'
import $ from 'jquery'
import { Link } from 'react-router-dom'

import AccountCard from '../accountCard/accountCard'

import './search.scss'

export default function Search() {
    return (
        <div id="search" style={{display: 'none'}}>
            <div className="list">
                {/* <AccountCard account={account} /> */}
            </div>
        </div>
    )
}