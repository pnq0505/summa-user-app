import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { COLORS } from '../../theme';

const createStyle = (isFloat, marginBottom) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isFloat ? COLORS.secondaryTint : 'trasnparent',
      zIndex: isFloat ? 99 : 1,
      position: isFloat ? 'absolute' : 'static',

      marginBottom: marginBottom,
    },
  });

const LoadingProgress = ({ progress, isFloat = true, marginBottom = 0 }) => {
  const styles = createStyle(isFloat, marginBottom);

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container]}>
      <Progress.Bar progress={progress / 100} width={200} height={6} />
    </View>
  );
};

export default LoadingProgress;
