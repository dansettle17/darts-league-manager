import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import '@aws-amplify/ui-react/styles.css';

// 🛑 REPLACE THIS URL WITH YOUR ACTUAL API GATEWAY INVOKE URL
const API_URL = 'https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com';

function MainDashboard({ signOut, user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form State Values
  const [seasonName, setSeasonName] = useState('');
  const [divisionName, setDivisionName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function checkAdminStatus() {
      try {
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

  // Form Submission Handler
  const handleSaveStructure = async (e) => {
    e.preventDefault();
    setStatusMessage('Saving to cloud database...');

    try {
      // Hardcoded baseline league ID for initial setup simplicity
      const leagueId = 'L-001'; 
      const generatedSeasonId = crypto.randomUUID().slice(0, 8);
      const generatedDivisionId = crypto.randomUUID().slice(0, 8);

      // 1. First, create the Season record
      if (seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_SEASON',
          leagueId: leagueId,
          seasonId: generatedSeasonId,
          seasonName: seasonName
        });
      }

      // 2. Second, create the Division record tied to that Season
      if (divisionName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_DIVISION',
          leagueId: leagueId,
          seasonId: generatedSeasonId,
          divisionId: generatedDivisionId,
          divisionName: divisionName
        });
      }

      setStatusMessage('🎯 Configuration saved successfully to DynamoDB!');
      setSeasonName('');
      setDivisionName('');
    } catch (error) {
      console.error('API Error:', error);
      setStatusMessage(`❌ Error saving structure: ${error.response?.data?.error || error.message}`);
    }
  };

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

      <div style={{ background: '#f1f3f5', padding: '10px', borderRadius: '4px', margin: '15px auto', maxWidth: '500px', fontSize: '13px' }}>
        <strong>Cognito Security Groups:</strong> {groups.length > 0 ? JSON.stringify(groups) : 'None Detected'}
      </div>
      
      {isAdmin && (
        <div style={{ margin: '20px auto', padding: '20px', border: '2px solid #2f9e44', backgroundColor: '#ebfbee', maxWidth: '500px', borderRadius: '8px', textAlign: 'left' }}>
          <h3 style={{ color: '#2f9e44', margin: '0 0 15px 0', textAlign: 'center' }}>🛡️ League Structure Manager</h3>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} onSubmit={handleSaveStructure}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>Default Tracking League</label>
              <select style={{ width: '100%', padding: '6px' }} disabled>
                <option>Friday Night Darts League (L-001)</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>New Season Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Winter 2026" 
                  value={seasonName}
                  onChange={(e) => setSeasonName(e.target.value)}
                  style={{ width: '90%', padding: '6px' }} 
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold' }}>Division Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Division A" 
                  value={divisionName}
                  onChange={(e) => setDivisionName(e.target.value)}
                  style={{ width: '90%', padding: '6px' }} 
                  required
                />
              </div>
            </div>

            <button type="submit" style={{ padding: '8px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
              Save Structure Configuration
            </button>
          </form>

          {statusMessage && (
            <p style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'center', fontSize: '14px' }}>{statusMessage}</p>
          )}
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
