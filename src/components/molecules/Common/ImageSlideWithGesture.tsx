import { StyleSheet } from 'react-native';
import React, { useCallback } from 'react';

import AnimateImageView from '/components/atoms/Common/AnimateImageView';
import { Asset } from 'react-native-image-picker';

import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';

type Props = {
  images: Asset[];
  setImages: (urls: Asset[]) => void;
};

export default function ImageSlideWithGesture({ images, setImages }: Props) {
  const onPressDelete = useCallback(
    (idx: number) => {
      const newUrls = images.filter((_, index) => index !== idx);
      setImages([...newUrls]);
    },
    [images, setImages],
  );

  const renderItem = ({ item, drag, getIndex }: RenderItemParams<Asset>) => {
    return (
      <ScaleDecorator activeScale={0.9}>
        <AnimateImageView
          imageUri={item.uri || ''}
          imgLength={images.length}
          onPressDelete={onPressDelete}
          onDrag={drag}
          idx={getIndex() || 0}
        />
      </ScaleDecorator>
    );
  };

  return (
    <DraggableFlatList
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={true}
      data={images}
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
      keyExtractor={(_, index) => `draggable-item-${index}`}
      onDragEnd={({ data }) => setImages(data)}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    marginTop: '5%',
  },
  contentContainer: {
    paddingHorizontal: 12,
  },
});
