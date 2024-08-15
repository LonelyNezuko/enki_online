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
        <div className={`avatar ${props.status ? 'status' : ''} ${props.type ? 'avatar-' + props.type : ''} ${[props.class ? props.class : '']}`} style={props.borderRadius ? {borderRadius: props.borderRadius} : {}} data-status={props.status || 'none'}>
            <section className="avatarWrapper">
                <img src={props.image} alt="Avatar" style={imgStyle} />
            </section>
            {props.code ? props.code : ''}
        </div>
    )
}

