import React, { useLayoutEffect, useMemo } from 'react';
import { Appbar, useTheme } from 'react-native-paper';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { Route } from '@react-navigation/native';
import { CommunityParamList } from '../types';
import { StyleSheet } from 'react-native';
type Props = NativeStackHeaderProps & {
  route: Route<string, CommunityParamList | undefined>;
};

const CustomNavBarHeader = ({ navigation, back, route }: Props) => {
  const [newBack, setNewBack] = React.useState(back);
  const headerTitle = useMemo(() => {
    const routeName = route.name;
    switch (routeName) {
      case 'PostList':
        return '커뮤니티';
      case 'PostDetail':
        // FIXME: 커뮤니티 이름을 표기해야 함
        return '게시물';
      case 'PostCreate':
        return '글쓰기';
      case 'PostEdit':
        return '글 수정';
      default:
        return '';
    }
  }, [route]);

  useLayoutEffect(() => {
    if (
      route.name === 'PostDetail' &&
      back === undefined &&
      navigation.canGoBack() === true
    ) {
      setNewBack({ title: 'PostList' });
      navigation.reset({
        index: 1,
        routes: [{ name: 'PostList' }, { name: 'PostDetail' }],
      });
    }
  }, [back, navigation, route]);
  return (
    <Appbar.Header>
      {newBack ? (
        <Appbar.BackAction onPress={() => navigation.goBack()} />
      ) : null}
      <Appbar.Content title={headerTitle} titleStyle={styles.title} />
    </Appbar.Header>
  );
};

export default CustomNavBarHeader;

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
