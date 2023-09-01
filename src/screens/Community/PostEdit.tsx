import { StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import React, { useCallback, useMemo, useState } from 'react';
import { CommunityStackScreenProps } from '/navigators/types';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageSlideWithGesture from '/components/molecules/Common/ImageSlideWithGesture';
import {
  usePostQuery,
  usePostUpdateMutation,
} from '/hooks/queries/post.queries';

type PostEditScreenProps = CommunityStackScreenProps<'PostEdit'>;

export default function PostUpdate({ route }: PostEditScreenProps) {
  const theme = useTheme();
  const { postId } = route.params;
  const { data: post } = usePostQuery(postId);
  const imageFromServer = useMemo(() => {
    return (
      post?.image?.map(
        (image, index) =>
          ({
            uri: image,
            order: index,
          } as ImageType),
      ) ?? []
    );
  }, [post?.image]);

  const [form, setForm] = useState({
    title: post?.title ?? '',
    content: post?.content ?? '',
    imageList: [] as ImageType[],
  });

  const [selectedAssets, setSelectedAssets] =
    useState<ImageType[]>(imageFromServer);

  const [focuses, setFocuses] = useState({
    title: false,
    content: false,
  });

  const hasTitleErrors = useCallback(() => {
    return (focuses.title && form.title.length < 1) || form.title.length >= 100;
  }, [focuses.title, form.title]);

  const hasContentErrors = useCallback(() => {
    return (
      (focuses.content && form.content.length < 1) ||
      form.content.length >= 1000
    );
  }, [focuses.content, form.content]);

  const handleImagePicker = useCallback(() => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 10,
      quality: 0.5,
    };
    launchImageLibrary(options, response => {
      if (response.errorCode) {
        throw new Error('ImagePicker Error: ${}' + response.errorMessage);
      } else {
        const assets = response.assets?.filter(
          asset => asset.fileSize !== 0,
        ) as ImageType[];
        setSelectedAssets(prev => [...prev, ...assets]);
      }
    });
  }, []);

  const calcFileSize = useCallback(() => {
    let size = 0;
    selectedAssets.forEach(asset => {
      if (asset.fileSize) {
        size += asset.fileSize;
      }
    });
    return size;
  }, [selectedAssets]);

  const hasImageErrors = useCallback(() => {
    return calcFileSize() > 30 * 1024 * 1024;
  }, [calcFileSize]);

  const { mutate: updatePost, isLoading } = usePostUpdateMutation();

  const getSelectedServerImages = useCallback(() => {
    let imageList: ImageType[] = [];
    selectedAssets.forEach((asset, index) => {
      if (asset.uri && !asset.fileName && !asset.type && !asset.fileSize) {
        imageList.push({ uri: asset.uri, order: index });
      }
    });
    return imageList;
  }, [selectedAssets]);

  const makeFormData = useCallback(() => {
    const formData = new FormData();
    selectedAssets.forEach((asset, index) => {
      if (!asset.uri || !asset.fileName || !asset.type || !asset.fileSize) {
        return;
      }
      formData.append('images', {
        uri: asset.uri,
        name: `${asset.fileName}_${index}`,
        type: asset.type,
        size: asset.fileSize,
      });
    });
    return formData;
  }, [selectedAssets]);

  const handleUpdatePost = useCallback(() => {
    updatePost({
      postId: postId,
      params: {
        title: form.title,
        content: form.content,
        imageList: getSelectedServerImages(),
      },
      images: makeFormData(),
    });
  }, [
    updatePost,
    postId,
    form.title,
    form.content,
    getSelectedServerImages,
    makeFormData,
  ]);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
        automaticallyAdjustContentInsets={false}
        automaticallyAdjustKeyboardInsets={true}
        contentInsetAdjustmentBehavior="never">
        <View style={styles.textInputContainer}>
          <Text variant="titleMedium">제목</Text>
          <TextInput
            mode="outlined"
            placeholder="게시글 제목을 입력하세요."
            error={hasTitleErrors()}
            value={form.title}
            onFocus={() => setFocuses(prev => ({ ...prev, title: true }))}
            onChangeText={value => setForm(prev => ({ ...prev, title: value }))}
          />
        </View>
        <HelperText type="error" visible={hasTitleErrors()}>
          ⚠️ 게시글 제목은 1자 이상 100자 이하여야 합니다.
        </HelperText>
        <View style={styles.textInputContainer}>
          <Text variant="titleMedium">내용</Text>
          <TextInput
            mode="outlined"
            placeholder="게시글 내용을 입력해주세요. 건전한 위고짐 커뮤니티 문화를 위해 욕설, 비방, 도배 등의 글은 자제해주세요. 위반 시 게시글이 삭제될 수 있습니다."
            multiline={true}
            error={hasContentErrors()}
            value={form.content}
            onFocus={() => setFocuses(prev => ({ ...prev, content: true }))}
            onChangeText={value =>
              setForm(prev => ({ ...prev, content: value }))
            }
          />
        </View>
        <HelperText type="error" visible={hasContentErrors()}>
          ⚠️ 게시글 내용은 1자 이상 1000자 이하여야 합니다.
        </HelperText>
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Icon
              name={'image-sharp'}
              color={theme.colors.primary}
              size={20}
              style={styles.icon}
            />
            <Text variant="titleMedium">사진</Text>
          </View>
          <Button onPress={handleImagePicker}>추가하기</Button>
        </View>
        {selectedAssets.length > 0 && (
          <ImageSlideWithGesture
            images={selectedAssets}
            setImages={setSelectedAssets}
          />
        )}
        <HelperText type="error" visible={hasImageErrors()}>
          ⚠️ 전체 이미지 용량이 30MB를 초과할 수 없습니다. 현재 용량:
          {(calcFileSize() / 1024 / 1024).toPrecision(2)} MB
        </HelperText>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          loading={isLoading}
          disabled={hasTitleErrors() || hasContentErrors() || hasImageErrors()}
          onPress={() => {
            handleUpdatePost();
          }}>
          수정하기
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyItems: 'space-between',
  },
  contentContainer: {
    justifyContent: 'space-between',
  },
  textInputContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  icon: {
    marginRight: 6,
  },
  button: {
    borderRadius: 0,
  },
  buttonContainer: {
    marginBottom: 12,
  },
});
