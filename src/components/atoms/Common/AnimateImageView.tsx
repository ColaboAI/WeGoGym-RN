import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import React, { useState } from 'react';

import Animated, {
  BounceIn,
  Layout,
  StretchOutY,
} from 'react-native-reanimated';
import { IconButton, useTheme } from 'react-native-paper';

type Props = {
  imageUri: string;
  idx: number;
  imgLength: number;
  onPressDelete: (id: number) => void;
};

const AnimateImageView = ({
  imageUri,
  idx,
  imgLength,
  onPressDelete,
}: Props) => {
  const theme = useTheme();
  const [touched, setTouched] = useState(false);

  const width = useWindowDimensions().width;
  // FIXME: image width
  const imageWidth = width / 2;
  const resizeMode = touched === true ? 'contain' : 'cover';
  const marginRight = imgLength === idx + 1 ? 0 : 12;
  return (
    <View style={{ marginRight: marginRight }}>
      <Pressable
        onPress={() => {
          setTouched(prev => !prev);
        }}>
        <Animated.Image
          resizeMode={resizeMode}
          entering={BounceIn}
          exiting={StretchOutY}
          layout={Layout.springify()}
          source={{ uri: imageUri }}
          style={[
            styles.image,
            {
              width: imageWidth,
              height: imageWidth,
            },
          ]}
        />
      </Pressable>
      <IconButton
        style={styles.icon}
        iconColor={theme.colors.inverseOnSurface}
        containerColor={theme.colors.inverseSurface}
        icon="close-sharp"
        size={16}
        onPress={() => onPressDelete(idx)}
      />
    </View>
  );
};

export default AnimateImageView;

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
  },
  image: {
    borderRadius: 20,
  },

  icon: {
    position: 'absolute',
    top: 0,
    right: 0,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    margin: 0,
  },
});
