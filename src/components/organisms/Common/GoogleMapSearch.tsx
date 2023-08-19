import { StyleSheet } from 'react-native';
import React, { useCallback, useEffect } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import { useTheme } from 'react-native-paper';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import GoogleMap from '/components/molecules/Common/GoogleMap';

type Props = {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  gymInfo: Gym | null;
  setGymInfo: React.Dispatch<React.SetStateAction<Gym | null>>;
};

const GoogleMapSearch = (props: Props) => {
  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['70%', '100%'], []);

  const renderBackdrop = useCallback(
    (
      backdropProps: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
    ) => (
      <BottomSheetBackdrop
        {...backdropProps}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.1}
      />
    ),
    [],
  );

  const onOpenBottomSheet = useCallback(async () => {
    bottomSheetRef.current?.expand();
  }, []);

  useEffect(() => {
    if (props.isBottomSheetOpen) {
      onOpenBottomSheet();
    }
  }, [props.isBottomSheetOpen, onOpenBottomSheet]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleStyle={{ backgroundColor: theme.colors.background }}
      backgroundStyle={{ backgroundColor: theme.colors.background }}
      enablePanDownToClose={true}
      onClose={() => {
        props.setIsBottomSheetOpen(false);
      }}>
      <BottomSheetView style={styles.container}>
        <GoogleMap />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default GoogleMapSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
  textInput: {
    alignSelf: 'stretch',
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    color: 'gray',
    textAlign: 'left',
  },
  itemContainer: {
    flex: 1,
    width: '100%',
    marginHorizontal: 4,
    marginVertical: 8,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  chip: {
    alignItems: 'center',
    marginRight: 4,
    width: 75,
    height: 30,
  },
});
