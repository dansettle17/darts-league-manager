import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import { useLeagueManager } from './useLeagueManager';
import '@aws-amplify/ui-react/styles.css';

function MainDashboard({ signOut, user }) {
  const m = useLeagueManager(user);
  const sortedLeagues = [...m.leaguesList].sort((a, b) => a.name.localeCompare(b.name));

  if (m.loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', backgroundColor: '#1a1a2e', color: '#fff', borderRadius: '8px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => m.setCurrentView('HOME')}>
          <span style={{ fontSize: '24px' }}>🎯</span>
          <h2 style={{ margin: 0, fontSize: '20px' }}>Darts League Central</h2>
        </div>
        <button onClick={signOut} style={{ padding: '6px 12px', background: '#e03131', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Sign Out</button>
      </header>

      {m.currentView === 'HOME' && (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1>League Workspace</h1>
            <p style={{ color: '#64748b' }}>Select an option below to interact with your darts portal.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={tileStyle}><h3>View Standings</h3><button style={tileButtonStyle}>Open Leaderboards</button></div>
            <div style={tileStyle}><h3>Match Results</h3><button style={tileButtonStyle}>View Game Log</button></div>
            {m.isAdmin && (
              <div style={{ ...tileStyle, border: '2px solid #2f9e44', backgroundColor: '#f8fdf9' }}>
                <h3>Manage Leagues</h3>
                <button onClick={() => { m.setManageSubMode('LIST'); m.setCurrentView('MANAGE_LEAGUES'); }} style={{ ...tileButtonStyle, background: '#2f9e44' }}>Configure Structure →</button>
              </div>
            )}
          </div>
        </div>
      )}

      {m.currentView === 'MANAGE_LEAGUES' && (
        <div style={{ maxWidth: '650px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <button onClick={() => m.manageSubMode === 'FORM' ? m.setManageSubMode('LIST') : m.setCurrentView('HOME')} style={{ padding: '8px 14px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              {m.manageSubMode === 'FORM' ? '← Back to League List' : '← Back to Main Menu'}
            </button>
            {m.manageSubMode === 'LIST' && (
              <button onClick={() => { m.setEditingLeagueId(null); m.setLeagueName(''); m.setSeasonName(''); m.setDivisionName(''); m.setManageSubMode('FORM'); }} style={{ padding: '8px 14px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>➕ Create New League</button>
            )}
          </div>

          {m.manageSubMode === 'LIST' && (
            <div style={{ border: '1px solid #dee2e6', backgroundColor: '#fff', borderRadius: '12px', padding: '20px' }}>
              <h3 style={{ textShadow: 'none', textAlign: 'center', margin: '0 0 15px 0' }}>Registered Leagues ({sortedLeagues.length})</h3>
              <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                {sortedLeagues.map((league) => (
                  <div key={league.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid #f1f5f9' }}>
                    <div><strong>{league.name}</strong><div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {league.id}</div></div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { m.setEditingLeagueId(league.id); m.setLeagueName(league.name); m.setManageSubMode('FORM'); }} style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer' }}>✏️</button>
                      <button onClick={() => { if(window.confirm(`Delete ${league.name}?`)) m.handleDeleteLeague(league.id); }} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {m.manageSubMode === 'FORM' && (
            <div style={{ border: '1px solid #dee2e6', backgroundColor: '#fff', borderRadius: '12px', padding: '25px' }}>
              <h3 style={{ textAlign: 'center', color: '#2f9e44' }}>{m.editingLeagueId ? '⚙️ Modify League' : '➕ New Darts League'}</h3>
              <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={m.handleSaveStructure}>
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px' }}>League Name</label>
                  <input type="text" value={m.leagueName} onChange={(e) => m.setLeagueName(e.target.value)} style={{ width: '95%', padding: '8px' }} required />
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                    <label style={{ display: 'block', fontSize: '13px' }}>Add Season</label>
                    <input type="text" value={m.seasonName} onChange={(e) => m.setSeasonName(e.target.value)} style={{ width: '90%', padding: '8px' }} />
                  </div>
                  <div style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '6px' }}>
                    <label style={{ display: 'block', fontSize: '13px' }}>Add Division</label>
                    <input type="text" value={m.divisionName} onChange={(e) => m.setDivisionName(e.target.value)} style={{ width: '90%', padding: '8px' }} disabled={!m.seasonName} />
                  </div>
                </div>
                <button type="submit" style={{ padding: '12px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Save Changes</button>
              </form>
            </div>
          )}
          {m.statusMessage && <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', background: '#f1f5f9', fontWeight: 'bold', textAlign: 'center' }}>{m.statusMessage}</div>}
        </div>
      )}
    </div>
  );
}

const tileStyle = { background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '25px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '10px' };
const tileButtonStyle = { width: '100%', padding: '10px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: 'auto' };

export default function App() { return <Authenticator>{({ signOut, user }) => <MainDashboard signOut={signOut} user={user} />}</Authenticator>; }
