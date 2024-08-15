import React from 'react'
import {Howl} from 'howler';

import _cef from '../modules/cef'

export default function Sound() {

    React.useMemo(() => {
        _cef.on('ui::sound', (url, volume) => {
            playAudio(url, { volume: volume })
        })
    }, [])

    function playAudio(url, settings = {}) {
        const sound = new Howl({
            src: [url],
            volume: settings.volume || 1
        })
        sound.play()
    }
    return (<></>)
}