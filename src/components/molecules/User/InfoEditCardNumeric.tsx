import { StyleSheet, View } from 'react-native';
import React from 'react';
import { Surface, Text, TextInput } from 'react-native-paper';

type Props = {
  textContent: number;
  textTitle: string;
  contentColor: string;
  unit?: string;
  setMyInfoState: React.Dispatch<React.SetStateAction<MyInfoRead>>;
};

function InfoEditCardNumeric(props: Props) {
  const textContentStyle = {
    color: props.contentColor,
    marginBottom: 5,
  };
  const [text, setText] = React.useState(props.textContent.toString());
  const numericTitleList = ['height', 'weight', 'age', 'workoutPerWeek'];
  const numericTitleKorList = ['키', '몸무게', '나이(만)', '운동 횟수/주'];

  const numericTitleListIndex = numericTitleList.indexOf(props.textTitle);
  return (
    <View style={styles.surfaceContainer}>
      <Surface elevation={1} style={styles.surface}>
        <Text variant="labelLarge">
          {numericTitleKorList[numericTitleListIndex]}
        </Text>
        <View style={styles.textInputGroup}>
          <TextInput
            value={text}
            mode="outlined"
            onChangeText={t => setText(t)}
            onEndEditing={() => {
              props.setMyInfoState(prevState => ({
                ...prevState,
                [props.textTitle]: parseInt(text, 10),
              }));
            }}
            blurOnSubmit={true}
            style={textContentStyle}
            keyboardType={'numeric'}
            disabled={props.textTitle === 'age' ? true : false}
          />
          {props.unit ? <Text variant="bodySmall">{props.unit}</Text> : null}
        </View>
      </Surface>
    </View>
  );
}

export default InfoEditCardNumeric;

const styles = StyleSheet.create({
  surfaceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  surface: {
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    borderRadius: 10,
    height: 80,
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  textInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
