import { StyleSheet, useWindowDimensions } from 'react-native';
import React from 'react';
import ImageView from '/components/atoms/Common/ImageView';
import { ScrollView } from 'react-native-gesture-handler';
type Props = {
  imageUrls: string[];
};

export default function ImageSlide({ imageUrls }: Props) {
  const { width, height } = useWindowDimensions();
  const imageWidth = (Math.min(width, height) * 3) / 4;
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      horizontal={true}
      pagingEnabled={true}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={imageWidth + 20}
      showsHorizontalScrollIndicator={false}>
      {imageUrls.map((imageUrl, index) => (
        <ImageView
          imageUrl={imageUrl}
          idx={index}
          key={`img-view-${index}`}
          imgLength={imageUrls.length}
          imageWidth={imageWidth}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    flex: 1,
    marginTop: '5%',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
});
