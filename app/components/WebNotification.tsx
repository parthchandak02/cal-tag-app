import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

interface WebNotificationProps {
  title: string;
  body: string;
  onSnooze: () => void;
  onDismiss: () => void;
}

export function WebNotification({ title, body, onSnooze, onDismiss }: WebNotificationProps) {
  const theme = useTheme();

  return (
    <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <Card.Content>
        <Title style={{ color: theme.colors.text }}>{title}</Title>
        <Paragraph style={{ color: theme.colors.textSecondary }}>{body}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button onPress={onSnooze}>Snooze</Button>
        <Button onPress={onDismiss}>Dismiss</Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
});
