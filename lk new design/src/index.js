import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    useLocation
} from 'react-router-dom'

import './default.js'
import './index.scss'

import Layout from './layout'

import Header from './components/header/header';

import Router404 from './routes/404/404.jsx';
import IndexRoute from './routes/index';
import SigninRoute from './routes/signin/signin';
import MessagesRoute from './routes/messages/messages.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Layout />

        <section id="body">
            <Header />
            <div className="_wrapper">
                <Routes>
                    <Route exact path='/' element={< IndexRoute />}></Route>
                    <Route exact path='/messages' element={< MessagesRoute />}></Route>

                    <Route exact path='/signin' element={< SigninRoute />}></Route>

                    <Route exact path='*' element={< Router404 />}></Route>
                </Routes>
            </div>
        </section>
    </Router>
);
