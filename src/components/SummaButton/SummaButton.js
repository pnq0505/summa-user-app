import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../theme';

const styles = StyleSheet.create({
  summaBtn: {
    borderRadius: 8,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 22,
    paddingRight: 22,
    minWidth: '48%',
    marginHorizontal: '1%',
    backgroundColor: COLORS.primary,
  },
  btnText: {
    color: 'white',
    fontWeight: FONTS.semiBold,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  btnDisabled: {
    backgroundColor: COLORS.btnDisabled,
  },
  fontDisabled: {
    color: COLORS.fontDisaled,
  },
});

const SummaButton = ({ children, customStyle, customText, onPressHanlder, disabled = false }) => {
  const btnCondition = [disabled && styles.btnDisabled];
  const fontCondition = [disabled && styles.fontDisabled];

  return (
    <TouchableOpacity
      style={[styles.summaBtn, customStyle, [...btnCondition]]}
      onPress={onPressHanlder}
      disabled={disabled}>
      <Text style={[styles.btnText, customText, [...fontCondition]]}>{children}</Text>
    </TouchableOpacity>
  );
};

export default SummaButton;
