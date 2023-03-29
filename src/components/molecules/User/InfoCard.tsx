import { StyleSheet } from 'react-native';
import React from 'react';
import { Card, Text } from 'react-native-paper';

type Props = {
  textContent: string | number;
  textTitle: string;
};

function InfoCard(props: Props) {
  const textContentStyle = {
    marginBottom: 5,
  };
  return (
    <Card elevation={4} style={styles.cardContainer}>
      <Card.Content style={styles.card}>
        <Text variant="titleMedium" style={textContentStyle}>
          {props.textContent}
        </Text>
        <Text variant="bodySmall">{props.textTitle}</Text>
      </Card.Content>
    </Card>
  );
}

export default InfoCard;

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 85,
    height: 80,
    margin: 5,
  },

  card: {
    flexDirection: 'column',
    alignItems: 'center',
    overflow: 'hidden',
  },
});
