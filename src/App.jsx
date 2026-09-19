import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';
import '@aws-amplify/ui-react/styles.css';

// 🛑 INSERT YOUR API GATEWAY INVOKE URL HERE
const API_URL = 'https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com';

function MainDashboard({ signOut, user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Structural Form State Layouts
  const [leagueId, setLeagueId] = useState('');
  const [leagueName, setLeagueName] = useState('');
  const [seasonName, setSeasonName] = useState('');
  const [divisionName, setDivisionName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const session = await fetchAuthSession();
        const userGroups = session.tokens?.accessToken?.payload?.['cognito:groups'] || [];
        setIsAdmin(userGroups.includes('Admins'));
      } catch (error) {
        console.error("Error verification error:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAdminStatus();
  }, [user]);

  const handleSaveStructure = async (e) => {
    e.preventDefault();
    setStatusMessage('Syncing with AWS database servers...');

    try {
      // 1. Resolve or generate target unique IDs
      let targetLeagueId = leagueId.trim();
      const isNewLeague = !targetLeagueId;
      
      if (isNewLeague) {
        targetLeagueId = `L-${crypto.randomUUID().slice(0, 8)}`;
      }
      const generatedSeasonId = `S-${crypto.randomUUID().slice(0, 8)}`;
      const generatedDivisionId = `D-${crypto.randomUUID().slice(0, 8)}`;

      // 2. Step One: Create or edit the master League entry
      if (leagueName) {
        await axios.post(`${API_URL}/structure`, {
          action: isNewLeague ? 'CREATE_LEAGUE' : 'EDIT_LEAGUE',
          leagueId: targetLeagueId,
          leagueName: leagueName
        });
      }

      // 3. Step Two: If fields are filled, link a new Season configuration block
      if (seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_SEASON',
          leagueId: targetLeagueId,
          seasonId: generatedSeasonId,
          seasonName: seasonName
        });
      }

      // 4. Step Three: Link a new Division block line
      if (divisionName && seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_DIVISION',
          leagueId: targetLeagueId,
          seasonId: generatedSeasonId,
          divisionId: generatedDivisionId,
          divisionName: divisionName
        });
      }

      setStatusMessage(`🎯 Successfully processed! League ID: ${targetLeagueId}`);
      // Wipe input nodes clean
      setLeagueId('');
      setLeagueName('');
      setSeasonName('');
      setDivisionName('');
    } catch (error) {
      console.error(error);
      setStatusMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Verifying permissions...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span>🎯 Welcome Admin: <strong>{user?.signInDetails?.loginId}</strong></span>
        <button onClick={signOut} style={{ padding: '6px 12px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Out</button>
      </div>

      <h1>🎯 Darts League Manager</h1>
      
      {isAdmin && (
        <div style={{ margin: '20px auto', padding: '20px', border: '2px solid #2f9e44', backgroundColor: '#ebfbee', maxWidth: '550px', borderRadius: '8px', textAlign: 'left' }}>
          <h3 style={{ color: '#2f9e44', margin: '0 0 15px 0', textAlign: 'center' }}>🛡️ Master Structure Admin</h3>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onSubmit={handleSaveStructure}>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>League ID (Leave empty to create a NEW league)</label>
              <input type="text" placeholder="e.g. L-abc12345 (Paste here to edit name or append sub-structures)" value={leagueId} onChange={(e) => setLeagueId(e.target.value)} style={{ width: '95%', padding: '6px' }} />
              
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginTop: '10px', marginBottom: '4px' }}>League Name</label>
              <input type="text" placeholder="e.g. Monday Night Pub League" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} style={{ width: '95%', padding: '6px' }} required />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Add Season (Optional)</label>
                <input type="text" placeholder="e.g. Spring 2026" value={seasonName} onChange={(e) => setSeasonName(e.target.value)} style={{ width: '90%', padding: '6px' }} />
              </div>
              
              <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Add Division (Optional)</label>
                <input type="text" placeholder="e.g. Division 1" value={divisionName} onChange={(e) => setDivisionName(e.target.value)} style={{ width: '90%', padding: '6px' }} disabled={!seasonName} />
              </div>
            </div>

            <button type="submit" style={{ padding: '10px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Execute Structural Database Entry
            </button>
          </form>

          {statusMessage && <p style={{ marginTop: '15px', fontWeight: 'bold', textAlign: 'center', color: '#2b2b2b' }}>{statusMessage}</p>}
        </div>
      )}
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
