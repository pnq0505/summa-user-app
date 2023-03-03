import React from 'react';
import { View } from 'react-native';
import { COLORS } from '../../theme';

const boxSize = 70;

const CustomMarker = ({ markerDisplay, touchPosition }) => {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        display: markerDisplay,
        width: boxSize,
        height: boxSize,
        borderWidth: 2,
        borderColor: COLORS.summaOrange,
        borderStyle: 'dashed',
        top: touchPosition.y - boxSize / 2,
        left: touchPosition.x - boxSize / 2,
      }}></View>
  );
};

export default CustomMarker;
