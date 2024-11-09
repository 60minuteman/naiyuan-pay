import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const GLOBE_SIZE = width * 0.8; // 80% of screen width

export const Globe = () => {
  const webViewRef = useRef(null);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body {
            margin: 0;
            padding: 0;
            background: transparent;
            overflow: hidden;
          }
          canvas {
            width: 100%;
            height: 100%;
            touch-action: none;
          }
        </style>
        <script src="https://unpkg.com/cobe"></script>
      </head>
      <body>
        <canvas id="cobe"></canvas>
        <script>
          let phi = 0;
          let width = 0;
          
          const GLOBE_CONFIG = {
            width: ${GLOBE_SIZE * 2},
            height: ${GLOBE_SIZE * 2},
            devicePixelRatio: 2,
            phi: 0,
            theta: 0.3,
            dark: 0,
            diffuse: 0.4,
            mapSamples: 16000,
            mapBrightness: 1.2,
            baseColor: [1, 1, 1],
            markerColor: [251/255, 100/255, 21/255],
            glowColor: [1, 1, 1],
            markers: [
              { location: [14.5995, 120.9842], size: 0.03 },
              { location: [19.076, 72.8777], size: 0.1 },
              { location: [23.8103, 90.4125], size: 0.05 },
              { location: [30.0444, 31.2357], size: 0.07 },
              { location: [39.9042, 116.4074], size: 0.08 },
              { location: [-23.5505, -46.6333], size: 0.1 },
              { location: [19.4326, -99.1332], size: 0.1 },
              { location: [40.7128, -74.006], size: 0.1 },
              { location: [34.6937, 135.5022], size: 0.05 },
              { location: [41.0082, 28.9784], size: 0.06 }
            ],
            onRender: (state) => {
              state.phi = phi;
              phi += 0.005;
            }
          };

          const canvas = document.getElementById("cobe");
          createGlobe(canvas, GLOBE_CONFIG);
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={false}
        bounces={false}
        javaScriptEnabled={true}
        onError={(syntheticEvent) => {
          console.warn('WebView error:', syntheticEvent.nativeEvent);
        }}
        androidHardwareAccelerationDisabled={false}
        androidLayerType="hardware"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: GLOBE_SIZE,
    height: GLOBE_SIZE,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
