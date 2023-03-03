import { Check } from 'phosphor-react-native';
import React from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { COLORS, FONTS, SIZES } from '../../theme';

const SummaDropDownPicker = ({
  open,
  setOpen,
  value,
  setValue,
  items,
  setItems,
  multiple = false,
  placeholder = 'Select an item',
  onPress,
  onSelectItem,
  mode = 'SIMPLE',
  badgeDotColors,
}) => {
  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      multiple={multiple}
      placeholder={placeholder}
      onPress={onPress}
      onSelectItem={onSelectItem}
      mode={mode}
      badgeTextStyle={{
        color: COLORS.secondaryTint,
      }}
      textStyle={{
        fontSize: SIZES.large,
        fontWeight: FONTS.extraBold,
        color: COLORS.secondaryTint,
      }}
      listItemContainerStyle={{
        backgroundColor: COLORS.secondaryTint,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}
      listItemLabelStyle={{
        color: 'white',
      }}
      TickIconComponent={({ style }) => <Check style={style} color="#f5f5f5" size={23} />}
    />
  );
};

export default SummaDropDownPicker;
