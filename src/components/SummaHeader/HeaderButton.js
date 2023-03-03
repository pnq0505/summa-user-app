import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const styles = StyleSheet.create({
  iconHeader: {
    width: 'auto',
  },
});

const HeaderButton = ({ icon, onPress, accessibilityLabel }) => {
  if (icon) {
    return (
      <TouchableOpacity
        onPress={onPress}
        style={styles.iconHeader}
        accessibilityLabel={accessibilityLabel}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>{icon}</View>
      </TouchableOpacity>
    );
  }
  return <View></View>;
};

export default HeaderButton;
