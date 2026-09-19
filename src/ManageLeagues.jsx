import React, { useState } from 'react';

export default function ManageLeagues({ 
  setCurrentView, 
  leaguesList, 
  handleSaveStructure, 
  handleDeleteLeague,
  leagueName, 
  setLeagueName, 
  seasonName, 
  setSeasonName, 
  divisionName, 
  setDivisionName, 
  statusMessage,
  setStatusMessage
}) {
  // Screen sub-state routing manager: 'LIST' or 'FORM'
  const [subMode, setSubMode] = useState('LIST');
  const [editingLeagueId, setEditingLeagueId] = useState(null);

  // Organise array alphabetically by name string sequences
  const sortedLeagues = [...leaguesList].sort((a, b) => a.name.localeCompare(b.name));

  const triggerCreateForm = () => {
    setEditingLeagueId(null);
    setLeagueName('');
    setSeasonName('');
    setDivisionName('');
    setStatusMessage('');
    setSubMode('FORM');
  };

  const triggerEditForm = (league) => {
    setEditingLeagueId(league.id);
    setLeagueName(league.name);
    setSeasonName('');
    setDivisionName('');
    setStatusMessage('');
    setSubMode('FORM');
  };

  const onFormSubmitHandler = async (e) => {
    e.preventDefault();
    await handleSaveStructure(editingLeagueId);
    setSubMode('LIST');
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      
      {/* 🧭 NAVIGATION TRAIL HEADER BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => subMode === 'FORM' ? setSubMode('LIST') : setCurrentView('HOME')} 
          style={{ padding: '8px 14px', background: '#64748b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {subMode === 'FORM' ? '← Back to League Index' : '← Back to Main Menu'}
        </button>
        
        {subMode === 'LIST' && (
          <button 
            onClick={triggerCreateForm}
            style={{ padding: '8px 14px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            ➕ Create New League
          </button>
        )}
      </div>

      {/* =========================================================
          SCREEN STAGE A: THE SCROLLABLE ALPHABETICAL INDEX LIST
         ========================================================= */}
      {subMode === 'LIST' && (
        <div style={{ border: '1px solid #dee2e6', backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1e293b', textAlign: 'center' }}>Registered Leagues ({sortedLeagues.length})</h3>
          
          {sortedLeagues.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>No leagues tracked in database yet. Click create above to start.</p>
          ) : (
            // Scrollable Container Block Frame
            <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '5px' }}>
              {sortedLeagues.map((league) => (
                <div key={league.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 15px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
                  <div>
                    <strong style={{ color: '#0f172a', fontSize: '15px' }}>{league.name}</strong>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {league.id}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => triggerEditForm(league)}
                      title="Edit League & Add Seasons"
                      style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => { if(window.confirm(`Delete ${league.name}?`)) handleDeleteLeague(league.id); }}
                      title="Delete League Metadata Record"
                      style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =========================================================
          SCREEN STAGE B: THE FOCUSED EDIT/CREATE MANAGEMENT VIEW 
         ========================================================= */}
      {subMode === 'FORM' && (
        <div style={{ border: '1px solid #dee2e6', backgroundColor: '#ffffff', borderRadius: '12px', padding: '25px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
          <h3 style={{ color: '#2f9e44', margin: '0 0 20px 0', textAlign: 'center', fontSize: '20px' }}>
            {editingLeagueId ? `⚙️ Modify League Setup` : '➕ Provision New Darts League'}
          </h3>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={onFormSubmitHandler}>
            <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>League Name Description</label>
              <input 
                type="text" 
                placeholder="e.g. Mid-Week Premier Pub Darts Association" 
                value={leagueName} 
                onChange={(e) => setLeagueName(e.target.value)} 
                style={{ width: '96%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
                required 
              />
            </div>

            {/* Sub-structures available underneath active configuration targets */}
            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>Add Season (Optional)</label>
                <input type="text" placeholder="e.g. Winter Term 2026" value={seasonName} onChange={(e) => setSeasonName(e.target.value)} style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              </div>
              
              <div style={{ flex: 1, background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>Add Division (Optional)</label>
                <input type="text" placeholder="e.g. Section B" value={divisionName} onChange={(e) => setDivisionName(e.target.value)} style={{ width: '90%', padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e1' }} disabled={!seasonName} />
              </div>
            </div>

            <button type="submit" style={{ padding: '12px', background: '#2f9e44', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', marginTop: '10px' }}>
              {editingLeagueId ? 'Update & Commit Changes' : 'Initialize Infrastructure Track'}
            </button>
          </form>
        </div>
      )}

      {statusMessage && <div style={{ marginTop: '20px', padding: '12px', borderRadius: '6px', background: '#f1f5f9', fontWeight: 'bold', textAlign: 'center', color: '#1e293b', fontSize: '14px' }}>{statusMessage}</div>}
    </div>
  );
}
