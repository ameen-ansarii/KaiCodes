import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Mascot } from '@/components/ui/Mascot';
import { Feather } from '@/components/ui/AppIcon';

export function UpdateBanner({
  downloading,
  updateReady,
  onReload,
}: {
  downloading: boolean;
  updateReady: boolean;
  onReload: () => void;
}) {
  if (!downloading && !updateReady) return null;

  return (
    <View style={styles.updateFloatingBanner}>
      <Mascot pose={updateReady ? 'accepted' : 'speedrun'} size={44} />
      <View style={{ flex: 1 }}>
        <Text style={styles.updateFloatingTitle}>
          {updateReady ? 'New Version Ready!' : 'Downloading Update...'}
        </Text>
        <Text style={styles.updateFloatingSub}>
          {updateReady
            ? 'Restart to load the latest features.'
            : 'Kai is fetching the latest problem set in background.'}
        </Text>
      </View>
      {updateReady ? (
        <Pressable onPress={onReload} style={styles.updateFloatingButton}>
          <Text style={styles.updateFloatingButtonText}>Restart</Text>
          <Feather name="refresh-cw" size={13} color="#FFFFFF" />
        </Pressable>
      ) : (
        <View style={styles.updateSpinnerPill}>
          <Text style={styles.updateSpinnerPillText}>Syncing</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  updateFloatingBanner: {
    position: 'absolute', left: 16, right: 16, bottom: 92, backgroundColor: '#1E1B4B',
    borderRadius: 20, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 2, borderColor: '#7C3AED', borderBottomWidth: 4, borderBottomColor: '#5B21B6',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10, zIndex: 999,
  },
  updateFloatingTitle: { color: '#FFFFFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 14 },
  updateFloatingSub: { color: '#DDD6FE', fontFamily: 'Inter_400Regular', fontSize: 11, lineHeight: 15, marginTop: 2 },
  updateFloatingButton: { backgroundColor: '#7C3AED', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 5, borderBottomWidth: 2.5, borderBottomColor: '#5B21B6' },
  updateFloatingButtonText: { color: '#FFFFFF', fontFamily: 'Nunito_800ExtraBold', fontSize: 12 },
  updateSpinnerPill: { backgroundColor: '#312E81', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  updateSpinnerPillText: { color: '#C4B5FD', fontFamily: 'Nunito_700Bold', fontSize: 11 },
});
