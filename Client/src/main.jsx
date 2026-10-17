import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import {MotionConfig} from 'motion/react'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <LanguageProvider>
            <AppProvider>
                <MotionConfig viewport={{once : true}}>
                    <App />
                </MotionConfig>
            </AppProvider>
        </LanguageProvider>
    </BrowserRouter>,
)
