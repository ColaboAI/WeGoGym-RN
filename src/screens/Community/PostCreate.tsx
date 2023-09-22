import { StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Switch,
  Text,
  TextInput,
  useTheme,
  IconButton,
} from 'react-native-paper';
import React, { useCallback, useState } from 'react';
import { CommunityStackScreenProps } from '/navigators/types';
import { ScrollView } from 'react-native-gesture-handler';
import {
  ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageSlideWithGesture from '/components/molecules/Common/ImageSlideWithGesture';
import CommunityChips from '../../components/molecules/Community/CommunityChips';
import { usePostMutation } from '/hooks/queries/post.queries';
import CustomTooltip from '/components/molecules/Common/CustomTooltip';

type PostCreateScreenProps = CommunityStackScreenProps<'PostCreate'>;

export default function PostCreate({}: PostCreateScreenProps) {
  const theme = useTheme();
  const [form, setForm] = useState({
    title: '',
    content: '',
    wantAiCoach: false,
  });

  const [selectedAssets, setSelectedAssets] = useState<ImageType[]>([]);
  const [focuses, setFocuses] = useState({
    title: false,
    content: false,
  });

  const [selectedCommunity, setSelectedCommunity] = useState<Community>();

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
        setSelectedAssets([...assets]);
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

  const hasCommunityErrors = useCallback(() => {
    return selectedCommunity === undefined;
  }, [selectedCommunity]);

  const { mutate: createPost, isLoading } = usePostMutation();
  const makeFormData = useCallback(() => {
    const formData = new FormData();
    selectedAssets.forEach(asset => {
      formData.append('images', {
        uri: asset.uri,
        name: asset.fileName,
        type: asset.type,
      });
    });
    return formData;
  }, [selectedAssets]);

  const handleCreatePost = useCallback(() => {
    if (selectedCommunity) {
      createPost({
        params: {
          communityId: selectedCommunity.id,
          title: form.title,
          content: form.content,
          wantAiCoach: form.wantAiCoach,
        },
        images: makeFormData(),
      });
    }
  }, [
    createPost,
    form.content,
    form.title,
    form.wantAiCoach,
    selectedCommunity,
    makeFormData,
  ]);

  const [visible, setVisible] = useState(false);

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
          <Text variant="titleMedium">커뮤니티</Text>
          <CommunityChips
            selected={selectedCommunity}
            setSelected={setSelectedCommunity}
          />
        </View>
        <HelperText type="error" visible={hasCommunityErrors()}>
          ⚠️ 커뮤니티를 선택해주세요.
        </HelperText>

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
        {/* TODO: Video url input */}
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Icon
              name={form.wantAiCoach ? 'bulb-sharp' : 'bulb-outline'}
              color={theme.colors.primary}
              size={20}
              style={styles.icon}
            />
            <Text variant="titleMedium">AI 코칭</Text>
            <IconButton
              icon="help-circle-outline"
              selected
              size={20}
              onPress={() => setVisible(true)}
            />
          </View>
          <Switch
            value={form.wantAiCoach}
            onValueChange={() => {
              setForm(prev => ({ ...prev, wantAiCoach: !prev.wantAiCoach }));
            }}
          />
        </View>
        <View style={{ height: visible ? 'auto' : 100 }}>
          {visible ? (
            <CustomTooltip
              title="AI 코칭 서비스"
              description="위고짐에서 제공하는 AI 코칭 서비스로, 작성한 게시글의 내용을 분석하여 운동, 식단 등에 대한 상세한 피드백을 제공합니다."
              setVisible={setVisible}
            />
          ) : null}
        </View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          loading={isLoading}
          disabled={
            hasTitleErrors() ||
            hasContentErrors() ||
            hasImageErrors() ||
            hasCommunityErrors()
          }
          onPress={() => {
            handleCreatePost();
          }}>
          게시하기
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
    paddingBottom: '10%',
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
