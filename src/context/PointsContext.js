import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchUserStatus } from '../services/api';

const PointsContext = createContext(null);

export function PointsProvider({ children, authToken }) {
  const [points, setPoints] = useState(0);
  const [adsWatchedToday, setAdsWatchedToday] = useState(0);
  const [loading, setLoading] = useState(false);

  // Always resync from server — never rely on optimistic local state alone
  // for anything that touches money.
  const refreshStatus = useCallback(async () => {
    setLoading(true);
    try {
      const status = await fetchUserStatus(authToken);
      setPoints(status.points);
      setAdsWatchedToday(status.adsWatchedToday);
    } catch (err) {
      console.warn('Failed to refresh user status:', err);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  return (
    <PointsContext.Provider
      value={{ points, adsWatchedToday, loading, refreshStatus, setPoints, setAdsWatchedToday }}
    >
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within a PointsProvider');
  return ctx;
}
