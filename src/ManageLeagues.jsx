import React from 'react';

export default function ManageLeagues({ 
  setCurrentView, 
  handleSaveStructure, 
  selectedLeagueId, 
  handleLeagueDropdownChange, 
  leaguesList, 
  leagueName, 
  setLeagueName, 
  seasonName, 
  setSeasonName, 
  divisionName, 
  setDivisionName, 
  statusMessage 
}) {
  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setCurrentView('HOME')} 
          style={{ padding: '6px 12px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ← Back to Main Menu
        </button>
      </div>

      <div style={{ margin: '0 auto', padding: '25px', border: '1px solid #dee2e6', backgroundColor: '#ffffff', maxWidth: '600px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <h3 style={{ color: '#2f9e44', margin: '0 0 20px 0', textAlign: 'center', fontSize: '22px' }}>🛡️ Structural Admin Dashboard</h3>
        
        <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleSaveStructure}>
          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>Target League Selection</label>
            <select value={selectedLeagueId} onChange={handleLeagueDropdownChange} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1', marginBottom: '15px' }}>
              <option value="NEW">➕ Create a Brand New League</option>
              {leaguesList.map(league => (
                <option key={league.id} value={league.id}>📝 Edit/Append: {league.name} ({league.id})</option>
              ))}
            </select>
            
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>League Name</label>
            <input type="text" placeholder="e.g. Local Pub Tournament Association" value={leagueName} onChange={(e) => setLeagueName(e.target.value)} style={{ width: '96%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} required />
          </div>

          <div style={{ display: 'flex', gap: '15px' }}>
            <div style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>Add Season (Optional)</label>
              <input type="text" placeholder="e.g. Autumn 2026" value={seasonName} onChange={(e) => setSeasonName(e.target.value)} style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            </div>
            
            <div style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>Add Division (Optional)</label>
              <input type="text" placeholder="e.g. Division A" value={divisionName} onChange={(e) => setDivisionName(e.target.value)} style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} disabled={!seasonName} />
            </div>
          </div>

          <button type="submit" style={{ padding: '12px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
            Save Configurations
          </button>
        </form>

        {statusMessage && <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', background: '#f1f5f9', fontWeight: 'bold', textAlign: 'center', color: '#1e293b', fontSize: '14px', border: '1px solid #e2e8f0' }}>{statusMessage}</div>}
      </div>
    </div>
  );
}
