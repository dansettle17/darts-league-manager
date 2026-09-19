import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useLeagueManager } from './useLeagueManager';
import ManageLeagues from './ManageLeagues';
import { DashboardHeader, ActionTile } from './components/SharedUI';

function HomeDashboard({ isAdmin, onManageLeagues }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1>League Workspace</h1>
        <p style={{ color: '#64748b' }}>Select an option below to interact with your darts portal.</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
        }}
      >
        <ActionTile title="View Standings" actionLabel="Open Leaderboards" onClick={() => {}} />
        <ActionTile title="Match Results" actionLabel="View Game Log" onClick={() => {}} />

        {isAdmin && (
          <ActionTile
            title="Manage Leagues"
            actionLabel="Configure Structure →"
            onClick={onManageLeagues}
            variant="success"
          />
        )}
      </div>
    </div>
  );
}

function MainDashboard({ signOut, user }) {
  const m = useLeagueManager(user);

  if (m.loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <DashboardHeader
        title="Darts League Central"
        onHomeClick={() => m.setCurrentView('HOME')}
        onSignOut={signOut}
      />

      {m.currentView === 'HOME' && (
        <HomeDashboard
          isAdmin={m.isAdmin}
          onManageLeagues={() => {
            m.setManageSubMode('LIST');
            m.setCurrentView('MANAGE_LEAGUES');
          }}
        />
      )}

      {m.currentView === 'MANAGE_LEAGUES' && (
        <ManageLeagues
          setCurrentView={m.setCurrentView}
          leaguesList={m.leaguesList}
          manageSubMode={m.manageSubMode}
          setManageSubMode={m.setManageSubMode}
          editingLeagueId={m.editingLeagueId}
          setEditingLeagueId={m.setEditingLeagueId}
          leagueName={m.leagueName}
          setLeagueName={m.setLeagueName}
          seasonName={m.seasonName}
          setSeasonName={m.setSeasonName}
          divisionName={m.divisionName}
          setDivisionName={m.setDivisionName}
          statusMessage={m.statusMessage}
          setStatusMessage={m.setStatusMessage}
          handleSaveStructure={m.handleSaveStructure}
          handleDeleteLeague={m.handleDeleteLeague}
        />
      )}
    </div>
  );
}

export default function App() {
  return <Authenticator>{({ signOut, user }) => <MainDashboard signOut={signOut} user={user} />}</Authenticator>;
}
