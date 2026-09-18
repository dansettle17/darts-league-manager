import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth'; // Required for Amplify v6 groups
import '@aws-amplify/ui-react/styles.css';

// Separate internal layout component to keep the code organized
function MainDashboard({ signOut, user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        // Explicitly fetch the secure session tokens in Amplify v6
        const session = await fetchAuthSession();
        const userGroups = session.tokens?.accessToken?.payload?.['cognito:groups'] || [];
        
        setGroups(userGroups);
        setIsAdmin(userGroups.includes('Admins'));
      } catch (error) {
        console.error("Error fetching Cognito group session:", error);
      } finally {
        setLoading(false);
      }
    }
    
    checkAdminStatus();
  }, [user]);

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Verifying security permissions...</div>;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span>🎯 Welcome, <strong>{user?.signInDetails?.loginId || 'Player'}</strong></span>
        <button 
          onClick={signOut} 
          style={{ padding: '8px 16px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Sign Out
        </button>
      </div>

      <h1>🎯 Darts League Manager</h1>

      {/* 🔍 COMPACT DIAGNOSTIC BOX */}
      <div style={{ textShadow: 'none', background: '#f1f3f5', padding: '10px', borderRadius: '4px', margin: '15px auto', maxWidth: '500px', fontSize: '13px' }}>
        <strong>Cognito Security Groups:</strong> {groups.length > 0 ? JSON.stringify(groups) : 'None Detected'}
      </div>
      
      {/* Conditional Layout Display */}
      {isAdmin ? (
        <div style={{ margin: '20px auto', padding: '20px', border: '2px solid #2f9e44', backgroundColor: '#ebfbee', maxWidth: '500px', borderRadius: '8px' }}>
          <h3 style={{ color: '#2f9e44', margin: 0 }}>🛡️ Admin Control Panel</h3>
          <p style={{ fontSize: '14px' }}>Authenticated as League Coordinator.</p>
          <button style={{ marginRight: '10px', padding: '8px 12px' }}>➕ Create New Season</button>
          <button style={{ padding: '8px 12px' }}>📝 Enter Match Scores</button>
        </div>
      ) : (
        <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ecc94b', backgroundColor: '#fefcbf', maxWidth: '500px', borderRadius: '8px' }}>
          <p style={{ margin: 0, color: '#b7791f' }}>ℹ️ Standard Player View: Contact your league coordinator for admin access.</p>
        </div>
      )}

      <div style={{ margin: '20px auto', padding: '20px', border: '1px solid #ccc', maxWidth: '500px', borderRadius: '8px' }}>
        <h3>🏆 Active Standings</h3>
        <p>Database connection coming soon...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => <MainDashboard signOut={signOut} user={user} />}
    </Authenticator>
  );
}
