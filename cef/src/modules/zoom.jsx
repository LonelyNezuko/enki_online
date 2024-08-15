import React from 'react'
import $ from 'jquery'

import _cef from './cef'

export default function Zoom() {
    const [ zoom, setZoom ] = React.useState(1.0)

    React.useMemo(() => {
        _cef.on('ui::zoom', zoom => setZoom(zoom))
    }, [])
    React.useEffect(() => {
        $('#root').css('zoom', zoom)
    }, [zoom])
    
    return (<></>)
}