export function DashboardHeader({ title, onHomeClick, onSignOut }) {
  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#1a1a2e',
        color: '#fff',
        borderRadius: '8px',
        marginBottom: '30px',
      }}
    >
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        onClick={onHomeClick}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onHomeClick();
          }
        }}
      >
        <span style={{ fontSize: '24px' }}>🎯</span>
        <h2 style={{ margin: 0, fontSize: '20px' }}>{title}</h2>
      </div>

      <button
        onClick={onSignOut}
        style={{
          padding: '6px 12px',
          background: '#e03131',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        Sign Out
      </button>
    </header>
  );
}

export function ActionTile({ title, actionLabel, onClick, variant = 'dark' }) {
  const styles = {
    dark: {
      background: '#1a1a2e',
      color: '#ffffff',
    },
    success: {
      background: '#2f9e44',
      color: '#ffffff',
    },
    neutral: {
      background: '#64748b',
      color: '#ffffff',
    },
  };

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '25px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      <button
        onClick={onClick}
        style={{
          width: '100%',
          padding: '10px',
          background: styles[variant].background,
          color: styles[variant].color,
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: 'auto',
          fontWeight: 'bold',
        }}
      >
        {actionLabel}
      </button>
    </div>
  );
}
