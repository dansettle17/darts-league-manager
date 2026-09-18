import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Amplify } from 'aws-amplify'

// Configure AWS Cognito Auth
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: 'eu-north-1_Vrjy2uuu0', // e.g., eu-west-2_xxxxxx
      userPoolClientId: '55bonh2athid93ejepomjbig3c', // e.g., 1a2b3c4d5e...
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


function App() {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1>🎯 Darts League Manager</h1>
      <p>Welcome to your serverless league management application.</p>
      <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', maxWidth: '400px', borderRadius: '8px' }}>
        <h3>🏆 Active Standings</h3>
        <p>Database connection coming soon ish...</p>
      </div>
    </div>
  );
}

export default App;
