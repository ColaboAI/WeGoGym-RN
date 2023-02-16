import { StyleSheet, View } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetTextInput,
  BottomSheetView,
  TouchableOpacity,
} from '@gorhom/bottom-sheet';
import GymInfoLoader from '/components/molecules/Home/GymInfoLoader';
import { Chip, Text, useTheme } from 'react-native-paper';
import { getGymInfoFromApi } from '/utils/util';
import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

type Props = {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setMyInfoState: React.Dispatch<React.SetStateAction<MyInfoRead>>;
};
const GymBottomSheet = (props: Props) => {
  const theme = useTheme();

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [gymData, setGymData] = useState<Gym[] | null>(null);
  const [filteredGymData, setFilteredGymData] = useState<Gym[] | null>(null);

  const snapPoints = React.useMemo(() => ['70%', '90%'], []);
  const renderBackdrop = useCallback(
    (
      backdropProps: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps,
    ) => (
      <BottomSheetBackdrop
        {...backdropProps}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
      />
    ),
    [],
  );

  const getData = async () => {
    const apiData = await getGymInfoFromApi();
    return apiData;
  };

  const onOpenBottomSheet = useCallback(async () => {
    bottomSheetRef.current?.expand();
    if (!gymData) {
      const res = await getData();
      setGymData(res);
    }
  }, [gymData]);

  useEffect(() => {
    if (props.isBottomSheetOpen) {
      onOpenBottomSheet();
    }
  }, [props.isBottomSheetOpen, onOpenBottomSheet]);

  const renderItem = useCallback(
    ({ item }: { item: Gym }) => (
      <TouchableOpacity
        onPress={() => {
          props.setMyInfoState(prevState => ({
            ...prevState,
            gymInfo: item,
          }));
          props.setIsBottomSheetOpen(false);
          bottomSheetRef.current?.close();
        }}>
        <View style={styles.itemContainer}>
          <View style={styles.item}>
            <Text variant="titleMedium">{item.name}</Text>
          </View>
          <View style={styles.item}>
            <Chip style={styles.chip} textStyle={{ fontSize: 10 }}>
              도로명
            </Chip>
            <View style={styles.container}>
              <Text variant="bodySmall" numberOfLines={1} ellipsizeMode="tail">
                {item.address}
              </Text>
            </View>
          </View>
          <View style={styles.item}>
            <Chip style={styles.chip} textStyle={{ fontSize: 10 }}>
              우편번호
            </Chip>
            <Text variant="bodySmall">{item.zipCode}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [props],
  );

  const onSubmitEditing = useCallback(() => {
    if (searchText.length > 0 && gymData) {
      const res = gymData.filter(item => {
        return item.name.includes(searchText);
      });
      setFilteredGymData(res);
    }
  }, [gymData, searchText, setFilteredGymData]);

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
      }}
      android_keyboardInputMode={'adjustResize'}>
      <BottomSheetView>
        <BottomSheetTextInput
          value={searchText}
          placeholder="주변 헬스장을 검색하세요."
          onChangeText={value => setSearchText(value)}
          onSubmitEditing={onSubmitEditing}
          returnKeyType="search"
          style={[
            styles.textInput,
            {
              backgroundColor: theme.colors.secondaryContainer,
              color: theme.colors.onBackground,
            },
          ]}
        />
      </BottomSheetView>
      {filteredGymData !== null ? (
        <BottomSheetFlatList
          data={filteredGymData}
          keyExtractor={(item: Gym) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          disableVirtualization={false}
          contentContainerStyle={styles.contentContainer}
        />
      ) : (
        <GymInfoLoader />
      )}
    </BottomSheet>
  );
};

export default GymBottomSheet;

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
