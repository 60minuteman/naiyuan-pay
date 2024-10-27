import React, { ReactElement, useEffect, useState } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface AnimatedListProps {
  children: React.ReactNode[];
  delay?: number;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ children, delay = 2000 }) => {
  const [index, setIndex] = useState(0);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % children.length);
    }, delay);

    return () => clearInterval(interval);
  }, [children.length, delay]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.item, { opacity: fadeAnim }]}>
        {children[index]}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  item: {
    width: '100%',
  },
});