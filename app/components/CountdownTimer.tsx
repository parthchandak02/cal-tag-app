import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface CountdownTimerProps {
  targetDate: Date;
  label: string;
  onFinish?: () => void;  // Make onFinish optional
}

export function CountdownTimer({ targetDate, label, onFinish }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const theme = useTheme();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft(
          `${days}d ${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      } else {
        setTimeLeft('Past Due');
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        if (onFinish) {  // Check if onFinish is defined before calling it
          onFinish();
        }
      }
    };

    updateCountdown();
    intervalRef.current = setInterval(updateCountdown, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [targetDate, onFinish]);

  return (
    <Text style={[styles.countdownText, { color: theme.colors.textSecondary }]}>
      {label}: {timeLeft}
    </Text>
  );
}

const styles = StyleSheet.create({
  countdownText: {
    fontSize: 14,
    marginBottom: 4,
  },
});
