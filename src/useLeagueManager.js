import { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://a5w71ssf44.execute-api.eu-north-1.amazonaws.com';

export function useLeagueManager(user) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('HOME');
  const [leaguesList, setLeaguesList] = useState([]);
  const [manageSubMode, setManageSubMode] = useState('LIST');
  const [editingLeagueId, setEditingLeagueId] = useState(null);
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
        console.error("Authorization check failed", error);
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
      setLeaguesList([]);
    }
  };

  const handleDeleteLeague = async (idToWipe) => {
    setStatusMessage('Removing record...');
    try {
      await axios.delete(`${API_URL}/structure`, { params: { leagueId: idToWipe } });
      setStatusMessage('🗑️ League record successfully erased.');
      await loadExistingLeagues();
    } catch (error) {
      setStatusMessage(`❌ Wipe failure: ${error.message}`);
    }
  };

  const handleSaveStructure = async (e) => {
    e.preventDefault();
    setStatusMessage('Syncing configurations...');
    try {
      const isEdit = !!editingLeagueId;
      const randomId = () => Math.random().toString(36).substring(2, 10);
      const targetLeagueId = isEdit ? editingLeagueId : `L-${randomId()}`;

      await axios.post(`${API_URL}/structure`, {
        action: isEdit ? 'EDIT_LEAGUE' : 'CREATE_LEAGUE',
        leagueId: targetLeagueId,
        leagueName: leagueName
      });

      if (seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_SEASON',
          leagueId: targetLeagueId,
          seasonId: `S-${randomId()}`,
          seasonName: seasonName
        });
      }

      if (divisionName && seasonName) {
        await axios.post(`${API_URL}/structure`, {
          action: 'CREATE_DIVISION',
          leagueId: targetLeagueId,
          seasonId: `S-${randomId()}`,
          divisionId: `D-${randomId()}`,
          divisionName: divisionName
        });
      }

      setStatusMessage('🎯 Structural sync finalized!');
      setLeagueName(''); setSeasonName(''); setDivisionName('');
      await loadExistingLeagues();
      setManageSubMode('LIST');
    } catch (error) {
      setStatusMessage(`❌ Failure: ${error.message}`);
    }
  };

  return {
    isAdmin, loading, currentView, setCurrentView, leaguesList, manageSubMode, setManageSubMode,
    editingLeagueId, setEditingLeagueId, leagueName, setLeagueName, seasonName, setSeasonName,
    divisionName, setDivisionName, statusMessage, setStatusMessage, handleDeleteLeague, handleSaveStructure,
    loadExistingLeagues
  };
}
