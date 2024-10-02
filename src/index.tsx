/* eslint-disable no-underscore-dangle */
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as JotaiProvider } from 'jotai'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { AuthProviderWithNavigate } from './auth-provider-with-navigate'
import { applyTheme, currentTheme } from './utilities/theme'
import { GithubComKaytuIoKaytuEnginePkgAuthApiTheme } from './api/api'
import enMessages from '@cloudscape-design/components/i18n/messages/all.en'
import { I18nProvider } from '@cloudscape-design/components/i18n'
const currentThemeValue = currentTheme()
if (
    currentThemeValue ===
        GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeDark ||
    (currentThemeValue ===
        GithubComKaytuIoKaytuEnginePkgAuthApiTheme.ThemeSystem &&
        window.matchMedia('(prefers-color-scheme:dark)').matches)
) {
    document.documentElement.classList.add('dark')
} else {
    document.documentElement.classList.remove('dark')
}

// if (
//     localStorage.theme === 'dark' /* ||
//     (!('theme' in localStorage) &&
//         window.matchMedia('(prefers-color-scheme:dark)').matches) */
// ) {
//     document.documentElement.classList.add('dark')
// } else {
//     document.documentElement.classList.remove('dark')
// }

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <JotaiProvider>
            <BrowserRouter>
                <AuthProviderWithNavigate>
                    <I18nProvider locale="en" messages={[enMessages]}>
                        <App />
                    </I18nProvider>
                </AuthProviderWithNavigate>
            </BrowserRouter>
        </JotaiProvider>
    </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
