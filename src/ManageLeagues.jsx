function FormField({ label, children, hint }) {
  return (
    <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: '#475569' }}>
        {label}
      </label>
      {children}
      {hint && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>{hint}</div>}
    </div>
  );
}

export default function ManageLeagues({
  setCurrentView,
  leaguesList,
  manageSubMode,
  setManageSubMode,
  editingLeagueId,
  setEditingLeagueId,
  leagueName,
  setLeagueName,
  seasonName,
  setSeasonName,
  divisionName,
  setDivisionName,
  statusMessage,
  setStatusMessage,
  handleSaveStructure,
  handleDeleteLeague,
}) {
  const sortedLeagues = [...leaguesList].sort((a, b) => a.name.localeCompare(b.name));

  const resetForm = () => {
    setEditingLeagueId(null);
    setLeagueName('');
    setSeasonName('');
    setDivisionName('');
    setStatusMessage('');
    setManageSubMode('FORM');
  };

  const launchEditForm = (league) => {
    setEditingLeagueId(league.id);
    setLeagueName(league.name);
    setSeasonName('');
    setDivisionName('');
    setStatusMessage('');
    setManageSubMode('FORM');
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => (manageSubMode === 'FORM' ? setManageSubMode('LIST') : setCurrentView('HOME'))}
          style={{
            padding: '8px 14px',
            background: '#64748b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {manageSubMode === 'FORM' ? '← Back to League List' : '← Back to Main Menu'}
        </button>

        {manageSubMode === 'LIST' && (
          <button
            onClick={resetForm}
            style={{
              padding: '8px 14px',
              background: '#2f9e44',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ➕ Create New League
          </button>
        )}
      </div>

      {manageSubMode === 'LIST' && (
        <div style={{ border: '1px solid #dee2e6', backgroundColor: '#fff', borderRadius: '12px', padding: '20px' }}>
          <h3 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>Registered Leagues ({sortedLeagues.length})</h3>

          <div style={{ maxHeight: '350px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
            {sortedLeagues.map((league) => (
              <div
                key={league.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 15px',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <strong>{league.name}</strong>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {league.id}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => launchEditForm(league)}
                    style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => {
                      if (window.confirm(`Delete ${league.name}?`)) {
                        handleDeleteLeague(league.id);
                      }
                    }}
                    style={{ background: '#ef4444', color: 'white', border: 'none', padding: '8px 10px', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {manageSubMode === 'FORM' && (
        <div style={{ border: '1px solid #dee2e6', backgroundColor: '#fff', borderRadius: '12px', padding: '25px' }}>
          <h3 style={{ textAlign: 'center', color: '#2f9e44', margin: '0 0 20px 0' }}>
            {editingLeagueId ? '⚙️ Modify League' : '➕ New Darts League'}
          </h3>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px' }} onSubmit={handleSaveStructure}>
            <FormField label="League Name">
              <input
                type="text"
                value={leagueName}
                onChange={(event) => setLeagueName(event.target.value)}
                style={{ width: '95%', padding: '8px' }}
                required
              />
            </FormField>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={{ flex: 1 }}>
                <FormField label="Add Season" hint="Optional">
                  <input
                    type="text"
                    value={seasonName}
                    onChange={(event) => setSeasonName(event.target.value)}
                    style={{ width: '90%', padding: '8px' }}
                  />
                </FormField>
              </div>

              <div style={{ flex: 1 }}>
                <FormField label="Add Division" hint="Requires a season">
                  <input
                    type="text"
                    value={divisionName}
                    onChange={(event) => setDivisionName(event.target.value)}
                    style={{ width: '90%', padding: '8px' }}
                    disabled={!seasonName}
                  />
                </FormField>
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px',
                background: '#2f9e44',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      {statusMessage && (
        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            borderRadius: '6px',
            background: '#f1f5f9',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
