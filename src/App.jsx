import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => {
        // 1. Gather groups from all potential token payloads to avoid library version mismatches
        const accessTokenGroups = user?.tokens?.accessToken?.payload?.['cognito:groups'] || [];
        const idTokenGroups = user?.tokens?.idToken?.payload?.['cognito:groups'] || [];
        const groups = [...new Set([...accessTokenGroups, ...idTokenGroups])];
    
        // 2. Check if the logged-in user belongs to the 'Admins' group
        const isAdmin = groups.includes('Admins');

        return (
          <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span>🎯 Welcome, <strong>{user?.signInDetails?.loginId || 'User'}</strong></span>
              <button 
                onClick={signOut} 
                style={{ padding: '8px 16px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Sign Out
              </button>
            </div>

            <h1>🎯 Darts League Manager</h1>
            
            {/* 3. Conditional Admin Control Panel */}
            {isAdmin ? (
              <div style={{ margin: '20px auto', padding: '20px', border: '2px solid #2f9e44', backgroundColor: '#ebfbee', maxWidth: '500px', borderRadius: '8px' }}>
                <h3 style={{ color: '#2f9e44', margin: 0 }}>🛡️ Admin Control Panel</h3>
                <p style={{ fontSize: '14px' }}>You have access to create fixtures and manage league settings.</p>
                <button style={{ marginRight: '10px', padding: '8px 12px' }}>➕ Create New Season</button>
                <button style={{ padding: '8px 12px' }}>📝 Enter Match Scores</button>
              </div>
            ) : (
              <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ecc94b', backgroundColor: '#fefcbf', maxWidth: '500px', borderRadius: '8px' }}>
                <p style={{ margin: 0, color: '#b7791f' }}>ℹ️ Standard Player View: Contact your league coordinator for admin access.</p>
              </div>
            )}

            {/* Standard public view visible to everyone */}
            <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', maxWidth: '500px', borderRadius: '8px' }}>
              <h3>🏆 Active Standings</h3>
              <p>Database connection coming soon...</p>
            </div>
          </div>
        );
      }}
    </Authenticator>
  );
}

export default App;
