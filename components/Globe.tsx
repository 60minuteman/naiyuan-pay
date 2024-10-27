import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

const GLOBE_SIZE = 300;
const MARKER_SIZE = 5;

const markers = [
  { location: [14.5995, 120.9842] },
  { location: [19.076, 72.8777] },
  { location: [23.8103, 90.4125] },
  { location: [30.0444, 31.2357] },
  { location: [39.9042, 116.4074] },
  { location: [-23.5505, -46.6333] },
  { location: [19.4326, -99.1332] },
  { location: [40.7128, -74.006] },
  { location: [34.6937, 135.5022] },
  { location: [41.0082, 28.9784] },
];

export const Globe: React.FC = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.globe, { transform: [{ rotate: spin }] }]}>
        <Svg height={GLOBE_SIZE} width={GLOBE_SIZE}>
          <Circle
            cx={GLOBE_SIZE / 2}
            cy={GLOBE_SIZE / 2}
            r={GLOBE_SIZE / 2 - 1}
            stroke="#4D62CD"
            strokeWidth="2"
            fill="none"
          />
          <G>
            {markers.map((marker, index) => {
              const [lat, lon] = marker.location;
              const x = (lon + 180) * (GLOBE_SIZE / 360);
              const y = (90 - lat) * (GLOBE_SIZE / 180);
              return (
                <Circle
                  key={index}
                  cx={x}
                  cy={y}
                  r={MARKER_SIZE}
                  fill="#FB6415"
                />
              );
            })}
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  globe: {
    width: GLOBE_SIZE,
    height: GLOBE_SIZE,
  },
});
