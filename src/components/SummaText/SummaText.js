import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../theme';

const createStyle = (color, textAlign) =>
  StyleSheet.create({
    text: {
      color: color ?? '#fff',
      textAlign: textAlign,
      fontWeight: FONTS.semiBold,
      fontSize: SIZES.medium,
    },
    doubleExtra: {
      fontSize: SIZES.doubleExtra,
      fontWeight: FONTS.extraBold,
    },
    extraLarge: {
      fontSize: SIZES.extraLarge,
      fontWeight: FONTS.extraBold,
    },
    large: {
      fontSize: SIZES.large,
      fontWeight: FONTS.extraBold,
    },
    medium: {
      fontSize: SIZES.medium,
      fontWeight: FONTS.regular,
    },
    mediumBold: {
      fontSize: SIZES.medium,
      fontWeight: FONTS.bold,
    },
    normal: {
      fontSize: SIZES.font,
      fontWeight: FONTS.regular,
    },
    normalBold: {
      fontSize: SIZES.font,
      fontWeight: FONTS.bold,
    },
    error: {
      color: COLORS.warning,
    },
  });

const SummaText = ({
  children,
  customText,
  textAlign = 'center',
  doubleExtra,
  extraLarge,
  large,
  medium,
  mediumBold,
  normal,
  normalBold,
  color,
  numberOfLines = 0,
  ellipsizeMode = 'tail',
  error,
  isSecure = false,
}) => {
  const styles = createStyle(color, textAlign);

  const styleCondition = [
    extraLarge && styles.extraLarge,
    large && styles.large,
    medium && styles.medium,
    mediumBold && styles.mediumBold,
    normal && styles.normal,
    normalBold && styles.normalBold,
    doubleExtra && styles.doubleExtra,
    error && styles.error,
  ];

  return (
    <Text
      style={[styles.text, customText, [...styleCondition]]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}>
      {isSecure ? '●●●●●●' : children}
    </Text>
  );
};

export default SummaText;
