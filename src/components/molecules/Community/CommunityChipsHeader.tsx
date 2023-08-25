import { StyleSheet, View } from 'react-native';
import React, { Suspense, useCallback } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useGetCommunityListQuery } from '/hooks/queries/community.queries';
import {
  ActivityIndicator,
  Button,
  Chip,
  Text,
  useTheme,
} from 'react-native-paper';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
type Props = {
  selected?: Community;
  setSelected: (c: Community) => void;
};

const CommunityChipsHeader = (props: Props) => {
  const theme = useTheme();
  const q = useGetCommunityListQuery();
  const { reset } = useQueryErrorResetBoundary();

  const renderError = useCallback(
    ({ error, resetErrorBoundary }: FallbackProps) => {
      return (
        <View style={styles.errorContainer}>
          <Text>커뮤니티 목록을 불러올 수 없습니다.</Text>
          <Text>{error.message}</Text>
          <Button onPress={() => resetErrorBoundary()}>다시 시도</Button>
        </View>
      );
    },
    [],
  );

  return (
    <Suspense fallback={<ActivityIndicator />}>
      <ErrorBoundary
        onReset={reset}
        fallbackRender={p => renderError({ ...p })}>
        <ScrollView horizontal contentContainerStyle={styles.container}>
          {q.data &&
            q.data.map((community, idx) => (
              <Chip
                key={`community-chip-${idx}`}
                mode="flat"
                style={[styles.chip]}
                selected={community.id === props.selected?.id}
                showSelectedCheck={false}
                showSelectedOverlay={true}
                selectedColor={theme.colors.tertiaryContainer}
                onPress={() => props.setSelected(community)}>
                <Text>{community.name}</Text>
              </Chip>
            ))}
        </ScrollView>
      </ErrorBoundary>
    </Suspense>
  );
};

export default CommunityChipsHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chip: {
    margin: 5,
  },
});
