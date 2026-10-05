import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '@/constants/theme';

export function ScreenShell({
  children,
  scroll = true,
  bottomNav,
  refreshControl,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  bottomNav?: boolean;
  onNav?: (tab: any) => void;
  activeTab?: string;
  refreshControl?: React.ReactElement<any>;
}) {
  const insets = useSafeAreaInsets();
  const content = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16, paddingBottom: bottomNav ? 112 : insets.bottom + 32 }]}
      showsVerticalScrollIndicator={false}
      refreshControl={refreshControl}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fixedContent, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>{children}</View>
  );
  return (
    <View style={styles.screen}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  scrollContent: { paddingHorizontal: 20, gap: 20 },
  fixedContent: { flex: 1, paddingHorizontal: 20 },
});
