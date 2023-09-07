import { StyleSheet, View, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';

type Props = {
  imageUrl: string;
  idx: number;
  imgLength: number;
  imageWidth: number;
};

export default function ImageView({
  imageUrl,
  idx,
  imgLength,
  imageWidth,
}: Props) {
  const theme = useTheme();
  // FIXME: image width
  const [pressed, setPressed] = React.useState(false);
  const resizeMode = pressed === true ? 'contain' : 'cover';
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const zoomGesture = Gesture.Pinch()
    .onUpdate(e => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      savedScale.value = withSpring(1);
      scale.value = withSpring(1);
    });

  const dragGesture = Gesture.Pan()
    .minPointers(2)
    .onUpdate(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: scale.value,
      },
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));

  const composedGesture = Gesture.Simultaneous(zoomGesture, dragGesture);
  const [loading, setLoading] = useState(true);
  return (
    <Pressable
      style={styles.imageContainer}
      key={`img-view-${idx}`}
      onPress={() => setPressed(prev => !prev)}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={animatedStyle}>
          <FastImage
            onLoadEnd={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
            resizeMode={resizeMode}
            key={`img-${idx}`}
            source={{ uri: imageUrl }}
            style={[
              styles.image,
              {
                width: imageWidth,
                height: imageWidth,
              },
            ]}>
            {loading ? (
              <View style={styles.indicator}>
                <ActivityIndicator animating={loading} size="large" />
              </View>
            ) : (
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
            )}
          </FastImage>
        </Animated.View>
      </GestureDetector>
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
    marginHorizontal: 10,
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
  indicator: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
  },
});
