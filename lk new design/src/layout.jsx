import { useLocation } from "react-router-dom";

import Notify from "./components/notify/notify";

import Nav from './components/nav/nav'

export default function Layout()
{
    const location = useLocation();
    return (
        <>
            <Notify />
            <section id="bodyLeft">
                <Nav />
            </section>
        </>
    );
}