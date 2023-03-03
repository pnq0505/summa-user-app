import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { COLORS } from '../../theme';

const createStyle = (isPadding) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    childContainer: {
      flex: 1,
      paddingHorizontal: isPadding ? 10 : 0,
      backgroundColor: COLORS.secondaryTint,
    },
  });

const SummaScreen = ({ children, customContainer, isPadding = true }) => {
  const styles = createStyle(isPadding);

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.childContainer, customContainer]}>{children}</View>
    </SafeAreaView>
  );
};

export default SummaScreen;
