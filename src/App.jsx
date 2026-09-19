// https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com

import React, { useState, useEffect } from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios'; 
import ManageLeagues from './ManageLeagues'; 
import '@aws-amplify/ui-react/styles.css';

// 🛑 REPLACE THIS URL WITH YOUR ACTUAL API GATEWAY INVOKE URL
const API_URL = 'https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com';

function MainDashboard({ signOut, user }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('HOME');
  const [leaguesList, setLeaguesList] = useState([]);
  
  // Working Forms Input States
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
        console.error("Authorization access error:", error);
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
      setLeaguesList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error reading tables:", error);
      setLeaguesList([]);
    }
  };

  const handleDeleteLeague = async (idToWipe) => {
    setStatusMessage('Removing record from database...');
    try {
      await axios.delete(`${API_URL}/structure`, { params: { leagueId: idToWipe } });
      setStatusMessage('🗑️ League record successfully erased.');
      await loadExistingLeagues();
    } catch (error) {
      console.error(error);
      setStatusMessage(`❌ Wipe failure: ${error.message}`);
    }
  };

  const handleSaveStructure = async (existingId) => {
    setStatusMessage('Syncing configurations...');
    try {
      const isEdit = !!existingId;
      const targetLeagueId = isEdit ? existingId : `L-${crypto.randomUUID().slice(0, 8)}`;
      const generatedSeasonId = `S-${crypto.randomUUID().slice(0, 8)}`;
      const generatedDivisionId = `D-${crypto.randomUUID().slice(0, 8)}`;

      await axios.post(`${API_URL}/structure`, {
        action: isEdit ? 'EDIT_LEAGUE' : 'CREATE_LEAGUE',
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

      setStatusMessage(`🎯 Structural sync finalized for League ID: ${targetLeagueId}`);
      setLeagueName('');
      setSeasonName('');
      setDivisionName('');
      await loadExistingLeagues();
    } catch (error) {
      console.error(error);
      setStatusMessage(`❌ Operational failure: ${error.message}`);
    }
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Synchronizing credentials...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#1a1a2e', color: '#fff', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setCurrentView('HOME')}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Darts League Central</h2>
        </div>
        <div>
          <button onClick={signOut} style={{ padding: '6px 12px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Sign Out</button>
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
              <div style={{ fontSize: '32px' }}>🏆</div>
              <h3>View Standings</h3>
              <button style={tileButtonStyle}>Open Leaderboards</button>
            </div>
            <div style={tileStyle}>
              <div style={{ fontSize: '32px' }}>📝</div>
              <h3>Match Results</h3>
              <button style={tileButtonStyle}>View Game Log</button>
            </div>
            {isAdmin && (
              <div style={{ ...tileStyle, border: '2px solid #2f9e44', backgroundColor: '#f8fdf9' }}>
                <div style={{ fontSize: '32px' }}>🛡️</div>
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
          leaguesList={leaguesList}
          handleSaveStructure={handleSaveStructure}
          handleDeleteLeague={handleDeleteLeague}
          leagueName={leagueName}
          setLeagueName={setLeagueName}
          seasonName={seasonName}
          setSeasonName={setSeasonName}
          divisionName={divisionName}
          setDivisionName={setDivisionName}
          statusMessage={statusMessage}
          setStatusMessage={setStatusMessage}
        />
      )}
    </div>
  );
}

const tileStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' };
const tileButtonStyle = { width: '100%', padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: 'auto' };

export default function App() { return <Authenticator>{({ signOut, user }) => <MainDashboard signOut={signOut} user={user} />}</Authenticator>; }
