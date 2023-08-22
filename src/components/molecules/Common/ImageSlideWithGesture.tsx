import { StyleSheet } from 'react-native';
import React, { useCallback } from 'react';

import AnimateImageView from '/components/atoms/Common/AnimateImageView';
import Animated from 'react-native-reanimated';
import { Asset } from 'react-native-image-picker';

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

  return (
    <>
      <Animated.ScrollView
        style={styles.container}
        horizontal={true}
        contentContainerStyle={styles.contentContainer}
        showsHorizontalScrollIndicator={false}>
        {images.map((asset, index) => {
          if (!asset.uri) {
            return null;
          }
          return (
            <AnimateImageView
              imageUri={asset.uri}
              idx={index}
              key={`img-view-${index}`}
              imgLength={images.length}
              onPressDelete={onPressDelete}
            />
          );
        })}
      </Animated.ScrollView>
    </>
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
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: 'red',
  },
});
