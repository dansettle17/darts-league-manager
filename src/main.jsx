import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Amplify } from 'aws-amplify'

// Configure AWS Cognito Auth
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_Vrjy2uuu0',      // e.g., eu-west-2_ABC123xyz
      userPoolClientId: '55bonh2athid93ejepomjbig3c' // e.g., 4k5m6n7p8q9r...
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

