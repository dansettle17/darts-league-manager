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
        <div
          style={{
            border: '1px solid #dee2e6',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <div>
              <div style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
                League Registry
              </div>
              <h3 style={{ margin: '4px 0 0 0', textAlign: 'left' }}>Registered Leagues ({sortedLeagues.length})</h3>
            </div>
          </div>

          {sortedLeagues.length === 0 ? (
            <div
              style={{
                border: '1px dashed #cbd5e1',
                borderRadius: '8px',
                padding: '24px 16px',
                textAlign: 'center',
                color: '#64748b',
                background: '#f8fafc',
              }}
            >
              No leagues configured yet. Create your first league to get started.
            </div>
          ) : (
            <div
              style={{
                maxHeight: '350px',
                overflowY: 'auto',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                background: '#f8fafc',
              }}
            >
              {sortedLeagues.map((league) => (
                <div
                  key={league.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    background: '#fff',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: '#e0f2fe',
                        color: '#0f172a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700',
                        fontSize: '14px',
                      }}
                    >
                      {league.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '15px' }}>{league.name}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => launchEditForm(league)}
                      aria-label={`Edit ${league.name}`}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${league.name}?`)) {
                          handleDeleteLeague(league.id);
                        }
                      }}
                      aria-label={`Delete ${league.name}`}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {manageSubMode === 'FORM' && (
        <div
          style={{
            border: '1px solid #dee2e6',
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 4px 6px -1px rgba(15, 23, 42, 0.08)',
          }}
        >
          <div
            style={{
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '12px', letterSpacing: '0.08em', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>
              {editingLeagueId ? 'Edit' : 'Create'}
            </div>
            <h3 style={{ textAlign: 'left', color: '#2f9e44', margin: '6px 0 0 0' }}>
              {editingLeagueId ? 'Modify League' : 'New Darts League'}
            </h3>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: '18px' }} onSubmit={handleSaveStructure}>
            <FormField label="League Name">
              <input
                type="text"
                value={leagueName}
                onChange={(event) => setLeagueName(event.target.value)}
                style={{
                  width: '95%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                }}
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
                    style={{
                      width: '90%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                    }}
                  />
                </FormField>
              </div>

              <div style={{ flex: 1 }}>
                <FormField label="Add Division" hint="Requires a season">
                  <input
                    type="text"
                    value={divisionName}
                    onChange={(event) => setDivisionName(event.target.value)}
                    style={{
                      width: '90%',
                      padding: '10px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '14px',
                    }}
                    disabled={!seasonName}
                  />
                </FormField>
              </div>
            </div>

            <button
              type="submit"
              style={{
                padding: '12px 14px',
                background: '#2f9e44',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '15px',
              }}
            >
              {editingLeagueId ? 'Save Changes' : 'Create League'}
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
            color: '#1e293b',
          }}
        >
          {statusMessage}
        </div>
      )}
    </div>
  );
}
