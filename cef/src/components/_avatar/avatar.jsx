import React from 'react'
import './avatar.scss'

export default function Avatar(props) {
    let imgStyle = {}

    if(props.position) {
        imgStyle.transform = `translateX(${props.position.x}%) translateY(${props.position.y}%)`

        // imgStyle.left = props.position.x + '%'
        // imgStyle.top = props.position.y + '%'
    }
    if(props.size) {
        imgStyle.width = props.size + '%'
        imgStyle.height = props.size + '%'
    }

    return (
        <div className={`avatar ${props.type ? 'avatar-' + props.type : ''} ${[props.class ? props.class : '']}`} style={props.borderRadius ? {borderRadius: props.borderRadius} : {}}>
            <section className="avatarWrapper">
                <img src={props.image} alt="Avatar" style={imgStyle} />
            </section>
            {props.unread ? (<span className="unread" data-unread={props.unread}></span>) : ''}
            {props.code ? props.code : ''}
        </div>
    )
}

