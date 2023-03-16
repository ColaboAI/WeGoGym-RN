import React from 'react';
import { Card, Button, Text } from 'react-native-paper';

const NotificationCard = () => {
  return (
    <Card>
      <Card.Title title="Card Title" subtitle="Card Subtitle" />
      <Card.Content>
        <Text>Card content</Text>
      </Card.Content>
      <Card.Cover source={{ uri: 'https://picsum.photos/200/300' }} />
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
    </Card>
  );
};

export default NotificationCard;
