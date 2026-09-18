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
      {isAdmin && (
      <div style={{ margin: '20px auto', padding: '20px', border: '2px solid #2f9e44', backgroundColor: '#ebfbee', maxWidth: '500px', borderRadius: '8px', textAlign: 'left' }}>
        <h3 style={{ color: '#2f9e44', margin: '0 0 15px 0', textAlign: 'center' }}>🛡️ League Structure Manager</h3>
    
        <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={(e) => e.preventDefault()}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>Select League</label>
            <select style={{ width: '100%', padding: '6px' }}>
              <option>Friday Night Darts League</option>
           </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>New Season Name</label>
              <input type="text" placeholder="Winter 2026" style={{ width: '90%', padding: '6px' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>Division (e.g. Div A)</label>
              <input type="text" placeholder="Division A" style={{ width: '90%', padding: '6px' }} />
            </div>
          </div>

      <button type="submit" style={{ padding: '8px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
        Save Structure Configuration
      </button>
    </form>
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
