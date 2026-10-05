import { useState, useEffect, useCallback } from 'react';
import * as Updates from 'expo-updates';
import * as Haptics from 'expo-haptics';

export function useAppUpdates() {
  const [checking, setChecking] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateReady, setUpdateReady] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      await Updates.reloadAsync();
    } catch (err) {
      console.warn('App reload failed:', err);
    }
  }, []);

  const check = useCallback(async () => {
    if (!Updates.isEnabled) return;
    try {
      setChecking(true);
      const result = await Updates.checkForUpdateAsync();
      if (result.isAvailable) {
        setUpdateAvailable(true);
        setStatusMessage('Update found! Downloading...');
        setDownloading(true);
        await Updates.fetchUpdateAsync();
        setDownloading(false);
        setUpdateReady(true);
        setStatusMessage('Update ready — will apply on next launch ✓');
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        // Do NOT auto-reload. The update applies on next cold launch.
        // This prevents crashing users mid-session.
      } else {
        setStatusMessage(null);
      }
    } catch (err: any) {
      console.warn('Update check failed:', err);
      setStatusMessage(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!Updates.isEnabled) return;
    // Delay check so app fully renders before doing any network work
    const timer = setTimeout(() => { void check(); }, 5000);
    return () => clearTimeout(timer);
  }, [check]);

  return {
    checking,
    downloading,
    updateAvailable,
    updateReady,
    statusMessage,
    check,
    reload,
    updateId: Updates.updateId || null,
    channel: Updates.channel || null,
    isEmbedded: Updates.isEmbeddedLaunch || false,
  };
}
