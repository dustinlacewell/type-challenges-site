import React from 'react';

import { AppProps } from 'next/app';

import Header from '../components/Header';

import './styles.scss';


function CustomApp({ Component, pageProps }: AppProps) {
    return <div className=".app">
        { !pageProps.hideHeader && <Header />}
        <div className="content">
            <Component {...pageProps} />
        </div>
    </div>
}

export default CustomApp;
