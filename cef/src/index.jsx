// import { stopReportingRuntimeErrors } from "react-error-overlay";
// if(process.env.NODE_ENV === "development") stopReportingRuntimeErrors(); // disables error overlays

// if(process.env.NODE_ENV === "development") global.cef = ''


import React from 'react';
import ReactDOM from 'react-dom/client';

import './_index.js'
import './index.scss'

import Registration from './components/registration/registration';
import Hud from './components/hud/hud';
import Dialog from './components/dialog/dialog';
import Phone from './components/phone/phone';
import Bank from './components/bank/bank';
import Speedometr from './components/speedometr/speedometr';
import Notify from './components/notify/notify';
import GoogleAuth from './components/googleauth/googleauth';
// import Chat from './components/chat/chat.jsx';
import Donate from './components/donate/donate.jsx';
import Inventory from './components/inventory/inventory.jsx';

import Sound from './components/sound.jsx';

import Zoom from './modules/zoom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <Zoom />

        <Registration />
        <Hud />
        <Dialog />
        <Phone />
        <Bank />
        <Speedometr />
        <Notify />
        <GoogleAuth />
        {/* <Chat /> */}
        <Donate />
        <Inventory />

        <Sound />
    </>
);
