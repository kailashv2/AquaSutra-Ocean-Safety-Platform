import React, { createContext, useState, useEffect, useCallback } from 'react';
import { openDB } from 'idb';

// Create context
export const OfflineContext = createContext();

// Database setup
const setupDB = async () => {
  return openDB('aquasutra-offline', 1, {
    upgrade(db) {
      // Create object stores for offline data
      if (!db.objectStoreNames.contains('reports')) {
        const reportsStore = db.createObjectStore('reports', { keyPath: 'id' });
        reportsStore.createIndex('timestamp', 'timestamp');
        reportsStore.createIndex('hazardType', 'hazardType');
      }
      
      if (!db.objectStoreNames.contains('pendingReports')) {
        db.createObjectStore('pendingReports', { keyPath: 'localId' });
      }
      
      if (!db.objectStoreNames.contains('socialPosts')) {
        const socialStore = db.createObjectStore('socialPosts', { keyPath: 'id' });
        socialStore.createIndex('timestamp', 'timestamp');
        socialStore.createIndex('hazardType', 'hazardType');
      }
      
      if (!db.objectStoreNames.contains('analytics')) {
        db.createObjectStore('analytics', { keyPath: 'id' });
      }
    }
  });
};

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [db, setDb] = useState(null);
  const [pendingReports, setPendingReports] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize IndexedDB
  useEffect(() => {
    const initDB = async () => {
      const database = await setupDB();
      setDb(database);
      
      // Load pending reports
      if (database) {
        const pendingItems = await database.getAll('pendingReports');
        setPendingReports(pendingItems);
      }
    };
    
    initDB();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncPendingReports();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [db]);

  // Save data to IndexedDB
  const saveOfflineData = useCallback(async (storeName, data) => {
    if (!db) return false;
    
    try {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      
      if (Array.isArray(data)) {
        for (const item of data) {
          await store.put(item);
        }
      } else {
        await store.put(data);
      }
      
      await tx.done;
      return true;
    } catch (error) {
      console.error(`Error saving offline data to ${storeName}:`, error);
      return false;
    }
  }, [db]);

  // Get data from IndexedDB
  const getOfflineData = useCallback(async (storeName, query = null) => {
    if (!db) return [];
    
    try {
      if (query) {
        // Handle specific queries
        const { index, value, direction = 'next' } = query;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        
        if (index && value) {
          const idx = store.index(index);
          return await idx.getAll(value);
        } else {
          return await store.getAll();
        }
      } else {
        // Get all data
        return await db.getAll(storeName);
      }
    } catch (error) {
      console.error(`Error getting offline data from ${storeName}:`, error);
      return [];
    }
  }, [db]);

  // Save a report for offline submission
  const saveReportOffline = useCallback(async (report) => {
    if (!db) return null;
    
    try {
      const localId = `local_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const reportWithId = {
        ...report,
        localId,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      await db.add('pendingReports', reportWithId);
      
      // Update state
      setPendingReports(prev => [...prev, reportWithId]);
      
      return localId;
    } catch (error) {
      console.error('Error saving report offline:', error);
      return null;
    }
  }, [db]);

  // Sync pending reports when online
  const syncPendingReports = useCallback(async () => {
    if (!db || !isOnline || isSyncing || pendingReports.length === 0) return;
    
    setIsSyncing(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setIsSyncing(false);
        return;
      }
      
      const successfulIds = [];
      
      for (const report of pendingReports) {
        try {
          const response = await fetch('/api/reports', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              hazardType: report.hazardType,
              location: report.location,
              note: report.note,
              mediaBase64: report.mediaBase64
            })
          });
          
          if (response.ok) {
            successfulIds.push(report.localId);
          }
        } catch (error) {
          console.error(`Error syncing report ${report.localId}:`, error);
        }
      }
      
      // Remove synced reports
      if (successfulIds.length > 0) {
        const tx = db.transaction('pendingReports', 'readwrite');
        const store = tx.objectStore('pendingReports');
        
        for (const id of successfulIds) {
          await store.delete(id);
        }
        
        await tx.done;
        
        // Update state
        setPendingReports(prev => prev.filter(report => !successfulIds.includes(report.localId)));
      }
    } catch (error) {
      console.error('Error syncing pending reports:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [db, isOnline, isSyncing, pendingReports]);

  // Clear all offline data (for logout)
  const clearOfflineData = useCallback(async () => {
    if (!db) return;
    
    try {
      const stores = ['reports', 'pendingReports', 'socialPosts', 'analytics'];
      
      for (const storeName of stores) {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        await store.clear();
        await tx.done;
      }
      
      setPendingReports([]);
    } catch (error) {
      console.error('Error clearing offline data:', error);
    }
  }, [db]);

  // Context value
  const value = {
    isOnline,
    pendingReports,
    isSyncing,
    saveOfflineData,
    getOfflineData,
    saveReportOffline,
    syncPendingReports,
    clearOfflineData
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
};