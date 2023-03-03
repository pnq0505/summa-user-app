import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { FONTS, SIZES } from '../../theme';
import HeaderButton from './HeaderButton';

const styles = StyleSheet.create({
  headerContainer: {
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 20,
    width: '100%',
  },
  labelContainer: { width: '100%' },
  labelHeader: {
    fontWeight: FONTS.extraBold,
    fontSize: SIZES.doubleExtra,
    color: '#fff',
  },
});

const SummaHeader = ({
  headerLabel,
  iconLeftButton = null,
  iconRightButton = null,
  handleLeftButton,
  handleRightButton,
}) => {
  return (
    <View style={{ paddingBottom: 10 }}>
      <View style={styles.headerContainer}>
        <HeaderButton
          icon={iconLeftButton}
          onPress={handleLeftButton}
          accessibilityLabel={'header-left'}
        />
        <HeaderButton
          icon={iconRightButton}
          onPress={handleRightButton}
          accessibilityLabel={'header-right'}
        />
      </View>
      <View>
        {headerLabel ? (
          <View style={styles.labelContainer}>
            <Text style={styles.labelHeader} numberOfLines={1} accessibilityLabel={'header-label'}>
              {headerLabel}
            </Text>
          </View>
        ) : (
          <View></View>
        )}
      </View>
    </View>
  );
};

export default SummaHeader;
