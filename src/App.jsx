import React from 'react';
// Import the Authenticator helper and its default styling layout
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    // Wrap everything inside the Authenticator provider wrapper
    <Authenticator>
      {({ signOut, user }) => (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <span>Logged in as: <strong>{user?.username || user?.signInDetails?.loginId}</strong></span>
            <button 
              onClick={signOut} 
              style={{ padding: '8px 16px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </div>

          <h1>🎯 Darts League Manager</h1>
          <p>Welcome to your serverless league management application.</p>
          
          <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', maxWidth: '400px', borderRadius: '8px' }}>
            <h3>🏆 Active Standings</h3>
            <p>Database connection coming soon...</p>
          </div>
        </div>
      )}
    </Authenticator>
  );
}

export default App;
