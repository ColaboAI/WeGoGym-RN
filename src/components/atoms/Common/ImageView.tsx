import {
  useWindowDimensions,
  ImageBackground,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import React from 'react';
import { Text, useTheme } from 'react-native-paper';

type Props = {
  imageUrl: string;
  idx: number;
  imgLength: number;
};

export default function ImageView({ imageUrl, idx, imgLength }: Props) {
  const theme = useTheme();
  const width = useWindowDimensions().width;
  // FIXME: image width
  const imageWidth = imgLength < 3 ? (width * 4) / 5 : width / 3;
  const [pressed, setPressed] = React.useState(false);
  const resizeMode = pressed === true ? 'contain' : 'cover';
  return (
    <Pressable
      style={styles.imageContainer}
      key={`img-view-${idx}`}
      onPress={() => setPressed(prev => !prev)}>
      <ImageBackground
        resizeMode={resizeMode}
        key={`img-${idx}`}
        source={{ uri: imageUrl }}
        alt={`img-${idx}`}
        style={[
          styles.image,
          {
            width: imageWidth,
            height: imageWidth,
          },
        ]}>
        <View
          style={[
            {
              backgroundColor: theme.colors.inverseSurface,
            },
            styles.countContainer,
          ]}>
          <Text
            style={[
              styles.countText,
              { color: theme.colors.inverseOnSurface },
            ]}>
            {idx + 1}/{imgLength}
          </Text>
        </View>
      </ImageBackground>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginRight: 10,
  },
  countText: {
    textAlign: 'right',
  },
  countContainer: {
    alignSelf: 'flex-end',
    borderRadius: 5,
    padding: 5,
    margin: 10,
  },
  image: {
    borderRadius: 20,
  },
});
