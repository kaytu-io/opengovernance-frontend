/* eslint-disable no-underscore-dangle */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as JotaiProvider } from 'jotai'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Auth0ProviderWithNavigate } from './auth0-provider-with-navigate'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <JotaiProvider>
            <BrowserRouter>
                <Auth0ProviderWithNavigate>
                    <App />
                </Auth0ProviderWithNavigate>
            </BrowserRouter>
        </JotaiProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
