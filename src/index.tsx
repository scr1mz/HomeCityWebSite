import React from 'react';
import ReactDOM from 'react-dom/client';
import "./i18n";
import './index.css';
import { App } from './App';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <CookiesProvider>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </CookiesProvider>
);
