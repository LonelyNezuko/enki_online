import React from 'react'
import $ from 'jquery'

import _cef from '../../../modules/cef'

import './accessories.scss'

export default function DonateAccessories({ sToggle }) {
    const [ pageToggle, setPageToggle ] = React.useState(false)
    React.useEffect(() => {
        setPageToggle(sToggle)
    }, [sToggle])

    const [ accessories, setAccessories ] = React.useState([
        { id: 10, name: 'Шахтерская каска', img: 'minehead.png', color: "#DFB54E", price: 1999 },
        { id: 4, name: 'Часы Rolex', img: 'watchrolex.png', color: "#DFB54E", price: 1999 },
        { id: 5, name: 'Часы Supreme', img: 'watchsupreme.png', color: "#DFB54E", price: 1999 },
        { id: 3, name: 'Рюкзак 20 кг', img: 'backpack20.png', color: "#555555", price: 1999 },
        { id: 8, name: 'Новодний подарок', img: 'nybox.png', color: "#555555", price: 1999 },
        { id: 9, name: 'Новогодняя елка', img: 'nytree.png', color: "#555555", price: 1999 }
    ])

    React.useMemo(() => {
        _cef.on('ui::donate:accessories:prices', prices => {
            prices = prices.split(',')

            const accessories = JSON.parse($('.donate .accessories').attr('data-acs'))
            accessories.map((item, i) => {
                item.price = prices[i] || 0
            })

            setAccessories(accessories)
        })
    }, [])

    return (
        <div data-acs={JSON.stringify(accessories)} style={{display: !pageToggle ? 'none' : 'flex'}} className="other improvements accessories">
            {accessories.map((item, i) => {
                return (
                    <div className="elem" key={i}>
                        <div className="icon" style={{backgroundColor: item.color}}>
                            <img src={`assets/donate/accessories/${item.img}`} />
                        </div>
                        <div className="title">{item.name}</div>
                        <div className="buttons">
                            <div className="wrap">
                                <button onClick={() => _cef.event('client::donate:buy', `${item.id}`)}>Приобрести</button>
                                <button className="price">{item.price.toLocaleString()} RUB</button>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}