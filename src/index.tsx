import React from 'react';
import ReactDOM from 'react-dom/client';
import "./i18n";
import './index.scss';
import { App } from './App';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from 'react-router-dom';
import { MobileMenuProvider } from './components/MobileMenuProvider/MobileMenuProvider'

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <CookiesProvider>
        <BrowserRouter>
            <MobileMenuProvider>
            <App />
            </MobileMenuProvider>
        </BrowserRouter>
    </CookiesProvider>
);
