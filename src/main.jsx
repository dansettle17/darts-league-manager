import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Amplify } from 'aws-amplify'

// Configure AWS Cognito Auth
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_YrdV5DL1H',      // e.g., eu-west-2_ABC123xyz
      userPoolClientId: 'eu-north-1_YrdV5DL1H' // e.g., 4k5m6n7p8q9r...
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

