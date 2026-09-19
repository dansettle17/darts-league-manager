// https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com

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

  // Database lists
  const [leaguesList, setLeaguesList] = useState([]);

  // Form State Values
  const [selectedLeagueId, setSelectedLeagueId] = useState('NEW');
  const [leagueName, setLeagueName] = useState('');
  const [seasonName, setSeasonName] = useState('');
  const [divisionName, setDivisionName] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // 1. Core Authorization Check
  useEffect(() => {
    async function checkAdminStatus() {
      try {
        const session = await fetchAuthSession();
        const userGroups = session.tokens?.accessToken?.payload?.['cognito:groups'] || [];
        setIsAdmin(userGroups.includes('Admins'));
      } catch (error) {
        console.error("Authorization check failed:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAdminStatus();
    loadExistingLeagues();
  }, [user]);

  // 2. Load Leagues Function
  const loadExistingLeagues = async () => {
    try {
      const response = await axios.get(`${API_URL}/structure`);
      setLeaguesList(response.data);
    } catch (error) {
      console.error("Error pulling league listings:", error);
    }
  };

  // 3. Form Input Field Updates on Dropdown Change
  const handleLeagueDropdownChange = (e) => {
    const val = e.target.value;
    setSelectedLeagueId(val);
    
    if (val === 'NEW') {
      setLeagueName('');
    } else {
      const existing = leaguesList.find(l => l.id === val);
      setLeagueName(existing ? existing.name : '');
    }
  };

  const handleSaveStructure = async (e) => {
    e.preventDefault();
    setStatusMessage('Syncing data configurations...');

    try {
      let targetLeagueId = selectedLeagueId;
      const isNewLeague = targetLeagueId === 'NEW';
      
      if (isNewLeague) {
        targetLeagueId = `L-${crypto.randomUUID().slice(0, 8)}`;
      }
      const generatedSeasonId = `S-${crypto.randomUUID().slice(0, 8)}`;
      const generatedDivisionId = `D-${crypto.randomUUID().slice(0, 8)}`;

      // Step One: Save or Rename League
      await axios.post(`${API_URL}/structure`, {
        action: isNewLeague ? 'CREATE_LEAGUE' : 'EDIT_LEAGUE',
        leagueId: targetLeagueId,
        leagueName: leagueName
      });

      // Step Two: Conditional Season setup
      if (seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_SEASON',
          leagueId: targetLeagueId,
          seasonId: generatedSeasonId,
          seasonName: seasonName
        });
      }

      // Step Three: Conditional Division setup
      if (divisionName && seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_DIVISION',
          leagueId: targetLeagueId,
          seasonId: generatedSeasonId,
          divisionId: generatedDivisionId,
          divisionName: divisionName
        });
      }

      setStatusMessage(`🎯 Process Complete! Sync finalized.`);
      setLeagueName('');
      setSeasonName('');
      setDivisionName('');
      setSelectedLeagueId('NEW');
      
      // Refresh list options dynamically
      await loadExistingLeagues();
    } catch (error) {
      console.error(error);
      setStatusMessage(`❌ Error executing sync routines: ${error.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading system assets...</div>;

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span>🎯 Active Admin: <strong>{user?.signInDetails?.loginId}</strong></span>
        <button onClick={signOut} style={{ padding: '6px 12px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Out</button>
      </div>

      <h1>🎯 Darts League Manager</h1>
      
      {isAdmin && (
        <div style={{ margin: '20px auto', padding: '20px', border: '2px solid #2f9e44', backgroundColor: '#ebfbee', maxWidth: '550px', borderRadius: '8px', textAlign: 'left' }}>
          <h3 style={{ color: '#2f9e44', margin: '0 0 15px 0', textAlign: 'center' }}>🛡️ Structural Admin Dashboard</h3>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} onSubmit={handleSaveStructure}>
            <div style={{ background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Target League Selection</label>
              <select value={selectedLeagueId} onChange={handleLeagueDropdownChange} style={{ width: '100%', padding: '6px', marginBottom: '10px' }}>
                <option value="NEW">➕ Create a Brand New League</option>
                {leaguesList.map(league => (
                  <option key={league.id} value={league.id}>📝 Edit/Append: {league.name} ({league.id})</option>
                ))}
              </select>
              
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>League Name</label>
              <input type="text" placeholder="e.g. Local Pub Tournament Association" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} style={{ width: '95%', padding: '6px' }} required />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Add Season (Optional)</label>
                <input type="text" placeholder="e.g. Autumn 2026" value={seasonName} onChange={(e) => setSeasonName(e.target.value)} style={{ width: '90%', padding: '6px' }} />
              </div>
              
              <div style={{ flex: 1, background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px' }}>Add Division (Optional)</label>
                <input type="text" placeholder="e.g. Division A" value={divisionName} onChange={(e) => setDivisionName(e.target.value)} style={{ width: '90%', padding: '6px' }} disabled={!seasonName} />
              </div>
            </div>

            <button type="submit" style={{ padding: '10px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              Save Configurations
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
