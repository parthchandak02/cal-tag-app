import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
}

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const theme = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${days.toString().padStart(2, '0')} days ${hours
            .toString()
            .padStart(2, '0')} hours ${minutes
            .toString()
            .padStart(2, '0')} minutes ${seconds.toString().padStart(2, '0')} seconds`
        );
      } else {
        setTimeLeft('Event started');
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <Text style={[styles.countdownText, { color: theme.colors.textSecondary }]}>
      {label} - {timeLeft}
    </Text>
  );
}

const styles = StyleSheet.create({
  countdownText: {
    fontSize: 12,
    marginTop: 4,
  },
});
