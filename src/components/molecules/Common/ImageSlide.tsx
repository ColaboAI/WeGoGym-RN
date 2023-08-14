import { StyleSheet } from 'react-native';
import React from 'react';
import ImageView from '/components/atoms/Common/ImageView';
import { ScrollView } from 'react-native-gesture-handler';
type Props = {
  imageUrls: string[];
};

export default function ImageSlide({ imageUrls }: Props) {
  return (
    <ScrollView
      style={styles.pagerView}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}>
      {imageUrls.map((imageUrl, index) => (
        <ImageView
          imageUrl={imageUrl}
          idx={index}
          key={`img-view-${index}`}
          imgLength={imageUrls.length}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    width: '100%',
    height: '100%',
    flex: 1,
    marginTop: '5%',
  },
});
