// https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com

import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'react';
import ManageLeagues from './ManageLeagues'; // Imports your sub-file smoothly
import '@aws-amplify/ui-react/styles.css';

// 🛑 REPLACE THIS URL WITH YOUR ACTUAL API GATEWAY INVOKE URL
const API_URL = 'https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com';

function MainDashboard({ signOut, user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('HOME');
  const [leaguesList, setLeaguesList] = useState([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState('NEW');
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
        console.error("Authorization check failed:", error);
      } finally {
        setLoading(false);
      }
    }
    checkAdminStatus();
    loadExistingLeagues();
  }, [user]);

  const loadExistingLeagues = async () => {
    try {
      const response = await axios.get(`${API_URL}/structure`);
      setLeaguesList(response.data);
    } catch (error) {
      console.error("Error pulling league listings:", error);
    }
  };

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

      await axios.post(`${API_URL}/structure`, {
        action: isNewLeague ? 'CREATE_LEAGUE' : 'EDIT_LEAGUE',
        leagueId: targetLeagueId,
        leagueName: leagueName
      });

      if (seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_SEASON',
          leagueId: targetLeagueId,
          seasonId: generatedSeasonId,
          seasonName: seasonName
        });
      }

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
      await loadExistingLeagues();
    } catch (error) {
      console.error(error);
      setStatusMessage(`❌ Error: ${error.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#1a1a2e', color: '#fff', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setCurrentView('HOME')}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Darts League Central</h2>
        </div>
        <div>
          <button onClick={signOut} style={{ padding: '6px 12px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </header>

      {currentView === 'HOME' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1>League Workspace</h1>
            <p style={{ color: '#64748b' }}>Select an option below to interact with your darts portal.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={tileStyle}>
              <h3>View Standings</h3>
              <button style={tileButtonStyle}>Open Leaderboards</button>
            </div>
            <div style={tileStyle}>
              <h3>Match Results</h3>
              <button style={tileButtonStyle}>View Game Log</button>
            </div>
            {isAdmin && (
              <div style={{ ...tileStyle, border: '2px solid #2f9e44' }}>
                <h3>Manage Leagues</h3>
                <button onClick={() => setCurrentView('MANAGE_LEAGUES')} style={{ ...tileButtonStyle, background: '#2f9e44' }}>Configure Structure →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'MANAGE_LEAGUES' && (
        <ManageLeagues 
          setCurrentView={setCurrentView}
          handleSaveStructure={handleSaveStructure}
          selectedLeagueId={selectedLeagueId}
          handleLeagueDropdownChange={handleLeagueDropdownChange}
          leaguesList={leaguesList}
          leagueName={leagueName}
          setLeagueName={setLeagueName}
          seasonName={seasonName}
          setSeasonName={setSeasonName}
          divisionName={divisionName}
          setDivisionName={setDivisionName}
          statusMessage={statusMessage}
        />
      )}
    </div>
  );
}

const tileStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', textAlign: 'center' };
const tileButtonStyle = { width: '100%', padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '15px' };

export default function App() { return <Authenticator>{({ signOut, user }) => <MainDashboard signOut={signOut} user={user} />}</Authenticator>; }
